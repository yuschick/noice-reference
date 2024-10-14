import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Profile } from '@noice-com/schemas/profile/profile.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { ArenaState, AvatarData } from '../../api/types';
import { AnimationPool } from '../components/animationpool';
import { Avatar } from '../components/avatar';
import { AvatarUsername } from '../components/avatarusername';
import { ScreenController } from '../components/screencontroller';
import { SceneStateController } from '../scenestatecontroller';
import { LocatorStack } from '../utilities/locatorstack';
import { PriorityQueue } from '../utilities/priorityqueue';

import { Renderer } from 'renderer';
import { RendererSettingsHandler } from 'renderer/data';
import { CameraController } from 'scene/components/cameracontroller';
import { FullscreenController } from 'scene/components/fullscreencntroller';
import { Layer } from 'scene/layer';
import { Scene } from 'scene/scene';

const { log: logTemp } = makeLoggers('TempAvatars');
const USERNAMEFONTURL =
  'https://storage.googleapis.com/noice-client-assets-b9745b84/typeface-fonts/rubik-bold-three.json';

export interface ArenaStateControllerProps {
  renderer: Renderer;
  rendererSettingsHandler: RendererSettingsHandler;
  playerId: string;
  useNewLodFormat: boolean;
}

export class ArenaStateController extends SceneStateController {
  private _renderer: Renderer;
  private _localTeamId: Nullable<string>;
  private _animationStaggeredUpdateOffset: number;

  private _stateObjectNames = new Map<ArenaState, string>([
    [ArenaState.Game, 'State_Game'],
    [ArenaState.Intermission, 'State_Intermission'],
    [ArenaState.Spotlight, 'State_Spotlight'],
  ]);

  private _avatarAllocationOverrides: Map<string, { groupId: string; slotIndex: number }>;
  public get avatarAllocationOverrides() {
    return this._avatarAllocationOverrides;
  }

  private _scene: Nullable<Scene>;
  public get scene(): Nullable<Scene> {
    return this._scene;
  }

  private _arenaLayer: Nullable<Layer>;
  public get arenaLayer(): Nullable<Layer> {
    return this._arenaLayer;
  }

  private _avatarLayer: Nullable<Layer>;
  public get avatarLayer(): Nullable<Layer> {
    return this._avatarLayer;
  }

  private _streamLayer: Nullable<Layer>;
  public get streamLayer(): Nullable<Layer> {
    return this._streamLayer;
  }

  private _arenaState: ArenaState;
  public get arenaState() {
    return this._arenaState;
  }

  private _rendererSettingsHandler: RendererSettingsHandler;
  public get rendererSettingsHandler() {
    return this._rendererSettingsHandler;
  }

  private _loadQueue: PriorityQueue;
  public get loadQueue() {
    return this._loadQueue;
  }

  private _locatorStacks: Map<ArenaState, LocatorStack>;
  public get locatorStacks() {
    return this._locatorStacks;
  }

  private _avatars: Avatar[];
  public get avatars() {
    return this._avatars;
  }

  private _avatarUsernames: AvatarUsername[];
  public get avatarUsernames() {
    return this._avatarUsernames;
  }

  private _avatarMap: Map<string, Avatar>;
  public get avatarMap() {
    return this._avatarMap;
  }

  private _avatarFont?: Nullable<Font>;
  public get avatarFont() {
    return this._avatarFont;
  }

  private _temporaryAvatars: Map<string, string[]>;
  public get temporaryAvatars() {
    return this._temporaryAvatars;
  }

  private _playerId: string;
  public get playerId() {
    return this._playerId;
  }

  private _screenController: ScreenController;
  public get screenController() {
    return this._screenController;
  }

  private _fullscreenController: FullscreenController;
  public get fullscreenController() {
    return this._fullscreenController;
  }

  private _cameraController: CameraController;
  public get cameraController() {
    return this._cameraController;
  }

  private _useNewLodFormat: boolean;
  public get useNewLodFormat() {
    return this._useNewLodFormat;
  }

