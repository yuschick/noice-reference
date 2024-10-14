import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { CategorySettings } from '../CategorySelect/types';
import { CategoryTitle } from '../CategoryTitle/CategoryTitle';
import { DefaultPartGrid } from '../DefaultPartGrid/DefaultPartGrid';

import { WalletWalletCurrency } from '@gen';

interface Props {
  avatarParts: ExtendedAvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  selectedCategory: CategorySettings;
  currency?: WalletWalletCurrency;
  onSelect(part: AvatarPart): void;
  onClear(): void;
}

export function DefaultCategory({
  avatarParts,
  avatarComposition,
  selectedCategory,
  currency,
  onSelect,
  onClear,
}: Props) {
  return (
    <>
      <CategoryTitle
        currency={currency}
        icon={selectedCategory.icon}
        title={selectedCategory.name}
      />
      <DefaultPartGrid
        avatarComposition={avatarComposition}
        avatarParts={avatarParts}
        selectedCategory={selectedCategory.type}
        onClear={onClear}
        onSelect={onSelect}
      />
    </>
  );
}
