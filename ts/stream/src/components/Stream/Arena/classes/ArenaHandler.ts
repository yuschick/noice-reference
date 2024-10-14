import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
import { Animation, AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import {
  ArenaConfig,
  ArenaConfigAvatarSlot,
  ArenaConfigTeamLocator,
  AvatarConfigs,
  AvatarConfigsAvatar,
} from '@noice-com/schemas/rendering/config.pb';
import {
  BoosterRequestedEvent,
  BoosterUsedEvent,
  CardSetActiveEvent,
  ChatMessageSentEvent,
  EmojiEvent,
  EmoteEvent,
  GroupCheerEvent,
  MatchEndEvent,
} from '@noice-com/schemas/rendering/events.pb';
import {
  CameraTransitionRequest,
  CameraTransitionRequestTransitionTarget,
} from '@noice-com/schemas/rendering/transitions.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import {
  AnimationPoolV2,
  API,
  Avatar,
  Graphics,
  Hierarchy,
  PlayerV3,
  PriorityQueue,
} from '@noice-com/web-renderer/src/legacy';

import { AvatarWithTeamId, TeamLocator } from '@stream-types';

// #region Helpers

const { logWarn } = makeLoggers('Arena Handler');

// This is the linear index of a given avatar for a given group
// ie. if it is the 1st slot in the 5th group, it will always be the same index.
// ie. team (index * numAvatars) + slot
export const getAvatarId = (
  teamLocator: ArenaConfigTeamLocator,
  avatarSlot: ArenaConfigAvatarSlot,
): number => {
  if (!teamLocator || !teamLocator.avatarSlots) {
    return 0;
  }

  return (
    teamLocator.avatarSlots.length * (teamLocator.teamIndex || 0) +
    (avatarSlot.slotIndex || 0)
  );
};

// This is the linear index of the given group
// ie. index * numAvatars
export const getTeamIndex = (teamLocator: ArenaConfigTeamLocator): number => {
  if (!teamLocator || !teamLocator.avatarSlots) {
    return 0;
  }

  return (teamLocator.teamIndex || 0) * teamLocator.avatarSlots.length;
};
// #endregion Helpers

interface HandlerArgs {
  graphics: Graphics;
  animations: Animation[];
  localGroupId?: string;
  crowdMode?: CrowdMode;

  featureFlags?: { [feature: string]: string };
}

export class ArenaHandler {
  // Constants / Config
  public avatarOverrideUrl: Nullable<string> = null;

  private _initAnimPromise: Promise<void>;
  private _modelLoadQueue: Nullable<PriorityQueue> = null;
  private _activeTransitionTarget =
    CameraTransitionRequestTransitionTarget.TRANSITION_TARGET_UNSPECIFIED;

  // References
  private _graphics: Nullable<Graphics> = null;
  private _animationPool: AnimationPoolV2;
  private _timeouts: number[] = [];

  // Stateful props
  private _localGroupId?: string;
  private _teamIndexById: Record<string, number> = {};
  private _avatars: API.Avatar[] = [];
  private _slots: API.Slot[] = [];
  private _arena: Nullable<Hierarchy.Arena> = null;
  private _crowd: Nullable<Hierarchy.Crowd> = null;
  private _initialAvatarsExist = false;
  private _initialRender = false;
  private _crowdMode: CrowdMode = CrowdMode.All;
  private _featureFlags: { [feature: string]: string } = {};
  private _eventQueue: (() => Promise<void> | void)[] = [];
  private _eventQueueRunning = false;

  // Persistent props
  private _avatarsWithTeamId: AvatarWithTeamId[] = [];
  private _teamLocators: TeamLocator[] = [];
  private _renderedAvatars: Map<string, Avatar> = new Map();
  private _emojiCount = 0;
  private _emoteCount = 0;
  private _emojiVersion: number;
  private _avatarsHidden = false;

  // NOTE: These getters are mostly for test purposes.

  public get initialAvatarsExist(): boolean {
    return this._initialAvatarsExist;
  }

  public get initialRenderOccurred(): boolean {
    return this._initialRender;
  }

