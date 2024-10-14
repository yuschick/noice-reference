import {
  AnimationCategory,
  AnimationHandedness,
} from '@noice-com/schemas/avatar/animation.pb';
import {
  AvatarAssetsLod,
  AvatarAssetsLodSkeletonType,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Color } from '@noice-com/schemas/profile/profile.pb';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import {
  ArrayUtils,
  makeLoggers,
  Nullable,
  Observable,
  Optional,
} from '@noice-com/utils';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { PriorityQueue } from '../utilities/priorityqueue';

import { AnimationController } from './animationcontroller';
import { AnimationPool } from './animationpool';

import * as API from '@legacy/api';
import { Booster } from '@legacy/entities/booster';
import { EmojiController, GameCardController } from '@legacy/entities/controllers';
import { disposeSkinnedMesh } from '@legacy/helpers/mesh';
import { CrowdMode } from 'api';
import { AvatarData, TransformData } from 'api/types';

const loader = new GLTFLoader();
const { logError, logInfo, logInfoVerbose, logWarn } = makeLoggers('PlayerV3');

interface LOD {
  level: number;

  promise?: Promise<void>;
  skinnedMesh?: THREE.SkinnedMesh;
  skeletonType?: AvatarAssetsLodSkeletonType;
  group?: THREE.Group;
  url: string;
}

export class Avatar extends THREE.Object3D {
  public allowAnimations: boolean;

  private _avatarData: AvatarData;
  private _isMemberOfLocalGroup: boolean;

  private _animationObjectGroup: THREE.AnimationObjectGroup;
  private _animationMixer: THREE.AnimationMixer;

  private _animationController: Nullable<AnimationController> = null;
  private _animationPool: Nullable<AnimationPool> = null;

  private _lods: Map<number, LOD> = new Map();
  private _currentLOD: Nullable<LOD> = null;
  private _crowdDetail = API.CrowdDetail.Highest;
  private _crowdMode = CrowdMode.All;

  // private _slot?: API.Slot;

  private _emojiSystem: EmojiController;
  private _cardSystem: GameCardController;

  private _initialAnimationHandler: Nullable<() => void> = null;
  private _booster: Booster;

  private _modelLoadQueue: Nullable<PriorityQueue> = null;
  private _destructionCallbacks: VoidFunction[] = [];

  private _useNewLodFormat = false;

  private _headTarget?: Nullable<THREE.Object3D> = null;
  private _userName: string | undefined;
  private _preferredColor: Color | undefined;

  constructor(
    avatarData: AvatarData,
    userName: string | undefined,
    preferredColor: Color | undefined,
    isMemberOfLocalGroup: boolean,
    crowdDetail: Observable<API.CrowdDetail>,
    crowdMode: Observable<CrowdMode>,
    useNewLodFormat = false,
  ) {
    super();

    this.userData.type = 'Player';
    this.name = avatarData.userId;
    this._userName = userName;
    this._preferredColor = preferredColor;

    this.allowAnimations = true;

    this._avatarData = avatarData;
    this._useNewLodFormat = useNewLodFormat;
    this._isMemberOfLocalGroup = isMemberOfLocalGroup;

    this.matrixAutoUpdate = false;

    this._animationObjectGroup = new THREE.AnimationObjectGroup();
    this._animationMixer = new THREE.AnimationMixer(this._animationObjectGroup);

    this._emojiSystem = new EmojiController(this);
    this._cardSystem = new GameCardController();

    this._booster = new Booster(1.0);
    this.add(this._booster);

    this._destructionCallbacks.push(
      crowdDetail.onValue((value) => this._setCrowdDetail(value)),
      crowdMode.onValue((value) => this._setCrowdMode(value)),
    );

    this._setCrowdDetail(crowdDetail.value);
    this._setCrowdMode(crowdMode.value);
  }

  public get avatarData(): AvatarData {
    return this._avatarData;
  }

  public get headTarget(): Nullable<THREE.Object3D | undefined> {
    return this._headTarget;
  }

  public get isMemberOfLocalGroup(): boolean {
    return this._isMemberOfLocalGroup;
  }

  public get userName(): string | undefined {
    return this._userName;
  }

  public get preferredColor(): Color | undefined {
    return this._preferredColor;
  }

  public get minimumLODLevel(): number {
    return Math.min(...this._lods.keys());
  }

  public get maximumLODLevel(): number {
    return Math.max(...this._lods.keys());
  }

  public get mediumLODLevel(): number {
    const keys = [...this._lods.keys()].sort((a, b) => a - b);

    return keys[Math.floor(keys.length / 2)];
  }

  public get lodLevel(): number {
    return this._currentLOD?.level ?? -1;
  }

