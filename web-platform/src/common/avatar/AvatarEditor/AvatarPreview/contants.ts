/* eslint-disable @typescript-eslint/naming-convention */
import { AvatarBuilder } from '@noice-com/avatar-builder';
import { AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';

export const CategoryToAvatarPartType: Map<
  AvatarPartCategory,
  AvatarBuilder.AvatarPartType
> = new Map([
  [AvatarPartCategory.CATEGORY_HAIR, AvatarBuilder.AvatarPartType.Hair],
  [AvatarPartCategory.CATEGORY_HEAD_ITEM, AvatarBuilder.AvatarPartType.HeadItem],
  [AvatarPartCategory.CATEGORY_FACE_ITEM, AvatarBuilder.AvatarPartType.FaceItem],
  [AvatarPartCategory.CATEGORY_TORSO, AvatarBuilder.AvatarPartType.Torso],
  [AvatarPartCategory.CATEGORY_LEGS, AvatarBuilder.AvatarPartType.Legs],
  [AvatarPartCategory.CATEGORY_SHOES, AvatarBuilder.AvatarPartType.Shoes],
  [AvatarPartCategory.CATEGORY_HANDS, AvatarBuilder.AvatarPartType.Hands],
  [AvatarPartCategory.CATEGORY_EYES, AvatarBuilder.AvatarPartType.Eyes],
  [AvatarPartCategory.CATEGORY_EYEBROWS, AvatarBuilder.AvatarPartType.Eyebrows],
  [AvatarPartCategory.CATEGORY_EYELASHES, AvatarBuilder.AvatarPartType.Eyelashes],
  [AvatarPartCategory.CATEGORY_TEETH, AvatarBuilder.AvatarPartType.Teeth],
  [AvatarPartCategory.CATEGORY_BEARD, AvatarBuilder.AvatarPartType.Beard],
]);

export const ColorCategoryToAvatarPartType: Map<
  AvatarPartCategory,
  AvatarBuilder.AvatarPartType
> = new Map([
  [AvatarPartCategory.CATEGORY_HAIR_COLOR, AvatarBuilder.AvatarPartType.Hair],
  [AvatarPartCategory.CATEGORY_EYEBROWS_COLOR, AvatarBuilder.AvatarPartType.Eyebrows],
  [AvatarPartCategory.CATEGORY_EYELASHES_COLOR, AvatarBuilder.AvatarPartType.Eyelashes],
]);
