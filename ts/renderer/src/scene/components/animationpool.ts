import { Animation, AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { SimpleAvatarBoneNames } from 'scene/animation/types';

const KeepAllTracks = ['Hips', 'LeftHandLocator', 'RightHandLocator'];

const { logError } = makeLoggers('AnimationPool');

export interface RuntimeAnimation {
  clip: THREE.AnimationClip;
  clipSimple?: THREE.AnimationClip;
  skeleton: THREE.Object3D;

  mirroredClip?: THREE.AnimationClip;
  mirroredClipSimple?: THREE.AnimationClip;
  mirroredSkeleton?: THREE.Object3D;

  animation: Animation;
}

export class AnimationPool {
  private _sources: Animation[];
  private _map: Map<string, RuntimeAnimation>;
  private _promises: Map<string, Promise<boolean>>;
  private _generateSimpleAnimation: boolean;

  public get count(): number {
    return this._sources.length;
  }

  public get loadedCount(): number {
    return this._map.size;
  }

  constructor(animations: Animation[], generateSimpleAnimation = false) {
    this._sources = animations;
    this._map = new Map();
    this._promises = new Map();
    this._generateSimpleAnimation = generateSimpleAnimation;
  }

  private async _loadGLTF(
    url: string,
    name: string,
  ): Promise<[THREE.Object3D, THREE.AnimationClip, THREE.AnimationClip | undefined]> {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);

    if (gltf.animations.length === 0) {
      throw new Error(`Animation ${name} not found!`);
    }

    const [anim] = gltf.animations;
    anim.name = name;

    const simpleSkeletonAnimationTracks: THREE.KeyframeTrack[] = [];

    // discard position and scale tracks
    for (let i = anim.tracks.length - 1; i >= 0; --i) {
      const track = anim.tracks[i];
      const trackName = track.name;
      const objName = trackName.substring(0, trackName.indexOf('.'));

      if (
        !KeepAllTracks.includes(objName) &&
        (trackName.includes('.scale') === true ||
          trackName.includes('.position') === true)
      ) {
        anim.tracks.splice(i, 1);
        continue;
      }

      if (this._generateSimpleAnimation && SimpleAvatarBoneNames.includes(objName)) {
        simpleSkeletonAnimationTracks.push(track);
      }
    }

    let animSimple: THREE.AnimationClip | undefined;

    if (this._generateSimpleAnimation) {
      animSimple = new THREE.AnimationClip(
        anim.name,
        anim.duration,
        simpleSkeletonAnimationTracks,
        anim.blendMode,
      );
    }

    return [gltf.scene, anim, animSimple];
  }

  private _loadAnimationFromConfig(config: Animation): Promise<boolean> {
    const { id, glbUrl, mirroredGlbUrl } = config;

    if (!id) {
      return Promise.resolve(false);
    }

    if (this._map.has(id)) {
      return Promise.resolve(true);
    }

    const existingLoad = this._promises.get(id);

    if (existingLoad) {
      return existingLoad;
    }

    const loads = [];

    if (glbUrl) {
      loads.push(this._loadGLTF(glbUrl, id));
    }

    if (mirroredGlbUrl) {
      loads.push(this._loadGLTF(mirroredGlbUrl, `${id}_mirrored`));
    }

    const objectsPromise = Promise.all(loads).then((objects) => {
      const [[skeleton, clip, clipSimple]] = objects;

      const runtimeAnimation: RuntimeAnimation = {
        clip,
        clipSimple: clipSimple,
        skeleton,
        animation: config,
      };

      if (objects.length === 2) {
        const [mirroredSkeleton, mirroredClip, mirroredClipSimple] = objects[1];
        runtimeAnimation.mirroredClip = mirroredClip;
        runtimeAnimation.mirroredClipSimple = mirroredClipSimple;
        runtimeAnimation.mirroredSkeleton = mirroredSkeleton;
      }

      this._map.set(id, runtimeAnimation);

      this._promises.delete(id);
      return true;
    });

    this._promises.set(id, objectsPromise);

    return objectsPromise;
  }

  private _loadAnimations(configs: Animation[]): Promise<boolean[]> {
    const promises = configs.map((config) =>
      this._loadAnimationFromConfig(config).catch((e) => {
        logError(`Failed to load animation ${config.id}`, e);
        return false;
      }),
    );

    return Promise.all(promises);
  }

  public isAnimationLoaded(animationId: string): boolean {
    return this._map.has(animationId);
  }

  public loadAnimationsById(...animIds: string[]): Promise<boolean[]> {
    let animations: Animation[] = [];

    // If no animations provided, load all (or the rest)
    if (animIds.length === 0) {
      animations = [...this._sources];
    } else {
      animIds.forEach((id) => {
        const config = this._sources.find((a) => a.id === id);

        if (config) {
          animations.push(config);
        }
      });
    }

    return this._loadAnimations(animations);
  }

  public loadAnimationsByCategory(category: AnimationCategory): Promise<boolean[]> {
    const animations = this._sources.filter((a) => a.category?.includes(category));

    return this._loadAnimations(animations);
  }

  public async getAnimationsByCategory(
    category: AnimationCategory,
  ): Promise<RuntimeAnimation[]> {
    const ready = await this.loadAnimationsByCategory(category);

    if (!ready[0]) {
      throw new Error(`No animations found in category ${category}!`);
    }

    return [...this._map.values()].filter((a) =>
      a.animation.category?.includes(category),
    );
  }

  public async getAnimationById(animationId: string): Promise<RuntimeAnimation> {
    const ready = await this.loadAnimationsById(animationId);

    if (!ready[0] || !this._map.has(animationId)) {
      throw new Error(`Animation ${animationId} not found!`);
    }

    return this._map.get(animationId) as RuntimeAnimation;
  }
}