  public set lodLevel(level: Optional<number>) {
    const current = this._currentLOD;

    if (current?.level === level) {
      return;
    }

    if (level === undefined) {
      return;
    }

    level = THREE.MathUtils.clamp(level, this.minimumLODLevel, this.maximumLODLevel);

    const targetLod = this._lods.get(level);
    if (targetLod && targetLod.group === undefined) {
      this._loadLod(targetLod)
        .then(() => {
          this.lodLevel = targetLod.level;
          return;
        })
        .catch((error) => logError(`Error loading target lod: ${error}`));
      return;
    }

    if (
      targetLod !== undefined &&
      targetLod.group !== undefined &&
      targetLod.skinnedMesh !== undefined
    ) {
      if (this._animationController) {
        const requiredSkeletonType =
          targetLod.skeletonType || AvatarAssetsLodSkeletonType.SKELETON_TYPE_COMPLEX;

        if (requiredSkeletonType !== this._animationController.skeletonType) {
          logInfoVerbose(
            `Avatar ${this.name} skeleton mode changed: ${requiredSkeletonType}, lod level: ${targetLod.level}`,
          );
          this._animationController.skeletonType = requiredSkeletonType;
          this._animationController.stopAnimation();
        }
      }

      if (current && current.group) {
        current.group.visible = false;
        this._animationObjectGroup.remove(current.group);
      }

      this._currentLOD = targetLod;
      this._animationObjectGroup.add(targetLod.group);
      targetLod.group.visible = true;
      this._cardSystem.skeleton = targetLod.skinnedMesh.skeleton;
    }
  }

  private _setCrowdDetail(crowdDetail: API.CrowdDetail) {
    this._crowdDetail = crowdDetail;
    this.lodLevel = this.getLodLevelBasedOnCrowdDetail();
  }

  private _setCrowdMode(crowdMode: CrowdMode) {
    this._crowdMode = crowdMode;

    switch (this._crowdMode) {
      case CrowdMode.Disabled:
        this.visible = false;
        break;
      case CrowdMode.LocalGroupOnly:
        this.visible = this.isMemberOfLocalGroup;
        break;
      default:
        this.visible = true;
        break;
    }
  }

  public set modelLoadQueue(queue: Nullable<PriorityQueue>) {
    this._modelLoadQueue = queue;
  }

  public get modelLoadQueue(): Nullable<PriorityQueue> {
    return this._modelLoadQueue;
  }

  private _shouldMirror(targetPlayer: Avatar): boolean {
    const targetModelRoot = targetPlayer;

    const a = this.getWorldPosition(new THREE.Vector3());
    const b = targetModelRoot.getWorldPosition(new THREE.Vector3());

    const target = targetModelRoot.position.clone().add(Booster.OFFSET);
    targetModelRoot.localToWorld(target);

    return a.x > b.x;
  }

  private _attemptPlayingInitialAnimation(): void {
    if (
      this._currentLOD ||
      this._animationController === null ||
      this._animationPool === null
    ) {
      return;
    }

    this._initialAnimationHandler?.();
    this._initialAnimationHandler = null;
  }

  private _loadLod(
    lod: LOD,
    progressHandler?: (event: ProgressEvent<EventTarget>) => void,
  ): Promise<void> {
    const { url, promise: previousLoad } = lod;
    if (previousLoad !== undefined) {
      return previousLoad;
    }

    const promise = this._enqueueModelLoad(
      lod.level + (this.isMemberOfLocalGroup ? 4 : 0),
      lod.url,
      progressHandler,
    )
      .then((gltf) => {
        const group = gltf.scene;
        group.name = url;

        let skinnedMesh: Optional<THREE.SkinnedMesh>;

        this._headTarget = group.getObjectByName('Head02');

        group.traverse((object3D) => {
          if (
            object3D.type !== 'SkinnedMesh' ||
            object3D.name.startsWith('SkinnedMesh') === false
          ) {
            return;
          }

          skinnedMesh = object3D as THREE.SkinnedMesh;
          skinnedMesh.castShadow = true;
          skinnedMesh.receiveShadow = true;

          skinnedMesh.matrixAutoUpdate = false;

          skinnedMesh.updateMatrix();

          const geometry = skinnedMesh.geometry;
          geometry.setAttribute('uv1', geometry.attributes.uv);

          const material = skinnedMesh.material as THREE.MeshPhysicalMaterial;

          for (const [key, value] of Object.entries(material)) {
            if (key.slice(-3).toLowerCase() === 'map' && value !== null) {
              const texture = value as THREE.Texture;

              texture.generateMipmaps = false;
              texture.anisotropy = 4;
            }
          }

          material.side = THREE.FrontSide;
        });

        if (skinnedMesh === undefined) {
          logError(`Invalid LOD data: ${url}`);

          return;
        } else if (lod.skinnedMesh !== undefined || lod.group !== undefined) {
          logWarn(`Overwriting LOD ${lod.level}`);
        }

        lod.skinnedMesh = skinnedMesh;
        lod.group = group;

        group.visible = false;
        this.add(group);

        const root = group.children.find((child) => child.type === 'Bone');

        if (root === undefined) {
          throw new Error('root === undefined');
        }

        root.traverse((entity) => {
          if (entity.type !== 'Bone') {
            return;
          }

          const bone = entity as THREE.Bone;

          bone.matrixAutoUpdate = false;
        });

        this._applyShoeOffset(group);

        return;
      })
      .catch((error) => {
        logError(`Error loading mesh: ${error}`);
        lod.promise = undefined;
      });

    lod.promise = promise;

    return promise;
  }