  private _supportedStates: ArenaState[];
  public get supportedStates() {
    return this._supportedStates;
  }

  public constructor(props: ArenaStateControllerProps) {
    super();

    const target = new THREE.Object3D();
    target.name = 'camera-target';

    this._playerId = props.playerId;
    this._useNewLodFormat = props.useNewLodFormat;
    this._localTeamId = null;
    this._animationStaggeredUpdateOffset = 0.0;
    this._scene = null;
    this._arenaLayer = null;
    this._avatarLayer = null;
    this._streamLayer = null;
    this._arenaState = ArenaState.None;
    this._rendererSettingsHandler = props.rendererSettingsHandler;
    this._loadQueue = new PriorityQueue(2);
    this._locatorStacks = new Map<ArenaState, LocatorStack>();
    this._avatars = [];
    this._avatarUsernames = [];
    this._temporaryAvatars = new Map<string, string[]>();
    this._avatarMap = new Map<string, Avatar>();
    this._avatarFont = null;
    this._renderer = props.renderer;
    this._screenController = new ScreenController(props.renderer, target);
    this._fullscreenController = new FullscreenController(props.renderer);
    this._cameraController = new CameraController(target);
    this._supportedStates = [];
    this._avatarAllocationOverrides = new Map<
      string,
      { groupId: string; slotIndex: number }
    >();
  }

  private _updateAvatarTransform(
    avatar: Avatar,
    locatorStack: LocatorStack,
    generateSlotIndex = false,
  ) {
    // Try to get overrides for this avatar
    // If they dont exist in the Map they are returned undefined and allocated based on AvatarData
    const overrides = this._avatarAllocationOverrides.get(avatar.avatarData.userId);
    const { groupId, slotIndex } = overrides ?? {
      groupId: undefined,
      slotIndex: undefined,
    };

    const transform = locatorStack.getOrAddAvatar(
      avatar.avatarData,
      groupId,
      slotIndex,
      generateSlotIndex,
    );
    avatar.setTransform(transform);
    avatar.setVisible(transform !== undefined);
  }

  private async _updateAvatarLodLevel(avatar: Avatar, level: Nullable<number> = null) {
    if (level !== null) {
      await avatar.loadAndSetLod(level);
    } else {
      avatar.lodLevel = avatar.getLodLevelBasedOnCrowdDetail();
    }
  }

  private _getSpotlightIndices(userCount: number): number[] {
    switch (userCount) {
      case 1:
        return [1];
      case 2:
        return [1, 2];
      case 3:
        return [0, 1, 2];
      default:
        return [0, 1, 2, 3];
    }
  }

