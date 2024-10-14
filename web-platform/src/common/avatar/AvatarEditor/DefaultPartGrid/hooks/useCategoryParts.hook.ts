import { AvatarPart, Gender } from '@noice-com/schemas/avatar/avatar.pb';
import { useMemo } from 'react';

import { ExtendedAvatarPartCategory } from '../../types';

interface HookResult {
  selectableParts: AvatarPart[];
}

interface Props {
  avatarParts: AvatarPart[];
  selectedCategory: ExtendedAvatarPartCategory;
  compositionGender: Gender;
}

export function useCategoryParts({
  avatarParts,
  selectedCategory,
  compositionGender,
}: Props): HookResult {
  const selectableParts = useMemo(
    () =>
      avatarParts.filter((part) => {
        return (
          (part.gender === compositionGender ||
            part.gender === Gender.GENDER_UNSPECIFIED) &&
          part.category === selectedCategory
        );
      }) ?? [],
    [avatarParts, selectedCategory, compositionGender],
  );

  return {
    selectableParts,
  };
}
