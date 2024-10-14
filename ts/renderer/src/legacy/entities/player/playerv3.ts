import {
  AnimationCategory,
  AnimationHandedness,
} from '@noice-com/schemas/avatar/animation.pb';
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

import { Avatar } from './avatar';

import * as API from '@legacy/api';
import { Booster } from '@legacy/entities/booster';
import { EmojiController, GameCardController } from '@legacy/entities/controllers';
import {
  AnimationController,
  AnimationPool,
} from '@legacy/entities/controllers/animationsv2';
import { convertUnityPositionVectorToTHREE } from '@legacy/helpers/conversions';
import { disposeSkinnedMesh } from '@legacy/helpers/mesh';
import { PriorityQueue } from '@legacy/utilities';

const loader = new GLTFLoader();
const { logError, logInfo, logInfoVerbose, logWarn } = makeLoggers('PlayerV3');

interface LOD {
  level: number;

  promise?: Promise<void>;
  skinnedMesh?: THREE.SkinnedMesh;
  group?: THREE.Group;
  url: string;
}

export class Player extends THREE.Object3D implements Avatar {
  public allowAnimations: boolean;

  private _descriptor: API.Avatar;

  private _animationObjectGroup: THREE.AnimationObjectGroup;
  private _animationMixer: THREE.AnimationMixer;

  private _animationController: Nullable<AnimationController> = null;
  private _animationPool: Nullable<AnimationPool> = null;

  private _lods: Map<number, LOD> = new Map();
  private _currentLOD: Nullable<LOD> = null;
  private _crowdDetail = API.CrowdDetail.Highest;

  private _slot?: API.Slot;

  private _emojiSystem: EmojiController;
  private _cardSystem: GameCardController;

  private _initialAnimationHandler: Nullable<() => void> = null;
  private _booster: Booster;

  private _modelLoadQueue: Nullable<PriorityQueue> = null;
  private _destructionCallbacks: VoidFunction[] = [];

  private _targetLOD = 0;

  constructor(descriptor: API.Avatar, crowdDetail: Observable<API.CrowdDetail>) {
    super();

    this.userData.type = 'Player';
    this.name = descriptor.id;

    this.allowAnimations = true;

    this._descriptor = descriptor;

    this.matrixAutoUpdate = false;

    this._animationObjectGroup = new THREE.AnimationObjectGroup();
    this._animationMixer = new THREE.AnimationMixer(this._animationObjectGroup);

    this._emojiSystem = new EmojiController(this);
    this._cardSystem = new GameCardController();

    this._booster = new Booster(1.0);
    this.add(this._booster);

    this._destructionCallbacks.push(
      crowdDetail.onValue((value) => this._setCrowdDetail(value)),
    );

    this._setCrowdDetail(crowdDetail.value);
  }

