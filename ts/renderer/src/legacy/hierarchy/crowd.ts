import { Observable } from '@noice-com/utils';
import * as THREE from 'three';

import * as API from '@legacy/api';
import { Avatar } from '@legacy/entities';

export class Crowd extends THREE.Group {
  private _animationRate: Observable<API.CrowdAnimationRate>;
  private _staggeredUpdateOffset: number;

  public constructor(animationRate: Observable<API.CrowdAnimationRate>) {
    super();

    this._animationRate = animationRate;
    this._staggeredUpdateOffset = 0.0;
  }

  public destruct(): void {
    this.removeFromParent();
  }

  public update(deltaTime: number): void {
    const animationRate = this._animationRate.value as number;

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
      this.children.length / animationRate,
      1.0,
    );

    const numberOfUpdatesPerPlayerAnimationUpdate = Math.floor(
      this.children.length / numberOfPlayersToAnimatePerUpdate,
    );

    /* We nudge the following two values by a small amount before rounding them to make sure we cannot end up in a
     * situation where we never update the last Player of the last bucket, potentially introduced by a floating-point
     * precision error. */

    const animateFrom = Math.round(this._staggeredUpdateOffset + Number.EPSILON);

    const animateTo = Math.round(
      this._staggeredUpdateOffset + numberOfPlayersToAnimatePerUpdate + Number.EPSILON,
    );

    let index = 0;

    for (const child of this.children) {
      if (
        typeof child.userData.type === 'undefined' ||
        child.userData.type !== 'Player'
      ) {
        continue;
      }

      const avatar = child as Avatar;

      avatar.update(deltaTime);

      if (index >= animateFrom && index < animateTo) {
        avatar.animate(deltaTime * numberOfUpdatesPerPlayerAnimationUpdate);
      }

      ++index;
    }

    this._staggeredUpdateOffset += numberOfPlayersToAnimatePerUpdate;

    if (this._staggeredUpdateOffset >= this.children.length) {
      this._staggeredUpdateOffset = 0.0;
    }
  }
}