  private _updateAvatars(deltaTime: number) {
    const animationRate = this.rendererSettingsHandler.crowdAnimationRate.value as number;

    /* This is left as a floating-point value on purpose. The idea is that some crowd sizes won't be perfectly divisible
     * by the throttling ratio we provide. Leaving this a floating-point number and nudging the two indices (see below)
     * makes sure that we can iterate over the entire crowd in exactly animationRate number of buckets.
     *
     * The amount of Players per bucket will vary a tiny bit for crowd sizes that cannot be perfectly divided by
     * animationRate, but averaged over a time period this will pretty much make sure we are measuring the performance
     * for exactly numberOfPlayersToAnimatePerUpdate amount of Players; be it 1 or 3.75. Better yet, the variance of the
     * bucket size is perfectly distributed among all of the buckets.
     *
     * Here's how this would work with a crowd size of 5 and at quarter rate:
     * 5 * 0.25 = 1.25
     *
     * 0.0 (rounded to 0) - 1.25 (rounded to 1): [0] updates
     * 1.25 (rounded to 1) - 2.5 (rounded to 3): [1, 2] update
     * 2.5 (rounded to 3) - 3.75 (rounded to 4): [3] updates
     * 3.75 (rounded to 4) - 5.0 (rounded to 5): [4] updates
     *
     * Here's the same example with a crowd size of 7 and at half rate:
     * 7 * 0.5 = 3.5
     *
     * 0.0 (rounded to 0) - 3.5 (rounded to 4): [0, 1, 2, 3] update
     * 3.5 (rounded to 4) - 7.0 (rounded to 7): [4, 5, 6] update
     *
     * For those who like their algorithms this is the same error quantization algorithm used in Bresenham's line
     * algorithm that MS Paint used to use for drawing continuous pixelated lines.
     *
     * Finally we make sure we animate at least 1 Player on every update. */
    const numberOfPlayersToAnimatePerUpdate = Math.max(
      this.avatars.length / animationRate,
      1.0,
    );

    const numberOfUpdatesPerPlayerAnimationUpdate = Math.floor(
      this.avatars.length / numberOfPlayersToAnimatePerUpdate,
    );

    /* We nudge the following two values by a small amount before rounding them to make sure we cannot end up in a
     * situation where we never update the last Player of the last bucket, potentially introduced by a floating-point
     * precision error. */

    const animateFrom = Math.round(this._animationStaggeredUpdateOffset + Number.EPSILON);

    const animateTo = Math.round(
      this._animationStaggeredUpdateOffset +
        numberOfPlayersToAnimatePerUpdate +
        Number.EPSILON,
    );

    let index = 0;

    this.avatars.forEach((avatar) => {
      avatar.update(deltaTime);

      if (index >= animateFrom && index < animateTo) {
        avatar.animate(deltaTime * numberOfUpdatesPerPlayerAnimationUpdate);
      }

      ++index;
    });

    this.avatarUsernames.forEach((username) => {
      if (username.headTarget === undefined) {
        username.dispose();
        const index = this._avatarUsernames.indexOf(username);
        if (index > -1) {
          this._avatarUsernames.splice(index, 1);
        }
      }

      username.update();
    });

    this._animationStaggeredUpdateOffset += numberOfPlayersToAnimatePerUpdate;

    if (this._animationStaggeredUpdateOffset >= this.avatars.length) {
      this._animationStaggeredUpdateOffset = 0.0;
    }
  }

  public init(streamLayer: Layer, scene: Scene) {
    this._scene = scene;
    this._streamLayer = streamLayer;

    this.screenController.init(scene, streamLayer);

    if (this._renderer.rendererFlags.showUsernames) {
      const loader = new FontLoader();
      loader.load(USERNAMEFONTURL, (f) => {
        this._avatarFont = f;
      });
    }

    this.fullscreenController.init(scene);
    this.fullscreenController.enabled = true;
  }

  public initArena(arenaLayer: Layer, avatarLayer: Layer) {
    if (!arenaLayer || !avatarLayer || !this.scene || !this._scene?.camera) {
      return;
    }

    this._arenaLayer = arenaLayer;
    this._avatarLayer = avatarLayer;

    this._screenController.initArena();

    this._screenController.enabled = true;
    this._fullscreenController.enabled = false;

    if (this.cameraController.camera) {
      this._scene.setMainCamera(this.cameraController.camera);
    }
  }

  public update(_scene: Scene, deltaTime: number) {
    this._screenController.update(deltaTime);
    this._fullscreenController.update(deltaTime);
    this._cameraController.update(deltaTime);

    this._updateAvatars(deltaTime);
  }

