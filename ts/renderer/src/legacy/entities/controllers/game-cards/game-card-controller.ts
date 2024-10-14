import { AnimationHandedness } from '@noice-com/schemas/avatar/animation.pb';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import * as THREE from 'three';

import { GameCard } from '@legacy/entities/game-card';

export class GameCardController {
  private _reqBones?: [leftHand: THREE.Bone, rightHand: THREE.Bone];
  private _card: GameCard;

  public set skeleton(skeleton: THREE.Skeleton) {
    this._reqBones = this._getAnchors(skeleton);
  }

  constructor(skeleton?: THREE.Skeleton) {
    const card = this._initializeGameCards();
    this._card = card;

    if (skeleton === undefined) {
      return;
    }

    this.skeleton = skeleton;
  }

  private _getAnchors(
    skeleton: THREE.Skeleton,
  ): [leftHand: THREE.Bone, rightHand: THREE.Bone] | undefined {
    const leftHandName = 'LeftHandLocator';
    const rightHandName = 'RightHandLocator';

    const leftHand = skeleton.getBoneByName(leftHandName);
    const rightHand = skeleton.getBoneByName(rightHandName);

    if (!leftHand || !rightHand) {
      return undefined;
    }

    return [leftHand, rightHand];
  }

  private _initializeGameCards(): GameCard {
    const card = new GameCard();
    card.name = 'Card';
    card.position.set(0, 0, 0);
    card.rotation.set(0, 0, 0);

    return card;
  }

  public destruct(): void {
    const card = this._card;
    card.destruct();
  }

  public showCards(rarity: Rarity, handedness: AnimationHandedness) {
    if (this._reqBones === undefined) {
      return;
    }

    const card = this._card;
    const [leftAnchor, rightAnchor] = this._reqBones;

    const [mainCard, mainBone] =
      handedness === AnimationHandedness.HANDEDNESS_LEFT
        ? [card, leftAnchor]
        : [card, rightAnchor];

    mainCard.rarity = rarity;
    mainBone.add(mainCard);
    mainCard.position.set(0, 0, 0);
    mainCard.rotation.set(0, 0, 0);
  }

  public removeCards() {
    const card = this._card;
    card.removeFromParent();
  }
}