  private _enqueueModelLoad(
    priority: number,
    url: string,
    progressionHandler?: (event: ProgressEvent<EventTarget>) => void,
  ) {
    if (this._modelLoadQueue) {
      logInfoVerbose(`Queueing avatar model load from ${url} with priority ${priority}`);
      return this._modelLoadQueue.enqueue(priority, async () => {
        logInfoVerbose(`Loading avatar model from ${url} with priority ${priority}`);
        return loader.loadAsync(url, progressionHandler).then((gltf) => {
          logInfoVerbose(
            `Done loading avatar model from ${url} with priority ${priority}`,
          );
          return gltf;
        });
      });
    }

    logInfoVerbose(`Loading avatar model from ${url}`);
    return loader.loadAsync(url, progressionHandler).then((gltf) => {
      logInfoVerbose(`Done loading avatar model from ${url}`);
      return gltf;
    });
  }

  private _applyShoeOffset(avatar: THREE.Object3D): void {
    const skeletonRoot = avatar?.getObjectByName('Root');

    if (!skeletonRoot || !skeletonRoot.userData || !skeletonRoot.userData['shoeOffset']) {
      return;
    }

    const shoeOffset = skeletonRoot.userData['shoeOffset'];

    logInfoVerbose(`Apply shoe offset ${shoeOffset}`);

    skeletonRoot.position.set(
      skeletonRoot.position.x,
      shoeOffset,
      skeletonRoot.position.z,
    );

    skeletonRoot.updateMatrix();
  }

  public async loadAndSetLod(lodLevel: number) {
    const targetLod = this._lods.get(lodLevel);

    if (!targetLod) {
      throw new Error(`No lod for level ${lodLevel} defined!`);
    }

    if (targetLod.group === undefined) {
      await this._loadLod(targetLod);
    }

    this.lodLevel = lodLevel;
  }

  public getLodLevelBasedOnCrowdDetail(): number {
    if (this._lods.size === 0) {
      return -1;
    }

    switch (this._crowdDetail) {
      case API.CrowdDetail.Highest:
        if (this.isMemberOfLocalGroup === true) {
          return this.minimumLODLevel;
        }
        return this.maximumLODLevel;

      case API.CrowdDetail.High:
      case API.CrowdDetail.HighOwnGroup:
        if (this.isMemberOfLocalGroup === true) {
          return Math.min(this.minimumLODLevel + 1, this.maximumLODLevel);
        }
        return this.maximumLODLevel;

      case API.CrowdDetail.Medium:
        if (this.isMemberOfLocalGroup === true) {
          return this.mediumLODLevel;
        }
        return this.maximumLODLevel;

      case API.CrowdDetail.Low:
        return this.maximumLODLevel;
    }
  }

  public setTransform(transformData: TransformData | undefined) {
    if (transformData === undefined) {
      return;
    }

    const position = transformData.position;
    const rotation = transformData.rotation;

    this.position.set(position.x, position.y, position.z);
    this.rotation.set(rotation.x, rotation.y, rotation.z);

    this.updateMatrix();
  }

  public setVisible(value: boolean) {
    if (!this._currentLOD || !this._currentLOD.group) {
      return;
    }

    this._currentLOD.group.visible = value;
  }

  public async load(
    progressHandler?: (event: ProgressEvent<EventTarget>) => void,
    completionHandler?: (player: Avatar) => void,
  ): Promise<Avatar> {
    let srcLods: string[] | AvatarAssetsLod[];

    if (this._useNewLodFormat && this._avatarData.lods?.length) {
      // Use new lod format if set (last lod has simplified skeleton)
      srcLods = this._avatarData.lods;
    } else {
      // Use old lod format (no simplifid skeleton lods)
      srcLods = this._avatarData.lodUrls ?? [this._avatarData.url];
    }

    srcLods.reduce((lods, srcLod, index) => {
      const isLegacyLod = typeof srcLod === 'string';

      lods.set(index, {
        level: index,
        url: isLegacyLod ? srcLod : srcLod.glbUrl || this._avatarData.url,
        skeletonType: isLegacyLod
          ? AvatarAssetsLodSkeletonType.SKELETON_TYPE_COMPLEX
          : srcLod.skeletonType,
      });

      return lods;
    }, this._lods);

    const targetLodLevel = this.getLodLevelBasedOnCrowdDetail();

    for (const lod of this._lods.values()) {
      if (lod.level === targetLodLevel) {
        this._loadLod(lod, progressHandler)
          .then(() => {
            completionHandler?.(this);

            this.lodLevel = lod.level;
            this._attemptPlayingInitialAnimation();

            return;
          })
          .catch((error) => logError(`Error loading lod: ${error}`));
        break;
      }
    }

    return this;
  }

