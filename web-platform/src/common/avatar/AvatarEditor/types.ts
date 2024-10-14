import { AvatarBuilder } from '@noice-com/avatar-builder';
import { AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

export enum LocalCategories {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CATEGORY_OUTFIT = 'CATEGORY_OUTFIT',
}

export type ExtendedAvatarPartCategory = AvatarPartCategory | LocalCategories;

export type Avatar = Nullable<AvatarBuilder.BodyComposition>;
