import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Nullable, Optional } from '@noice-com/utils';
import * as THREE from 'three';

import { AnimationControllerV2, AnimationPoolV2 } from '@legacy/entities';
import { RuntimeAnimation } from 'scene/components/animationpool';

export class AnimatedAvatar extends THREE.Group {
  protected _animationObjectGroup: THREE.AnimationObjectGroup;
  protected _animationController: AnimationControllerV2;
  protected _animationObject: Nullable<THREE.Object3D>;
  protected _animationPool: AnimationPoolV2;

  constructor(pool: AnimationPoolV2, animationCategory?: AnimationCategory) {
    super();

    this._animationPool = pool;
    this._animationObject = null;
    this._animationObjectGroup = new THREE.AnimationObjectGroup();

    const mixer = new THREE.AnimationMixer(this._animationObjectGroup);
    this._animationController = new AnimationControllerV2(pool, mixer, animationCategory);
  }

  public setAnimationObject(obj: Nullable<THREE.Object3D>) {
    if (this._animationObject === obj) {
      return;
    }

    if (this._animationObject) {
      this._animationObjectGroup.remove(this._animationObject);
      this._animationObjectGroup.uncache();

      this.remove(this._animationObject);
    }

    this._animationObject = obj;

    if (!this._animationObject) {
      return;
    }

    this._animationObjectGroup.add(this._animationObject);

    this.add(this._animationObject);
  }

  public async triggerAnimationByCategory(
    category: AnimationCategory,
  ): Promise<Optional<RuntimeAnimation>> {
    return this._animationController.executeAnimationByCategory(category);
  }

  public async triggerAnimationById(id: string): Promise<void> {
    return this._animationController.executeAnimationById(id, false, () => {}, true);
  }

  public animate(deltaTime: number): void {
    this._animationController.update(deltaTime);
  }

  public get animationPool() {
    return this._animationPool;
  }
}