  public get arenaExists(): boolean {
    return this._arena !== null;
  }

  public get arena(): Nullable<Hierarchy.Arena> {
    return this._arena;
  }

  public get crowdExists(): boolean {
    return this._crowd !== null;
  }

  public get crowd(): Nullable<Hierarchy.Crowd> {
    return this._crowd;
  }

  public get renderedAvatars(): ReadonlyMap<string, Avatar> {
    return this._renderedAvatars;
  }

  public get emojiCount(): number {
    return this._emojiCount;
  }

  public get emoteCount(): number {
    return this._emoteCount;
  }

  public get trackedAvatarCount(): number {
    return this._avatarsWithTeamId.length;
  }

  public get renderedAvatarCount(): number {
    return this._renderedAvatars.size;
  }

  public get localGroupId(): string | undefined {
    return this._localGroupId;
  }

  public set localGroupId(groupId: string | undefined) {
    this._localGroupId = groupId;
  }

  public set crowdMode(mode: CrowdMode) {
    if (this._crowdMode === mode) {
      return;
    }

    this._crowdMode = mode;

    if (this._isInitialStateReady()) {
      this._recalculateTeamIndices();
      this._recalculateAvatarSlots();
      this._addAvatarsToCrowd();
    }
  }
  public get crowdMode(): CrowdMode {
    return this._crowdMode;
  }

  constructor({ graphics, animations, localGroupId, featureFlags }: HandlerArgs) {
    this._graphics = graphics;

    this._animationPool = new AnimationPoolV2(animations);
    this._initAnimPromise = Promise.all([
      this._animationPool.loadAnimationsByCategory(AnimationCategory.CATEGORY_IDLE),
      this._animationPool.loadAnimationsByCategory(
        AnimationCategory.CATEGORY_PLAYER_JOIN,
      ),
    ]).then(() => {
      return;
    });

    this._localGroupId = localGroupId;

    this._featureFlags = featureFlags || {};
    this._emojiVersion = this._getNumericFeatureFlag('emojiVersion', 1);

    const parallelLimit = this._getNumericFeatureFlag('avatarLoadParallelLimit', 0);
    if (parallelLimit > 0) {
      this._modelLoadQueue = new PriorityQueue(parallelLimit);
    }
  }

  // #region Utils
  private _getFeatureFlag(name: string, defaultValue: string): string {
    return this._featureFlags[name] || defaultValue;
  }

  private _getBooleanFeatureFlag(name: string, defaultValue: boolean): boolean {
    const value = this._getFeatureFlag(
      name,
      defaultValue === true ? 'enabled' : 'disabled',
    );

    return value === 'enabled' || value === 'true';
  }

  private _getNumericFeatureFlag(name: string, defaultValue: number): number {
    const value = this._featureFlags[name];

    return value ? parseInt(value, 10) : defaultValue;
  }

  /**
   * Recalculates the team indices and saves them to the _teamIndexById prop.
   * It is HIGHLY recommended to recalculate avatar slots after this completes
   * (ie via _recalculateAvatars())
   *
   * 1. Both arena + avatars are ready
   * 2. We get an avatar event
   * 3. The local group id changes
   */

  private _recalculateTeamIndices(): void {
    if (this._teamLocators.length === 0) {
      return;
    }

    // Get all unique team ids
    const teams = [...new Set(this._avatarsWithTeamId.map((avatars) => avatars.teamId))];

    const teamIndexById: Record<string, number> = {};

    teams.forEach((teamId) => {
      // Team is local team
      if (this._localGroupId === teamId) {
        // Get the team locator that is for local team, and it's team index
        const localTeamIndex =
          this._teamLocators.find((teamLocator) => teamLocator.isLocalTeam)?.teamIndex ??
          -1;

        if (localTeamIndex < 0) {
          logWarn('Local team index not found!');
          return;
        }

        teamIndexById[teamId] = localTeamIndex;
        return;
      }

      // Team is not local team

      // Find the team locator that is not for local team and not used by any other team
      const teamIndex =
        this._teamLocators.find(
          (teamLocator) =>
            !teamLocator.isLocalTeam &&
            !Object.values(teamIndexById).some(
              (usedTeamIndex) => usedTeamIndex === teamLocator.teamIndex,
            ),
        )?.teamIndex ?? -1;

      if (teamIndex < 0) {
        logWarn(`Team index not found for ${teamId}!`);
        return;
      }

      teamIndexById[teamId] = teamIndex;
    });

    this._teamIndexById = teamIndexById;
  }

