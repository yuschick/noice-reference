import { ClientSideArena } from '@noice-com/schemas/arena/arena.pb';
import { Animation, AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Avatar } from '@noice-com/schemas/avatar/avatar.pb';
import { Profile } from '@noice-com/schemas/profile/profile.pb';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import { ArenaConfig, AvatarConfigsAvatar } from '@noice-com/schemas/rendering/config.pb';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import {
  GraphicsController,
  RendererFlagsProvider,
  ArenaLayerBuilder,
  AvatarLayerBuilder,
  ArenaStateController,
  PriorityQueue,
  AnimationPool,
  StreamLayerBuilder,
} from '@noice-com/web-renderer';
import { ArenaState } from '@noice-com/web-renderer/src/api/types';
import { ClearFlags, SceneStats } from '@noice-com/web-renderer/src/renderer/stats/types';

import { ControlQueue } from './ControlQueue';
import { VideoTrackStreamController } from './VideoTrackStreamController';

const { logError } = makeLoggers('Arena');

const { log: logTemp } = makeLoggers('TempAvatars');

const DEFAULT_ARENA_ID = 'Warehouse';

export interface PlayerAnimationProps {
  playerId: string;
  facingUserId?: string;
  animationCategory?: AnimationCategory;
  animationId?: string;
}

export interface BoosterProps {
  playerId: string;
  boosterId: number;
  targetPlayerId: string;
}

export interface PlayerEmojiProps {
  playerId: string;
  facingUserId?: string;
  url: string;
  name: string;
}

export interface PlayerProps {
  playerId: string;
  avatarConfig: AvatarConfigsAvatar;
  temporaryFlag?: string;
}

export interface TriggerCardSelectProps {
  playerId: string;
  cardRarity?: Rarity;
}

export interface TriggerRequestBoosterProps {
  targetPlayerId: string;
  boosterId: number;
}

export interface UpdatePlayerProps extends Partial<Omit<PlayerProps, 'playerId'>> {
  playerId: string;
}

export class ArenaControllerWebGL extends GraphicsController {
  private _controlQueue: ControlQueue = new ControlQueue();
  private _videoTrackStreamController: VideoTrackStreamController;
  private _modelLoadQueue: PriorityQueue;
  private _loadedArenaIdentifier: string;
  private _animationPool: AnimationPool;
  private _getAvatarsFunc: Nullable<(userIds: string[]) => Promise<Avatar[]>> = null;
  private _getAvatarProfile: Nullable<(userId: string) => Promise<Profile>> = null;
  private _getArenaFunc: Nullable<(id: string) => Promise<ClientSideArena>> = null;
  private _firstVideoFrameRenderedFunc: Nullable<() => void> = null;
  private _firstArenaLoadedFunc: Nullable<() => void> = null;

  /* Temporary while we are still matching CSR arenas to CR
  We cant use their disabled flag to define visibility in Studio
  As this is handled by the server-side flag. And we cant just enable
  CSR disabled arenas for admins as it interupts regular testing too much.
  For now put it on its own flag so the arena artists can work. */
  private _useDisabledArenas: boolean;

  private _arenaStateController: ArenaStateController;
  public get arenaStateController() {
    return this._arenaStateController;
  }

  constructor(
    canvas: OffscreenCanvas | HTMLCanvasElement,
    featureFlags: { [featureName: string]: string },
    playerId: string,
    avatarAnimations: Animation[],
  ) {
    super({
      rendererProps: { canvas, isPhotoMode: false },
      rendererFlags: RendererFlagsProvider.BuildRendererFlags(featureFlags),
    });

    const useNewLodFormat = featureFlags['avatars_useNewLodFormat'] === 'true' || false;
    this._useDisabledArenas =
      featureFlags['rendering_useDisabledArenas'] === 'true' || false;

    this._videoTrackStreamController = new VideoTrackStreamController(this.renderer);
    this._arenaStateController = new ArenaStateController({
      renderer: this.renderer,
      rendererSettingsHandler: this.rendererSettingsHandler,
      playerId: playerId,
      useNewLodFormat: useNewLodFormat,
    });
    this._modelLoadQueue = new PriorityQueue(2);
    this._loadedArenaIdentifier = '';
    this._animationPool = new AnimationPool(avatarAnimations, useNewLodFormat);

    this.scene.setStateController(this._arenaStateController);

    this._initStreamLayer();
  }

