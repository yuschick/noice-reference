import { useConditionalOnce } from '@noice-com/common-react-core';
import { AvatarPart, Gender } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useMemo, useState } from 'react';

import { AvatarComposition } from '../../../types';
import { ClothingCategories } from '../../constants';

interface Props {
  avatarParts: Nullable<AvatarPart[]>;
  avatarComposition: Nullable<AvatarComposition>;
  compositionGender: Gender;
}

interface HookResult {
  sets: Map<string, AvatarPart[]>;
  selectedClothingSet: Nullable<string>;
  actions: {
    selectClothingSet(name: string): void;
  };
}

export function useClothingSets({
  avatarParts,
  avatarComposition,
  compositionGender,
}: Props): HookResult {
  const [selectedClothingSet, setSelectedClothingSet] = useState<Nullable<string>>(null);

  const sets = useMemo(() => {
    const data = new Map<string, AvatarPart[]>();
    avatarParts?.forEach((part) => {
      if (
        !part.clothingSet ||
        (part.gender !== Gender.GENDER_UNSPECIFIED && part.gender !== compositionGender)
      ) {
        return;
      }

      const set = data.get(part.clothingSet);
      if (set) {
        set.push(part);
        return;
      }

      data.set(part.clothingSet, [part]);
    });

    const keyArray = Array.from(data.keys());

    keyArray.forEach((key) => (data.get(key)?.length ?? 0) <= 1 && data.delete(key));

    return data;
  }, [avatarParts, compositionGender]);

  // Resolve the possible clothing set
  useConditionalOnce(() => {
    let clothingSet: Nullable<string> = null;
    let clothingSetItemCount = 0;

    // Loop through all of the categories marked as clothing category
    for (let i = 0; i < ClothingCategories.length; i++) {
      const category = ClothingCategories[i];
      const item = avatarComposition?.get(category);

      // If there is no item in the composition for this category, just skip to next
      if (!item) {
        continue;
      }

      // If there is an item in the category slot and it doesn't have a clothingSet
      // or it doesn't match the one that we have seen already, just break out. We
      // cannot have a valid clothing set on the avatar.
      if (!item?.clothingSet || (clothingSet && item.clothingSet !== clothingSet)) {
        clothingSet = null;
        break;
      }

      // Set the current clothing set to the one that item has
      clothingSet = item.clothingSet;
      // Increase the count of items of the same clothingSet on the avatar
      clothingSetItemCount += 1;
    }

    // If we didn't find a clothing set or the item count is not the same as it should
    // be with the found clothing set, return. We cannot have the clothing set fully
    // applied.
    if (!clothingSet || clothingSetItemCount !== sets.get(clothingSet)?.length) {
      return;
    }

    // The avatar is wearing just the clothing set and nothing more
    setSelectedClothingSet(clothingSet);
  }, !!avatarParts && !!avatarComposition && !!avatarComposition.size && !!sets);

  useEffect(() => {
    if (!avatarComposition || !selectedClothingSet || !sets.size) {
      return;
    }

    if (!avatarComposition.size) {
      setSelectedClothingSet(null);
      return;
    }

    const selectedSet = sets.get(selectedClothingSet);

    if (!selectedSet || avatarComposition.size < selectedSet.length) {
      setSelectedClothingSet(null);
      return;
    }

    for (const part of selectedSet) {
      if (part.category && avatarComposition.get(part.category)?.id !== part.id) {
        setSelectedClothingSet(null);
        break;
      }
    }
  }, [avatarComposition, selectedClothingSet, sets]);

  return {
    sets,
    selectedClothingSet,
    actions: { selectClothingSet: setSelectedClothingSet },
  };
}