  /**
   * Recalculates the avatar slots.
   *
   * It is recommended to call this whenever _avatarsWithTeamId changes,
   * or whenever the team indices change (_teamIndexById, so after something
   * calls _recalculateTeamIndices()).
   */

  private _recalculateAvatarSlots() {
    if (!this._avatarsWithTeamId.length || !Object.keys(this._teamIndexById).length) {
      return;
    }

    if (this._crowdMode === CrowdMode.Disabled) {
      this._avatars = [];
      return;
    }

    this._avatars = [];

    this._avatarsWithTeamId.forEach((avatar) => {
      if (
        this._crowdMode === CrowdMode.LocalGroupOnly &&
        avatar.teamId !== this._localGroupId
      ) {
        return;
      }

      this._avatars.push({
        ...avatar,
        slot: this._teamIndexById[avatar.teamId] + avatar.slot,
      });
    });
  }
  // #endregion Utils

  // #region Lifecycle
  private _isInitialStateReady(): boolean {
    return this.arenaExists && this.crowdExists && this._initialAvatarsExist;
  }

  private _createAvatarInCrowd(descriptor: API.Avatar): Nullable<Avatar> {
    if (!this._graphics || !this._crowd) {
      logWarn(`Graphics system not initialized`);
      return null;
    } else if (descriptor.version < 3 || descriptor.version > 3) {
      logWarn(`Unsupported Avatar version: ${descriptor.version}`);
      return null;
    } else if (this._renderedAvatars.has(descriptor.id) === true) {
      logWarn(`Avatar(${descriptor.id}) already exists`);
      return null;
    }

    let avatar: Nullable<Avatar> = null;

    if (descriptor.version === 3) {
      avatar = new PlayerV3(
        descriptor,
        this._graphics.renderQualityObservables.crowdDetail,
      );
    }

    if (!avatar) {
      logWarn(`Failed creating Avatar(${descriptor.id})`);
      return null;
    }

    avatar.modelLoadQueue = this._modelLoadQueue;
    avatar.load();
    avatar.useAnimations(this._animationPool);

    this._updateAvatarSlot(avatar, descriptor.slot);

    this._renderedAvatars.set(descriptor.id, avatar);
    this._crowd.add(avatar);

    return avatar;
  }

  private _destroyAvatarsInCrowd(): void {
    for (const avatar of this._renderedAvatars.values()) {
      avatar.removeFromParent();
      avatar.destruct();
    }

    this._renderedAvatars.clear();
  }

  private _updateAvatarSlot(avatar: Avatar, index: number): boolean {
    if (!this._arena) {
      return false;
    }

    const slot = this._slots.find((slot) => index === slot.id);

    if (!slot) {
      logWarn(`Slot ${index} not found, available slots are:`, this._slots);
      return false;
    }

    avatar.slot = slot;
    return true;
  }

  private _addAvatarsToCrowd(): void {
    this._initialRender = true;

    if (this._renderedAvatars.size === 0) {
      this._avatars.forEach((descriptor) => {
        const avatar = this._createAvatarInCrowd(descriptor);
        avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_IDLE);
      });

      return;
    }

    const avatarsToAdd: API.Avatar[] = [];
    const avatarsToUpdate: API.Avatar[] = [];

    for (const descriptor of this._avatars) {
      if (this._renderedAvatars.has(descriptor.id)) {
        avatarsToUpdate.push(descriptor);
        continue;
      }

      avatarsToAdd.push(descriptor);
    }

