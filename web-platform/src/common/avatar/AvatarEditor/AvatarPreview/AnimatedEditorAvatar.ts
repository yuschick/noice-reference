import { AvatarBuilder } from '@noice-com/avatar-builder';
import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { AnimationPoolV2 } from '@noice-com/web-renderer/src/legacy';
// eslint-disable-next-line no-restricted-imports
import { AnimatedAvatar } from '@noice-com/web-renderer/src/legacy/sandboxes/avatar-viewer/animated-avatar';

export class AnimatedEditorAvatar extends AnimatedAvatar {
  private _avatarComposition: Nullable<AvatarBuilder.BodyComposition> = null;

  constructor(pool: AnimationPoolV2) {
    super(pool, AnimationCategory.CATEGORY_EDITOR_IDLE);
  }

  public get avatarComposition(): Nullable<AvatarBuilder.BodyComposition> {
    return this._avatarComposition;
  }

  public set avatarComposition(composition: Nullable<AvatarBuilder.BodyComposition>) {
    this._avatarComposition = composition;

    this.setAnimationObject(composition?.avatarRoot || null);
  }
}
