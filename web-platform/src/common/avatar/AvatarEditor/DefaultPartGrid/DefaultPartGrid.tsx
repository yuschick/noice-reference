import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { Grid } from '../Grid/Grid';
import { ExtendedAvatarPartCategory } from '../types';
import { getCompositionGender } from '../utils';

import { useCategoryParts } from './hooks/useCategoryParts.hook';

interface Props {
  avatarParts: ExtendedAvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  selectedCategory: ExtendedAvatarPartCategory;
  onSelect(part: AvatarPart): void;
  onClear(): void;
}

export function DefaultPartGrid({
  avatarParts,
  avatarComposition,
  selectedCategory,
  onSelect,
  onClear,
}: Props) {
  const { selectableParts } = useCategoryParts({
    avatarParts,
    selectedCategory,
    compositionGender: getCompositionGender(avatarComposition),
  });

  const selectedCategoryPartId = avatarComposition?.get(selectedCategory)?.id ?? null;

  const showClearButton =
    selectedCategory === AvatarPartCategory.CATEGORY_HEAD_ITEM ||
    selectedCategory === AvatarPartCategory.CATEGORY_FACE_ITEM ||
    selectedCategory === AvatarPartCategory.CATEGORY_HAIR ||
    selectedCategory === AvatarPartCategory.CATEGORY_HANDS ||
    selectedCategory === AvatarPartCategory.CATEGORY_SHOES ||
    selectedCategory === AvatarPartCategory.CATEGORY_BEARD;

  return (
    <Grid
      avatarParts={selectableParts}
      isClearable={showClearButton}
      label={selectedCategory}
      selectedPartId={selectedCategoryPartId}
      onClear={onClear}
      onSelect={onSelect}
    />
  );
}