  public async setArenaState(arenaState: ArenaState) {
    this._arenaState = arenaState;

    this._avatarUsernames.forEach((username) => {
      username?.dispose();
    });
    this._avatarUsernames = [];

    // Set Avatar lod levels
    this.avatars.forEach(async (avatar) => {
      if (
        this._avatarAllocationOverrides.get(avatar.avatarData.userId)?.groupId ===
        'Spotlight'
      ) {
        await this._updateAvatarLodLevel(avatar, avatar.minimumLODLevel + 1);
      } else {
        this._updateAvatarLodLevel(avatar);
      }
    });

    this.screenController.setArenaState(arenaState);

    const locatorStack = this.locatorStacks.get(arenaState);
    if (!locatorStack) {
      return;
    }

    this.cameraController.setArenaState(arenaState);

    const arenaStates = Object.values(ArenaState).filter(
      (prop) => prop in ArenaState,
    ) as ArenaState[];

    // Set all StateObjects
    arenaStates.forEach((state) => {
      const stateObjectName = this._stateObjectNames.get(state);
      const isVisible = state === arenaState;
      if (this._arenaLayer && stateObjectName) {
        const stateObject = this._arenaLayer.getObjectByName(stateObjectName);
        stateObject?.traverse((object) => {
          object.visible = isVisible;
        });
      }
    });

    // Update Avatar Transforms
    this.avatars.forEach((avatar) => {
      const generateSlotIndex = arenaState !== ArenaState.Game;
      this._updateAvatarTransform(avatar, locatorStack, generateSlotIndex);

      if (arenaState === ArenaState.Game && avatar.isMemberOfLocalGroup) {
        this.addAvatarUsername(avatar);
      }
    });

    if (arenaState === ArenaState.Intermission) {
      this.avatars.forEach((avatar) => {
        avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_VICTORY);
      });
    } else if (arenaState === ArenaState.Spotlight) {
      this.avatars.forEach((avatar) => {
        avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_VICTORY);
        this.addAvatarUsername(avatar);
      });
    } else {
      this.avatars.forEach((avatar) => {
        avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_IDLE);
      });
    }
  }

  public setLocalTeamId(localTeamId: Nullable<string>): void {
    this._localTeamId = localTeamId;
    if (!localTeamId) {
      return;
    }

    // LocalTeamId only applies to Game state
    const locatorStack = this.locatorStacks.get(ArenaState.Game);
    if (!locatorStack) {
      return;
    }

    // When we set LocalTeamID we need to reserve the player team locators for Game state
    // Its possible that avatars have already been added, so re-allocate everything
    locatorStack.resetAllocations();
    locatorStack.reserveGroup(0, localTeamId);

    // If we are in game state, now we need to re-allocate the transforms
    // IF we are not in game state, these will get re-allocated when changing state
    if (this.arenaState === ArenaState.Game) {
      this.avatars.forEach((avatar) => {
        // If this event arrives before the addAvatar call for the player avatar
        // we need to ignore the player avatar so it doesnt jump between groups
        if (
          avatar.avatarData.userId !== this.playerId ||
          avatar.avatarData.groupId === localTeamId
        ) {
          this._updateAvatarTransform(avatar, locatorStack);
        }
      });
    }
  }

  public setSpotlightUsers(userIds: string[]) {
    const spotlightState = ArenaState.Spotlight;
    const locatorStack = this.locatorStacks.get(spotlightState);
    if (!locatorStack) {
      return;
    }

    const spotlightGroupId = `Spotlight`;
    this._avatarAllocationOverrides.clear();
    locatorStack.resetAllocations();
    locatorStack.reserveGroup(0, spotlightGroupId);

    const slotIds = this._getSpotlightIndices(userIds.length);

    for (let i = 0; i < userIds.length; i++) {
      this._avatarAllocationOverrides.set(userIds[i], {
        groupId: spotlightGroupId,
        slotIndex: slotIds[i],
      });
    }
  }

  public async addAvatar(
    avatarData: AvatarData,
    modelLoadQueue: PriorityQueue,
    animationPool: AnimationPool,
    rendererSettingsHandler: RendererSettingsHandler,
    profileData?: Profile | undefined,
  ) {
    const userId = avatarData.userId;
    const existingAvatar = this.avatarMap.get(userId);
    if (existingAvatar) {
      // We dont get a removeAvatar event when the player switches teams
      // So we need to do a per-property equality check here
      // If the team/slot properties are unchanged this is a duplicate event so ignore
      if (
        avatarData.groupId === existingAvatar.avatarData.groupId &&
        avatarData.slotIndex === existingAvatar.avatarData.slotIndex
      ) {
        return;
      } else {
        // Otherwise remove it and re-add
        this.removeAvatar(avatarData.userId);
      }
    }

    // Create Avatar
    const isMemberOfLocalGroup = avatarData.groupId === this._localTeamId;
    const avatar = new Avatar(
      avatarData,
      profileData?.displayName,
      profileData?.preferredColor,
      isMemberOfLocalGroup,
      rendererSettingsHandler.crowdDetail,
      rendererSettingsHandler.crowdMode,
      this._useNewLodFormat,
    );

    // If this is a temporary avatar track it under its temporary flag
    // This allows us to easily remove all temporary avatars sharing that flag
    if (avatarData.temporaryFlag !== undefined) {
      let temporaryAvatars = this._temporaryAvatars.get(avatarData.temporaryFlag);
      if (!temporaryAvatars) {
        logTemp(`Create Temporary Avatar bucket with flag ${avatarData.temporaryFlag}`);
        temporaryAvatars = [];
        this.temporaryAvatars.set(avatarData.temporaryFlag, temporaryAvatars);
      }

      temporaryAvatars.push(avatarData.userId);
      logTemp(
        `Add Temporary Avatar ${avatarData.userId} to bucket ${avatarData.temporaryFlag}`,
      );
    }

    // We need to add the username here because the avatar is still loading and the username needs to get the head target.
    // After this the setArenaState handles setting usernames.
    avatar.modelLoadQueue = modelLoadQueue;
    await avatar.load(undefined, (avatar) => {
      if (avatar.isMemberOfLocalGroup && this.arenaState === ArenaState.Game) {
        this.addAvatarUsername(avatar);
      }
    });

    avatar.useAnimations(animationPool);

    this.avatars.push(avatar);
    this.avatarMap.set(userId, avatar);

    // Set Avatar state
    const locatorStack = this.locatorStacks.get(this.arenaState);
    if (!locatorStack) {
      return;
    }

    const generateSlotIndex = this._arenaState !== ArenaState.Game;
    this._updateAvatarTransform(avatar, locatorStack, generateSlotIndex);
    this._avatarLayer?.add(avatar);

    avatar?.triggerAnimationByCategory(AnimationCategory.CATEGORY_PLAYER_JOIN);
  }

  public removeAvatar(userId: string) {
    const avatar = this.avatarMap.get(userId);
    if (avatar === undefined) {
      return;
    }

    const avatarData = avatar.avatarData;
    this.locatorStacks.forEach((locatorStack) => {
      locatorStack.removeAvatar(avatarData);
    });

    const index = this.avatars.indexOf(avatar);
    if (index > -1) {
      this.avatars.splice(index, 1);
    }

    this.avatarMap.delete(userId);
    avatar.removeFromParent();
    avatar.destruct();
  }

  public addAvatarUsername(avatar: Avatar) {
    if (this._renderer.rendererFlags.showUsernames === true) {
      if (this._avatarFont && this._scene && this._scene.camera) {
        const avatarUsername = new AvatarUsername(
          avatar,
          this._avatarFont,
          this._scene.camera,
        );

        this._avatarUsernames.push(avatarUsername);
        avatarUsername.setHeadTarget(avatar.headTarget);
      }
    }
  }

  public removeTemporaryAvatars(temporaryFlag: string) {
    const temporaryAvatars = this._temporaryAvatars.get(temporaryFlag);
    if (temporaryAvatars) {
      const userIds = this.temporaryAvatars.get(temporaryFlag);
      if (!userIds) {
        return;
      }

      for (let i = 0; i < userIds?.length; i++) {
        const userId = userIds[i];
        this.removeAvatar(userId);
        logTemp(`Remove Temporary Avatar ${userId} from bucket ${temporaryFlag}`);
      }

      this.temporaryAvatars.delete(temporaryFlag);
      logTemp(`Delete Temporary Avatar bucket with flag ${temporaryFlag}`);
    }
  }

  public setSupportedStates(supportedStates: ArenaState[]) {
    this._supportedStates = supportedStates;
  }
}
