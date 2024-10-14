import {
  AvatarPart,
  AvatarPartCategory,
  Gender,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { BodyAndHead } from '../BodyAndHead/BodyAndHead';
import { CategorySettings } from '../CategorySelect/types';
import { ClothingSets } from '../ClothingSets/ClothingSets';
import { DefaultCategory } from '../DefaultCategory/DefaultCategory';
import { LocalCategories } from '../types';

import { WalletWalletCurrency } from '@gen';

interface Props {
  avatarParts: ExtendedAvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  selectedCategory: CategorySettings;
  currency?: WalletWalletCurrency;
  onSelect(part: AvatarPart): void;
  onSelectSet(setName: string, parts: AvatarPart[]): void;
  onSelectGender(gender: Gender): void;
  onClear(): void;
}

export function CategoryContent({
  avatarParts,
  avatarComposition,
  selectedCategory,
  currency,
  onSelect,
  onSelectSet,
  onSelectGender,
  onClear,
}: Props) {
  return (
    <>
      {selectedCategory.type === AvatarPartCategory.CATEGORY_BODY && (
        <BodyAndHead
          avatarComposition={avatarComposition}
          avatarParts={avatarParts}
          currency={currency}
          onSelect={onSelect}
          onSelectGender={onSelectGender}
        />
      )}

      {selectedCategory.type === LocalCategories.CATEGORY_OUTFIT && (
        <ClothingSets
          avatarComposition={avatarComposition}
          avatarParts={avatarParts}
          currency={currency}
          onSelect={onSelectSet}
        />
      )}

      {selectedCategory.type !== AvatarPartCategory.CATEGORY_BODY &&
        selectedCategory.type !== LocalCategories.CATEGORY_OUTFIT && (
          <DefaultCategory
            avatarComposition={avatarComposition}
            avatarParts={avatarParts}
            currency={currency}
            selectedCategory={selectedCategory}
            onClear={onClear}
            onSelect={onSelect}
          />
        )}
    </>
  );
}