  public get isMemberOfLocalGroup(): boolean {
    return this._descriptor.isMemberOfLocalGroup;
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

  public get lod(): number {
    return this._currentLOD?.level ?? -1;
  }

  public set lod(lod: Optional<number>) {
    this._targetLOD = lod ?? -1;

    const current = this._currentLOD;

    if (current?.level === lod) {
      return;
    }

    if (lod === undefined) {
      return;
    }

    lod = THREE.MathUtils.clamp(lod, this.minimumLODLevel, this.maximumLODLevel);

    const lodObject = this._lods.get(lod);
    if (lodObject && lodObject.group === undefined) {
      // start preloading the wanted LOD
      this._loadLod(lodObject);
    }

    // find the closest LOD that is aready loaded
    const closestLod = this._findClosestLOD(lod);
    if (!closestLod) {
      return;
    }

    if (current?.level === closestLod.level) {
      return;
    }

    if (
      closestLod !== undefined &&
      closestLod.group !== undefined &&
      closestLod.skinnedMesh !== undefined
    ) {
      closestLod.group.visible = true;
      this._currentLOD = closestLod;
      this._animationObjectGroup.add(closestLod.group);
      this._cardSystem.skeleton = closestLod.skinnedMesh.skeleton;

      if (current && current.group) {
        current.group.visible = false;
        this._animationObjectGroup.remove(current.group);
      }
    }
  }

  private _setCrowdDetail(crowdDetail: API.CrowdDetail) {
    this._crowdDetail = crowdDetail;
    this._pickLODBasedOnCrowdDetail();
  }

  public get slot(): Optional<API.Slot> {
    return this._slot;
  }

  public set slot(slot: Optional<API.Slot>) {
    if (slot === undefined || this._slot === slot) {
      return;
    }

    const position = convertUnityPositionVectorToTHREE(slot.transform.position);
    const rotation = slot.transform.rotation;

    this.position.set(position.x, position.y, position.z);

    this.rotation.setFromQuaternion(
      new THREE.Quaternion(
        rotation?.x ?? 0.0,
        rotation?.y ?? 0.0,
        rotation?.z ?? 0.0,
        rotation?.w ?? 1.0,
      ),
    );

    this.updateMatrix();
  }

  public set modelLoadQueue(queue: Nullable<PriorityQueue>) {
    this._modelLoadQueue = queue;
  }

  public get modelLoadQueue(): Nullable<PriorityQueue> {
    return this._modelLoadQueue;
  }

  private _findClosestLOD(targetLODLevel: number): Nullable<LOD> {
    const lodArray = Array.from(this._lods.values()).sort((a, b) => {
      return b.level - a.level;
    });
    for (const lod of lodArray) {
      if (lod.group && lod.level <= targetLODLevel) {
        return lod;
      }
    }

    return lodArray.pop() || null;
  }

  private _pickLODBasedOnCrowdDetail() {
    if (this._lods.size === 0) {
      return;
    }

    switch (this._crowdDetail) {
      case API.CrowdDetail.Highest:
        this.lod = this.minimumLODLevel;
        break;

      case API.CrowdDetail.High:
        this.lod = Math.min(this.minimumLODLevel + 1, this.maximumLODLevel);
        break;

      case API.CrowdDetail.HighOwnGroup:
        if (this.isMemberOfLocalGroup === true) {
          this.lod = Math.min(this.minimumLODLevel + 1, this.maximumLODLevel);
          return;
        }

        this.lod = this.mediumLODLevel;
        break;

      case API.CrowdDetail.Medium:
        this.lod = this.mediumLODLevel;
        break;

      case API.CrowdDetail.Low:
        this.lod = this.maximumLODLevel;
        break;
    }
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

        if (this._descriptor.applyShoeOffset) {
          Avatar.ApplyShoeOffset(group);
        }

        this._pickLODBasedOnCrowdDetail();
        this._attemptPlayingInitialAnimation();

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

  public async load(
    progressHandler?: (event: ProgressEvent<EventTarget>) => void,
    completionHandler?: (player: Player) => void,
  ): Promise<Player> {
    const promises: Promise<void>[] = [];

    const urls = this._descriptor.lodURLs ?? [this._descriptor.url];

    urls.reduce((lods, url, index) => {
      lods.set(index, {
        level: index,
        url,
      });

      return lods;
    }, this._lods);

    this._pickLODBasedOnCrowdDetail();

    for (const lod of this._lods.values()) {
      if (lod.level >= this._targetLOD) {
        promises.push(this._loadLod(lod, progressHandler));
      }
    }

    Promise.all(promises)
      .then(() => {
        completionHandler?.(this);
        return;
      })
      .catch((error) => logError(`Error loading meshes: ${error}`));

    if (this._animationPool !== null) {
      this.useAnimations(this._animationPool);
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

    this._attemptPlayingInitialAnimation();
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

  public get generatorVersion(): string {
    return this._descriptor.generatorVersion || 'unknown';
  }
}
