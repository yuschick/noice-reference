import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { AvatarAssetsLodSkeletonType } from '@noice-com/schemas/avatar/avatar.pb';
import { ArrayUtils, Nullable, Optional } from '@noice-com/utils';
import * as THREE from 'three';

import { AnimationPool, RuntimeAnimation } from './animationpool';

const DEFAULT_FADEIN_TIME = 0.2;

type AnimEventHandler = THREE.EventListener<
  THREE.AnimationMixerEventMap['finished'],
  'finished',
  THREE.AnimationMixer
>;

interface AnimationSequenceItem {
  sequenceName: string;
  animation: RuntimeAnimation;
  action: THREE.AnimationAction;
  sequenceDuration: number;
  nextSequenceStart: number;
}

export class AnimationController {
  private _animationPool: AnimationPool;

  private _playNextSequencePromise: Nullable<Promise<void>> = null;

  private _mixer: THREE.AnimationMixer;
  private _activeSequence?: AnimationSequenceItem;

  private _idleCategory: AnimationCategory;
  private _skeletonType: AvatarAssetsLodSkeletonType;
  private _activeEventListeners: Map<THREE.AnimationAction, AnimEventHandler>;

  public get skeletonType(): AvatarAssetsLodSkeletonType {
    return this._skeletonType;
  }

  public set skeletonType(value: AvatarAssetsLodSkeletonType) {
    this._skeletonType = value;
  }

  public get activeAnimation(): Optional<AnimationSequenceItem> {
    return this._activeSequence;
  }

  constructor(
    pool: AnimationPool,
    mixer: THREE.AnimationMixer,
    idleCategory: AnimationCategory = AnimationCategory.CATEGORY_IDLE,
  ) {
    this._animationPool = pool;
    this._mixer = mixer;
    this._idleCategory = idleCategory;
    this._skeletonType = AvatarAssetsLodSkeletonType.SKELETON_TYPE_COMPLEX;
    this._activeEventListeners = new Map<THREE.AnimationAction, AnimEventHandler>();
  }

  private async _createSequence(
    anim: RuntimeAnimation,
    mirrored = false,
  ): Promise<AnimationSequenceItem | undefined> {
    const config = anim.animation?.config ?? {};

    // Get animation clip with preferred skeleton type
    const clip = this.getAnimationClip(anim, this.skeletonType, mirrored);
    if (!clip) {
      return undefined;
    }

    // Get an action for this clip.
    const action = this._mixer.clipAction(clip);
    this._setAnimationWeight(action, 0);

    // Configure the action.
    action.clampWhenFinished = config.clamp ?? false;

    let loop = config.maxLoops ?? 0;
    let sequenceDuration = clip.duration;

    if (loop > 0) {
      action.setLoop(THREE.LoopRepeat, Infinity);

      // If we are going to randomize the num of loops, let's do that.
      if (config.randomizeLoops) {
        loop = Math.ceil(Math.random() * loop);
      }

      // Calculate the duration of this sequence.
      sequenceDuration = clip.duration * loop;
    } else {
      action.setLoop(THREE.LoopOnce, 0);
    }

    const crossfadeTime = config.fadeInTimeSec || DEFAULT_FADEIN_TIME;

    return {
      sequenceName: anim.animation.id ?? 'unknown',
      action,
      animation: anim,
      sequenceDuration,
      nextSequenceStart: performance.now() + (sequenceDuration - crossfadeTime) * 1000,
    };
  }

  private getAnimationClip(
    anim: RuntimeAnimation,
    skeletonType: AvatarAssetsLodSkeletonType,
    mirrored: boolean,
  ): THREE.AnimationClip | undefined {
    // Use default clip if mirrored not set
    if (mirrored) {
      if (skeletonType === AvatarAssetsLodSkeletonType.SKELETON_TYPE_SIMPLE) {
        return anim.mirroredClipSimple || anim.clipSimple;
      } else {
        return anim.mirroredClip || anim.clip;
      }
    } else {
      if (skeletonType === AvatarAssetsLodSkeletonType.SKELETON_TYPE_SIMPLE) {
        return anim.clipSimple;
      } else {
        return anim.clip;
      }
    }
  }

  private async _playNextBaseSequence(): Promise<void> {
    const baseAnimations = await this._animationPool.getAnimationsByCategory(
      this._idleCategory,
    );
    const previousSequence = this._activeSequence;

    // Get a base sequence to play. If there is one active, try to get
    // one that is different to keep things feeling organic.
    const nextAnimation = previousSequence
      ? ArrayUtils.randomUniqueFromArray(
          baseAnimations,
          previousSequence.animation,
          (a, b) => a.animation.id === b.animation.id,
        )
      : ArrayUtils.randomFromArray(baseAnimations);
    const nextSequence = await this._createSequence(nextAnimation, false);
    if (!nextSequence) {
      // basically should not happen if data is correctly defined
      return;
    }

    // Check that this sequence has not been cancelled
    if (this._playNextSequencePromise === null) {
      return;
    }

    // Crossfade between the current and previous animation, and cache our new animation sequence.
    this._executeCrossFade(
      nextSequence.animation.animation.config?.fadeInTimeSec || DEFAULT_FADEIN_TIME,
      nextSequence.action,
      previousSequence?.action,
    );

    this._activeSequence = nextSequence;
  }