  public destruct(): void {
    for (const callback of this._destructionCallbacks) {
      callback();
    }

    this._destructionCallbacks = [];

    this._emojiSystem.destruct();
    this._cardSystem.destruct();

    this._booster.destruct();

    logInfo(`Destructing Player ${this.name}.`);

    for (const lod of this._lods.values()) {
      if (lod.skinnedMesh) {
        disposeSkinnedMesh(lod.skinnedMesh);
      }
    }
  }

  public async useAnimations(pool: AnimationPool): Promise<void> {
    if (this.allowAnimations === false) {
      return;
    }

    this._animationPool = pool;
    this._animationController = new AnimationController(pool, this._animationMixer);
  }

  public async triggerAnimationById(
    animationID: string,
    mirrored = false,
  ): Promise<void> {
    if (!this._animationController) {
      this._initialAnimationHandler = () => {
        this.triggerAnimationById(animationID, mirrored);
      };

      return;
    }

    this._cardSystem.removeCards();
    await this._animationController?.executeAnimationById(animationID, mirrored);
  }

  public triggerAnimationByCategory(category: AnimationCategory, mirrored = false): void {
    if (!this._animationController) {
      this._initialAnimationHandler = () => {
        this.triggerAnimationByCategory(category, mirrored);
      };

      return;
    }

    this._cardSystem.removeCards();
    this._animationController?.executeAnimationByCategory(category, mirrored);
  }

  public async triggerEmoji(name: string, url: string, version: number): Promise<void> {
    this._cardSystem.removeCards();
    this._emojiSystem.emitEmoji(name, url, version);

    this._animationController?.executeAnimationByCategory(
      AnimationCategory.CATEGORY_EMOJI,
    );
  }

  public selectCard(rarity: Rarity): void {
    const operation = this._animationController?.executeAnimationByCategory(
      AnimationCategory.CATEGORY_PLAYER_PICK_CARD,
      false,
      () => {
        this._cardSystem.removeCards();
      },
    );

    operation?.then((animation) => {
      let handedness = animation?.animation.config?.handedness;

      if (handedness === undefined) {
        handedness = ArrayUtils.randomFromArray([
          AnimationHandedness.HANDEDNESS_LEFT,
          AnimationHandedness.HANDEDNESS_RIGHT,
        ]);
      }

      this._cardSystem.showCards(rarity, handedness);

      return;
    });
  }

  public requestBooster(targetPlayer: Avatar, _boosterId: number): void {
    if (targetPlayer.name === this.name) {
      return;
    }

    const mirrored = this._shouldMirror(targetPlayer);

    this._cardSystem.removeCards();

    this._animationController?.executeAnimationByCategory(
      AnimationCategory.CATEGORY_BOOSTER_REQUESTED,
      mirrored,
    );
  }

  public receiveBooster(sourcePlayer: Avatar, _boosterId: number): void {
    if (sourcePlayer.name === this.name) {
      return;
    }

    const isMirrored = this._shouldMirror(sourcePlayer);

    this._cardSystem.removeCards();

    this._animationController?.executeAnimationByCategory(
      AnimationCategory.CATEGORY_BOOSTER_RECEIVED,
      isMirrored,
    );
  }

  public useBooster(targetPlayer: Avatar, boosterId: number): void {
    this._booster.emit(boosterId);

    if (targetPlayer.name === this.name) {
      return;
    }

    this._booster.setTarget(targetPlayer.position.clone().add(Booster.OFFSET));

    const isMirrored = this._shouldMirror(targetPlayer);

    this._cardSystem.removeCards();

    this._animationController?.executeAnimationByCategory(
      AnimationCategory.CATEGORY_BOOSTER_SENT,
      isMirrored,
    );
  }

  public update(deltaTime: number) {
    this._emojiSystem.update();
    this._booster.update(deltaTime);
  }

  public animate(deltaTime: number): void {
    this._animationController?.update(deltaTime);

    this._currentLOD?.skinnedMesh?.skeleton.bones.forEach((bone) => {
      if (bone.matrixWorldNeedsUpdate === true) {
        bone.updateMatrix();
      }
    });
  }
}
