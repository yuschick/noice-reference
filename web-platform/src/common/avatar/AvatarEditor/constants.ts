import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';

import { ExtendedAvatarPartCategory } from './types';

export const ClothingCategories: AvatarPartCategory[] = [
  AvatarPartCategory.CATEGORY_FACE_ITEM,
  AvatarPartCategory.CATEGORY_HANDS,
  AvatarPartCategory.CATEGORY_HEAD_ITEM,
  AvatarPartCategory.CATEGORY_LEGS,
  AvatarPartCategory.CATEGORY_SHOES,
  AvatarPartCategory.CATEGORY_TORSO,
];

export const OverrideRemovedCategories: ExtendedAvatarPartCategory[] = [
  AvatarPartCategory.CATEGORY_HEAD_ITEM,
  AvatarPartCategory.CATEGORY_FACE_ITEM,
];

export const CategoryToEditorAnimation: Map<AvatarPartCategory, AnimationCategory> =
  new Map([
    [AvatarPartCategory.CATEGORY_BODY, AnimationCategory.CATEGORY_EDITOR_PICK_BODY],
    [AvatarPartCategory.CATEGORY_TORSO, AnimationCategory.CATEGORY_EDITOR_PICK_JACKET],
    [AvatarPartCategory.CATEGORY_LEGS, AnimationCategory.CATEGORY_EDITOR_PICK_PANTS],
    [AvatarPartCategory.CATEGORY_SHOES, AnimationCategory.CATEGORY_EDITOR_PICK_SHOES],
  ]);