  private _attemptToPlayNextSequence() {
    if (this._playNextSequencePromise) {
      return;
    }

    this._playNextSequencePromise = this._playNextBaseSequence();
    this._playNextSequencePromise
      .then(() => {
        this._playNextSequencePromise = null;
        return;
      })
      .catch(() => {
        this._playNextSequencePromise = null;
      });
  }

  private _shouldSequenceChange(frametime: number): boolean {
    if (!this._activeSequence) {
      return true;
    }

    return this._activeSequence.nextSequenceStart <= frametime;
  }

  private _setAnimationWeight(action: THREE.AnimationAction, weight: number): void {
    action.enabled = true;
    action.paused = false;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
    action.play();
  }

  private _executeCrossFade(
    duration: number,
    targetAction: THREE.AnimationAction,
    startAction?: THREE.AnimationAction,
  ) {
    this._setAnimationWeight(targetAction, 1);
    targetAction.time = 0;

    if (!startAction) {
      targetAction.fadeIn(0);
    } else {
      startAction.crossFadeTo(targetAction, duration, true);
    }
  }

  private async _executeAnimation(
    anim: RuntimeAnimation,
    mirrored = false,
    onCompleted?: VoidFunction,
    force = false,
  ): Promise<void> {
    const animationID = anim.animation.id;

    const previousSequence = this._activeSequence;

    if (animationID === previousSequence?.sequenceName && !force) {
      console.warn(`Trying to spam animation ${animationID}, ignoring!`);
      onCompleted?.();
      return;
    }

    const sequence = await this._createSequence(anim, mirrored);
    if (!sequence) {
      // basically should not happen if data is correctly defined
      return;
    }

    this._executeCrossFade(
      sequence.animation.animation.config?.fadeInTimeSec || DEFAULT_FADEIN_TIME,
      sequence.action,
      previousSequence?.action,
    );

    this._activeSequence = sequence;

    if (onCompleted) {
      const handler: AnimEventHandler = (ev) => {
        if (ev.type !== 'finished' || ev.action !== sequence.action) {
          return;
        }

        this._mixer.removeEventListener('finished', handler);
        this._activeEventListeners.delete(ev.action);

        onCompleted();
      };

      this._activeEventListeners.set(sequence.action, handler);
      this._mixer.addEventListener('finished', handler);
    }
  }

  // @todo: Action queue?
  public async executeAnimationById(
    animationID: string,
    mirrored = false,
    onCompleted?: VoidFunction,
    force = false,
  ): Promise<void> {
    const anim = await this._animationPool.getAnimationById(animationID);

    if (!anim) {
      console.warn(`Animation ${animationID} not found!`);
      onCompleted?.();
      return;
    }

    this._executeAnimation(anim, mirrored, onCompleted, force);
  }

  public async executeAnimationByCategory(
    category: AnimationCategory,
    mirrored = false,
    onCompleted?: VoidFunction,
    force = false,
  ): Promise<Optional<RuntimeAnimation>> {
    // Wow, this is legit ugly. Let's try to clean up the entire animation system at some point.
    if (this._activeSequence?.animation.animation.category?.includes(category) === true) {
      onCompleted?.();
      return undefined;
    }

    const anims = await this._animationPool.getAnimationsByCategory(category);

    if (!anims.length) {
      console.warn(`No animations found for category ${category}!`);
      onCompleted?.();
      return undefined;
    }

    const anim = ArrayUtils.randomFromArray(anims);
    this._executeAnimation(anim, mirrored, onCompleted, force);

    return anim;
  }

  public update(deltaTime: number): void {
    if (this._shouldSequenceChange(performance.now())) {
      this._attemptToPlayNextSequence();
    }

    this._mixer.update(deltaTime);
  }

  public setTime(time: number) {
    this._mixer.setTime(time);
  }

  public stopAnimation() {
    this._mixer.stopAllAction();

    // Finish all handlers (so nothing leaks)
    for (const [action, handler] of this._activeEventListeners) {
      handler({
        type: 'finished',
        action: action,
        direction: 1,
        target: this._mixer,
      });

      this._activeEventListeners.delete(action);
    }

    this._playNextSequencePromise = null;
    this._activeSequence = undefined;
  }
}
