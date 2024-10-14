import { AvatarPart, AvatarPartCustomization } from '@noice-com/schemas/avatar/avatar.pb';

import { AvatarEditorSellableItemFragment } from '@gen';

export type AvatarComposition = Map<string, ExtendedAvatarPart>;
export type AvatarCustomisations = Map<string, AvatarPartCustomization>;

export type ExtendedAvatarPart = AvatarPart & {
  sellableItem?: AvatarEditorSellableItemFragment;
};
