import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { AvatarComposition, AvatarCustomisations } from '../../types';
import { CategorySettings } from '../CategorySelect/types';
import { getDefaultCustomisation } from '../utils';

import { ColorSelect } from './ColorSelect/ColorSelect';
import { useColorParts } from './hooks/useColorParts.hook';

interface ActiveColorProps {
  parts: AvatarPart[];
  columnLength: number;
  selectedColorId: Nullable<string>;
}

interface Props {
  avatarParts: AvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  avatarCustomisations: Nullable<AvatarCustomisations>;
  selectedCategory: CategorySettings;
  onSelect(part: AvatarPart): void;
}

export function ColorSelectors({
  avatarParts,
  selectedCategory,
  avatarComposition,
  avatarCustomisations,
  onSelect,
}: Props) {
  const { skinColorParts, hairColorParts, eyebrowColorParts, colorPresets } =
    useColorParts({
      avatarParts,
    });

  const getActiveColorProps = useCallback((): Nullable<ActiveColorProps> => {
    switch (selectedCategory.type) {
      case AvatarPartCategory.CATEGORY_HEAD:
      case AvatarPartCategory.CATEGORY_BODY:
        return {
          columnLength: 6,
          parts: skinColorParts,
          selectedColorId:
            avatarComposition?.get(AvatarPartCategory.CATEGORY_SKIN_COLOR)?.id ?? null,
        };
      case AvatarPartCategory.CATEGORY_HAIR:
        return {
          columnLength: 4,
          parts: hairColorParts,
          selectedColorId:
            avatarComposition?.get(AvatarPartCategory.CATEGORY_HAIR_COLOR)?.id ?? null,
        };
      case AvatarPartCategory.CATEGORY_EYEBROWS:
        return {
          columnLength: 4,
          parts: eyebrowColorParts,
          selectedColorId:
            avatarComposition?.get(AvatarPartCategory.CATEGORY_EYEBROWS_COLOR)?.id ??
            null,
        };
    }

    const part = avatarComposition?.get(selectedCategory.type);

    if (!part || !part.colorPresetOptions?.length || !part.id) {
      return null;
    }

    const partCustomisation = avatarCustomisations?.get(part.id);

    const selectedColorId = partCustomisation
      ? partCustomisation.colorPreset ?? null
      : getDefaultCustomisation(part)?.colorPreset ?? null;

    return {
      columnLength: part.colorPresetOptions.length,
      parts: part.colorPresetOptions.reduce<AvatarPart[]>((prev, current) => {
        const colorPart = colorPresets.find((preset) => preset.id === current);

        if (colorPart) {
          prev.push(colorPart);
        }

        return prev;
      }, []),
      selectedColorId,
    };
  }, [
    selectedCategory,
    avatarComposition,
    avatarCustomisations,
    colorPresets,
    skinColorParts,
    hairColorParts,
    eyebrowColorParts,
  ]);

  const activeColorProps = getActiveColorProps();

  if (!activeColorProps) {
    return null;
  }

  return (
    <ColorSelect
      colors={activeColorProps.parts}
      columnLength={activeColorProps.columnLength}
      selectedId={activeColorProps.selectedColorId}
      onSelect={onSelect}
    />
  );
}