    avatarsToAdd.forEach((descriptor) => {
      const avatar = this._createAvatarInCrowd(descriptor);
      avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_PLAYER_JOIN);
    }, []);

    avatarsToUpdate.forEach((descriptor) => {
      const avatar = this._renderedAvatars.get(descriptor.id);

      if (!avatar) {
        return;
      }

      this._updateAvatarSlot(avatar, descriptor.slot);
    });

    for (const id of this._renderedAvatars.keys()) {
      const index = this._avatars.findIndex((descriptor) => id === descriptor.id);

      if (index === -1) {
        const avatar = this._renderedAvatars.get(id);

        avatar?.removeFromParent();
        avatar?.destruct();

        this._renderedAvatars.delete(id);
      }
    }
  }
  // #endregion Lifecycle

  // #region Handlers
  private _onArenaEvent = async (event: ArenaConfig): Promise<void> => {
    const isPerArenaPostProcessingEnabled = this._getBooleanFeatureFlag(
      'perArenaPostProcessing',
      false,
    );

    if (
      typeof event.teamLocators === 'undefined' ||
      typeof event.cameras === 'undefined' ||
      typeof event.lights === 'undefined' ||
      typeof event.renderSettings === 'undefined' ||
      (isPerArenaPostProcessingEnabled === true &&
        typeof event.postProcessData === 'undefined')
    ) {
      logWarn(`Invalid arena data!`, event);
      return;
    }

    if (!this._graphics) {
      logWarn('Graphics context not initialized!');
      return;
    }

    const arenaName = event.name || 'Undefined';

    this._slots = event.teamLocators
      .map((teamLocator) =>
        teamLocator.avatarSlots?.map<API.Slot>((avatar) => ({
          transform: {
            position: avatar.position,
            rotation: avatar.rotation,
          },
          id: getAvatarId(teamLocator, avatar),
        })),
      )
      .flat() as API.Slot[];

    const { cameras, lights, renderSettings, ingestTextureTransforms } = event;

    if (this._arena) {
      if (arenaName === this._arena.name) {
        return;
      }

      if (this._crowd) {
        this._destroyAvatarsInCrowd();

        this._crowd.destruct();
        this._crowd = null;
      }

      this._arena.destruct();
      this._arena = null;
    }

    this._teamLocators = event.teamLocators.map<TeamLocator>((teamLocator) => ({
      isLocalTeam: teamLocator.isLocalTeam || false,
      teamIndex: getTeamIndex(teamLocator),
    }));

    this._arena = new Hierarchy.Arena(
      this._graphics,

      {
        name: arenaName,
        cameras,
        lights,
        renderSettings,
        ingestTransforms: ingestTextureTransforms,
      },
    );

    this._crowd = new Hierarchy.Crowd(
      this._graphics.renderQualityObservables.crowdAnimationRate,
    );

    this._arena.add(this._crowd);
    this._graphics.getRenderer().registerSandbox(this._arena);

    if (this._isInitialStateReady()) {
      this._recalculateTeamIndices();
      this._recalculateAvatarSlots();
      this._addAvatarsToCrowd();
    }

    await this._arena.load();

    /*
     For safety set the hidden status also here if the hide call
     happened before arena arena config was received
    */
    if (!this._arena) {
      return;
    }

    this._arena.setAvatarsHidden(this._avatarsHidden);
  };

  private _onAvatarsEvent = async (
    event: AvatarConfigs,
    _eventAgeMs: number,
  ): Promise<void> => {
    if (typeof event.avatars === 'undefined') {
      return;
    }

    await this._initAnimPromise;

    this._avatarsWithTeamId = event.avatars.map<AvatarWithTeamId>((avatar) => ({
      id: avatar.userId || '',
      version: 3,
      generatorVersion: avatar.generatorVersion || 'unknown',
      // If there is avatar override, use it instead
      url: this.avatarOverrideUrl || avatar.url || '',
      lodURLs: this.avatarOverrideUrl ? [this.avatarOverrideUrl] : avatar.lodUrls || [],
      slot: avatar.slotIndex || 0,
      teamId: avatar.groupId || '',
      isMemberOfLocalGroup: avatar.groupId === this._localGroupId,
      applyShoeOffset: this._getBooleanFeatureFlag('avatars_applyShoeOffset', false),
    }));

    this._initialAvatarsExist = true;
    this._recalculateTeamIndices();
    this._recalculateAvatarSlots();

    if (this._isInitialStateReady()) {
      this._addAvatarsToCrowd();
    }
  };

  // @todo should we store these timeouts somewhere so we can clean them up if another
  // request comes in before these have resolved, to prevent weird states?
  private _onCameraTransitionRequest = (
    _event: CameraTransitionRequest,
    _eventAgeMs: number,
  ): void => {
    // Currently this is not needed but left here for future purposes
  };

  private _onEmoteEvent = (event: EmoteEvent): void => {
    if (!event.animationId || !event.userId) {
      return;
    }

    this._emoteCount++;

    const avatar = this._renderedAvatars.get(event.userId);
    avatar?.triggerAnimationById(event.animationId);
  };

  private _onEmojiEvent = (event: EmojiEvent): void => {
    if (!event.emojiName || !event.userId || !event.emojiUrl) {
      return;
    }

    this._emojiCount++;

    const avatar = this._renderedAvatars.get(event.userId);
    avatar?.triggerEmoji(event.emojiName, event.emojiUrl, this._emojiVersion);
  };

  private _onCardSetActiveEvent = (event: CardSetActiveEvent): void => {
    if (!event.cardRarity || !event.userId) {
      return;
    }

    const avatar = this._renderedAvatars.get(event.userId);
    avatar?.selectCard(event.cardRarity);
  };

  private _onBoosterRequestedEvent = (event: BoosterRequestedEvent): void => {
    if (!event.userId || !event.targetUserId || !event.boosterId) {
      return;
    }

    const source = this._renderedAvatars.get(event.userId);
    const target = this._renderedAvatars.get(event.targetUserId);

    if (!source || !target) {
      return;
    }

    source.requestBooster(target, event.boosterId);
  };

  private _onBoosterUsedEvent = (event: BoosterUsedEvent): void => {
    if (!event.userId || !event.targetUserId || !event.boosterId) {
      return;
    }

    const source = this._renderedAvatars.get(event.userId);
    const target = this._renderedAvatars.get(event.targetUserId);

    if (!source || !target) {
      return;
    }

    source.useBooster(target, event.boosterId);
  };

  private _onChatMessageSentEvent = (event: ChatMessageSentEvent): void => {
    if (!event.userId) {
      return;
    }

    const avatar = this._renderedAvatars.get(event.userId);
    avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_CHAT_MESSAGE);
  };

  private _onGroupCheerEvent = (event: GroupCheerEvent): void => {
    if (!event.participantIds) {
      return;
    }

    event.participantIds.forEach((id) => {
      const avatar = this._renderedAvatars.get(id);
      avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_CHEER);
    });
  };

  private _onMatchStartEvent = (): void => {
    for (const avatar of this._renderedAvatars.values()) {
      avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_EXCITED);
    }
  };

  private _onMatchEndEvent = (event: MatchEndEvent): void => {
    const bestGroupAvatarIds = this._avatarsWithTeamId
      // Get avatars that are in best group
      .filter((avatar) => avatar.teamId === event.bestGroupId)
      // Get the id for them
      .map((avatar) => avatar.id);

    for (const id of bestGroupAvatarIds) {
      const avatar = this._renderedAvatars.get(id);
      avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_EXCITED);
    }
  };

  private _onAvatarUpdateEvent = (event: AvatarConfigsAvatar): void => {
    if (!event.userId) {
      return;
    }

    let avatar = this._renderedAvatars.get(event.userId) || null;

    if (!avatar) {
      return;
    }

    const avatarDesc = this._avatars.find((descriptor) => event.userId === descriptor.id);
    if (!avatarDesc) {
      return;
    }

    avatarDesc.lodURLs = event.lodUrls || [];
    avatarDesc.url = event.url || '';

    // hack to force recreation of the objet
    avatar.removeFromParent();
    avatar.destruct();
    this._renderedAvatars.delete(event.userId);

    avatar = this._createAvatarInCrowd(avatarDesc);
    avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_IDLE);
  };

  // #endregion Handlers

  private async _processEventQueue() {
    if (this._eventQueueRunning) {
      return;
    }

    this._eventQueueRunning = true;
    while (this._eventQueueRunning && this._eventQueue.length > 0) {
      const cb = this._eventQueue.shift();
      if (cb) {
        try {
          await cb();
        } catch (e) {
          logWarn('Error processing event queue', e);
        }
      }
    }
    this._eventQueueRunning = false;
  }

  private _queueEvent(cb: (...args: any) => Promise<void> | void) {
    return (...args: any) => {
      const r = new Promise<void>((resolve) => {
        this._eventQueue.push(async () => {
          await cb(...args);
          resolve();
        });
      });

      this._processEventQueue();

      return r;
    };
  }

  public updateVideoFrame(frame: VideoFrame): void {
    const isUseVideoFrameEnabled = this._getBooleanFeatureFlag('useVideoFame', false);

    if (this._graphics === null || !isUseVideoFrameEnabled) {
      frame.close();
      return;
    }

    this._graphics.getRenderer().updateVideoFrame(frame);
  }

  public setArenaHidden(hidden: boolean) {
    this._avatarsHidden = hidden;
    this._arena?.setAvatarsHidden(this._avatarsHidden);
  }

  public consumeMetrics() {
    const emojiCount = this._emojiCount;
    const emoteCount = this._emoteCount;
    const avatarCount = this._renderedAvatars.size;
    const avatarVersions: { [key: string]: number } = {};

    for (const avatar of this._renderedAvatars.values()) {
      const avatarGeneratorVersion = (avatar as PlayerV3)?.generatorVersion || 'unknown';
      if (avatarGeneratorVersion in avatarVersions) {
        avatarVersions[avatarGeneratorVersion]++;
      } else {
        avatarVersions[avatarGeneratorVersion] = 1;
      }
    }

    this._emojiCount = 0;
    this._emoteCount = 0;

    return {
      emojiCount,
      emoteCount,
      avatarCount,
      avatarVersions,
    };
  }

  public getHandlers = () => ({
    onArenaEvent: this._queueEvent(this._onArenaEvent),
    onAvatarsEvent: this._queueEvent(this._onAvatarsEvent),
    onCameraTransitionRequest: this._queueEvent(this._onCameraTransitionRequest),
    onEmoteEvent: this._queueEvent(this._onEmoteEvent),
    onEmojiEvent: this._queueEvent(this._onEmojiEvent),
    onCardSetActiveEvent: this._queueEvent(this._onCardSetActiveEvent),
    onBoosterRequestedEvent: this._queueEvent(this._onBoosterRequestedEvent),
    onBoosterUsedEvent: this._queueEvent(this._onBoosterUsedEvent),
    onChatMessageSentEvent: this._queueEvent(this._onChatMessageSentEvent),
    onGroupCheerEvent: this._queueEvent(this._onGroupCheerEvent),
    onMatchStartEvent: this._queueEvent(this._onMatchStartEvent),
    onMatchEndEvent: this._queueEvent(this._onMatchEndEvent),
    onAvatarUpdateEvent: this._queueEvent(this._onAvatarUpdateEvent),
  });

  public destroy(): void {
    this._eventQueueRunning = false;

    if (this._crowd) {
      this._destroyAvatarsInCrowd();

      this._crowd.destruct();
      this._crowd = null;
    }

    if (this._arena) {
      this._graphics?.destruct();

      this._arena.destruct();
      this._arena = null;
    }

    this._graphics = null;

    // Clear any timeouts we may have active...
    const currTimeouts = this._timeouts.length;

    if (currTimeouts === 0) {
      return;
    }

    const activeTimeouts = [...this._timeouts.splice(0, currTimeouts)];
    activeTimeouts.forEach(clearTimeout);
  }
}