  private async _initStreamLayer() {
    const streamBuilder = new StreamLayerBuilder();
    const streamLayer = await streamBuilder.getLayer(this.scene);
    streamLayer.sortingOrder = 3;
    streamLayer.clearFlags = ClearFlags.Depth;
    this.scene.addLayer(streamLayer);
    this._arenaStateController.init(streamLayer, this.scene);
  }

  private async _addTemporaryAvatarsIfNeeded(userIds: string[], temporaryFlag: string) {
    if (!this._getAvatarsFunc) {
      logError(`_getAvatarsFunc is null`);
      return;
    }

    // Filter required temporary avatars
    const requireAvatars = [];
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!this._arenaStateController.avatarMap.get(userId)) {
        requireAvatars.push(userId);
      }
    }

    if (requireAvatars.length === 0) {
      return;
    }

    logTemp(`Temporary Avatars Requested (${requireAvatars.length})`);
    const avatars = await this._getAvatarsFunc(requireAvatars);
    for (let i = 0; i < avatars.length; i++) {
      const userId = requireAvatars[i];
      this.addPlayer({
        playerId: userId,
        avatarConfig: {
          userId,
          groupId: 'Temporary',
          url: avatars[i].avatar3D,
          slotIndex: i, // This assumes we never have partial groups loaded
          lodUrls: avatars[i].avatarLods,
          lods: avatars[i]?.assets?.lods,
          generatorVersion: avatars[i]?.avatarComposition?.generatorVersion,
        },
        temporaryFlag,
      });
    }
  }

  private async _tryGetArena(name: string) {
    if (!this._getArenaFunc) {
      return;
    }

    try {
      let arena = await this._getArenaFunc(name);
      if (!arena.enabled && !this._useDisabledArenas) {
        arena = await this._getArenaFunc(DEFAULT_ARENA_ID);
      }

      return arena;
    } catch (e) {
      return await this._getArenaFunc(DEFAULT_ARENA_ID);
    }
  }

  public loadArena(config: ArenaConfig): void {
    this._controlQueue.queue(async () => {
      const { name } = config;

      if (!name || name === this._loadedArenaIdentifier) {
        return;
      }

      // TODO: Unload current arena

      this._loadedArenaIdentifier = name;
      const renderer = this.renderer;
      const rendererSettingsHandler = this.rendererSettingsHandler;
      const arenaStateController = this._arenaStateController;

      const arena = await this._tryGetArena(name);
      if (
        !arena ||
        !arena.id ||
        !arena.version ||
        !arena.glbUrl ||
        !arena.lightmapUrl ||
        !arena.environmentUrl
      ) {
        logError('Invalid Arena returned!');
        return;
      }

      const descriptor = {
        name: name,
        version: arena.version,
        sceneUrl: arena.glbUrl,
        lightmapUrl: arena.lightmapUrl,
        environmentMapUrl: arena.environmentUrl,
      };

      const arenaBuilder = new ArenaLayerBuilder({
        descriptor,
        renderer,
        rendererSettingsHandler,
        arenaStateController,
      });

      const arenaLayer = await arenaBuilder.getLayer();
      arenaLayer.sortingOrder = 1;
      arenaLayer.clearFlags = ClearFlags.DontClear;
      this.scene.addLayer(arenaLayer);

      const avatarBuilder = new AvatarLayerBuilder();
      const avatarLayer = await avatarBuilder.getLayer(arenaLayer.environment);
      avatarLayer.sortingOrder = 2;
      avatarLayer.clearFlags = ClearFlags.DontClear;
      this.scene.addLayer(avatarLayer);

      this._arenaStateController.initArena(arenaLayer, avatarLayer);

      // TODO: We need to not do this here
      // We need to do the actual ContentMode event
      // But we need to process it AFTER the load arena event...
      await this._arenaStateController.setArenaState(ArenaState.Game);

      if (this._firstArenaLoadedFunc) {
        this._firstArenaLoadedFunc();
        this._firstArenaLoadedFunc = null;
      }
    });
  }

  public addPlayer({
    playerId: _playerId,
    avatarConfig,
    temporaryFlag,
  }: PlayerProps): void {
    if (
      !avatarConfig.userId ||
      !avatarConfig.groupId ||
      !avatarConfig.url ||
      !avatarConfig.lodUrls
    ) {
      return;
    }

    const avatarData = {
      userId: avatarConfig.userId,
      groupId: avatarConfig.groupId,
      slotIndex: avatarConfig.slotIndex ?? 0,
      url: avatarConfig.url,
      lodUrls: avatarConfig.lodUrls,
      lods: avatarConfig.lods,
      generatorVersion: avatarConfig.generatorVersion,
      temporaryFlag,
    };

    this._controlQueue.queue(async () => {
      const profile = await this._getAvatarProfile?.(avatarData.userId);
      this._arenaStateController.addAvatar(
        avatarData,
        this._modelLoadQueue,
        this._animationPool,
        this.rendererSettingsHandler,
        profile,
      );
    });
  }

  public removePlayer(playerId: string): void {
    this._controlQueue.queue(() => {
      this._arenaStateController.removeAvatar(playerId);
    });
  }

  public updatePlayer({ playerId, avatarConfig }: UpdatePlayerProps): void {
    if (avatarConfig) {
      this._controlQueue.queue(() => {
        const id = avatarConfig.userId;
        if (!id) {
          return;
        }

        const avatar = this._arenaStateController.avatarMap.get(id);
        if (!avatar) {
          return;
        }

        const avatarData = avatar.avatarData;

        avatarData.url = avatarConfig.url || avatarData.url;
        avatarData.lodUrls = avatarConfig.lodUrls || avatarData.lodUrls;
        avatarData.lods = avatarConfig.lods;
        avatarData.generatorVersion = avatarConfig.generatorVersion;

        this._arenaStateController.removeAvatar(playerId);
        this._arenaStateController.addAvatar(
          avatarData,
          this._modelLoadQueue,
          this._animationPool,
          this.rendererSettingsHandler,
        );

        // Handle team changes for local player
        if (avatarData.userId === this._arenaStateController.playerId) {
          this._arenaStateController.setLocalTeamId(avatarData.groupId);
        }
      });
    }
  }

  public triggerPlayerAnimation({
    playerId,
    animationCategory,
    animationId,
  }: PlayerAnimationProps): void {
    this._controlQueue.queue(() => {
      const avatar = this._arenaStateController.avatarMap.get(playerId);

      if (!avatar) {
        return;
      }

      if (animationCategory) {
        avatar.triggerAnimationByCategory(animationCategory);
        return;
      }

      if (animationId) {
        avatar.triggerAnimationById(animationId);
      }
    });
  }

  public triggerCrowdAnimationByCategory(category: AnimationCategory): void {
    this._controlQueue.queue(() => {
      this._arenaStateController.avatars.forEach((avatar) => {
        avatar.triggerAnimationByCategory(category);
      });
    });
  }

  public triggerPlayerEmoji({ playerId, url, name }: PlayerEmojiProps): void {
    this._controlQueue.queue(() => {
      const avatar = this._arenaStateController.avatarMap.get(playerId);
      avatar?.triggerEmoji(name, url, 1);
    });
  }

  public triggerBooster({ boosterId, playerId, targetPlayerId }: BoosterProps): void {
    this._controlQueue.queue(() => {
      const avatar = this._arenaStateController.avatarMap.get(playerId);
      const targetAvatar = this._arenaStateController.avatarMap.get(targetPlayerId);

      if (!avatar || !targetAvatar) {
        return;
      }

      if (avatar) {
        avatar.useBooster(targetAvatar, boosterId);
        targetAvatar.receiveBooster(avatar, boosterId);
      }
    });
  }

  public triggerSelectCard({ playerId, cardRarity }: TriggerCardSelectProps): void {
    this._controlQueue.queue(() => {
      const avatar = this._arenaStateController.avatarMap.get(playerId);

      if (!cardRarity) {
        return;
      }

      avatar?.selectCard(cardRarity);
    });
  }

  public triggerRequestBooster({
    targetPlayerId,
    boosterId,
  }: TriggerRequestBoosterProps): void {
    this._controlQueue.queue(() => {
      const playerId = this._arenaStateController.playerId;
      const avatar = this._arenaStateController.avatarMap.get(playerId);
      const targetAvatar = this._arenaStateController.avatarMap.get(targetPlayerId);

      if (!avatar || !targetAvatar) {
        return;
      }

      avatar.requestBooster(targetAvatar, boosterId);
    });
  }

  public setContentMode(contentMode: ContentMode): void {
    this._controlQueue.queue(async () => {
      // Game
      if (contentMode.game) {
        // TODO: Move this to the end of the Spotlight sequence
        this._arenaStateController.removeTemporaryAvatars(`Spotlight`);

        this._arenaStateController.avatarAllocationOverrides.clear();
        await this._arenaStateController.setArenaState(ArenaState.Game);

        // Intermission
      } else if (contentMode.cameraDrive) {
        if (this.arenaStateController.supportedStates.includes(ArenaState.Intermission)) {
          this._arenaStateController.removeTemporaryAvatars(`Spotlight`);
          this._arenaStateController.avatarAllocationOverrides.clear();
          await this._arenaStateController.setArenaState(ArenaState.Intermission);
        }

        // Match End
      } else if (contentMode.matchEnd) {
        this._arenaStateController.avatarAllocationOverrides.clear();
        await this._arenaStateController.setArenaState(ArenaState.Game);

        // Group Spotlight
      } else if (contentMode.groupSpotlight) {
        if (this.arenaStateController.supportedStates.includes(ArenaState.Spotlight)) {
          const userIds: string[] = [];
          const players = contentMode.groupSpotlight.players;
          players?.forEach((s) => {
            if (s.userId) {
              userIds.push(s.userId);
            }
          });

          if (userIds.length > 0) {
            await this._addTemporaryAvatarsIfNeeded(userIds, `Spotlight`);
          }

          this._arenaStateController.setSpotlightUsers(userIds);
          await this._arenaStateController.setArenaState(ArenaState.Spotlight);
        }

        // User Spotlight
      } else if (contentMode.userSpotlight) {
        if (this.arenaStateController.supportedStates.includes(ArenaState.Spotlight)) {
          const userIds: string[] = [];
          if (contentMode.userSpotlight.userId) {
            userIds.push(contentMode.userSpotlight.userId);
          }

          if (userIds.length > 0) {
            await this._addTemporaryAvatarsIfNeeded(userIds, `Spotlight`);
          }

          this._arenaStateController.setSpotlightUsers(userIds);
          await await this._arenaStateController.setArenaState(ArenaState.Spotlight);
        }

        // Intermission
      } else {
        logError('Unknown ContentMode');
      }
    });
  }

  public setVideoTrackStream(readableStream: ReadableStream<VideoFrame>): void {
    this._videoTrackStreamController.setVideoTrackStream(readableStream, () => {
      if (this._firstVideoFrameRenderedFunc) {
        this._firstVideoFrameRenderedFunc();
        this._firstVideoFrameRenderedFunc = null;
      }
    });
  }

  public setLocalGroupId(groupId: Nullable<string>): void {
    this._arenaStateController.setLocalTeamId(groupId);
  }

  public setGetAvatarsFunc(func: (userIds: string[]) => Promise<Avatar[]>): void {
    this._getAvatarsFunc = func;
  }

  public setGetProfileFunc(func: (userId: string) => Promise<Profile>): void {
    this._getAvatarProfile = func;
  }

  public setGetArenaFunc(func: (id: string) => Promise<ClientSideArena>): void {
    this._getArenaFunc = func;
  }

  public setFirstVideoFrameRenderedFunc(func: () => void): void {
    this._firstVideoFrameRenderedFunc = func;
  }

  public setFirstArenaLoadedFunc(func: () => void): void {
    this._firstArenaLoadedFunc = func;
  }

  public getSceneStats(): SceneStats {
    return {
      avatarCount: this.arenaStateController.avatars.length,
    };
  }
}
