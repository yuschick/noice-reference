import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { useMemo } from 'react';

interface Props {
  avatarParts: AvatarPart[];
}

interface HookResult {
  colorPresets: AvatarPart[];
  hairColorParts: AvatarPart[];
  skinColorParts: AvatarPart[];
  eyebrowColorParts: AvatarPart[];
  eyelashColorParts: AvatarPart[];
}

export function useColorParts({ avatarParts }: Props): HookResult {
  const hairColorParts = useMemo(
    () =>
      avatarParts.filter(
        (part) => part.category === AvatarPartCategory.CATEGORY_HAIR_COLOR,
      ) ?? [],
    [avatarParts],
  );

  const skinColorParts = useMemo(
    () =>
      avatarParts.filter(
        (part) => part.category === AvatarPartCategory.CATEGORY_SKIN_COLOR,
      ) ?? [],
    [avatarParts],
  );

  const eyebrowColorParts =
    useMemo(
      () =>
        avatarParts.filter(
          (part) => part.category === AvatarPartCategory.CATEGORY_EYEBROWS_COLOR,
        ),
      [avatarParts],
    ) ?? [];

  const eyelashColorParts =
    useMemo(
      () =>
        avatarParts.filter(
          (part) => part.category === AvatarPartCategory.CATEGORY_EYELASHES_COLOR,
        ),
      [avatarParts],
    ) ?? [];

  const colorPresets = useMemo(
    () =>
      avatarParts.filter(
        (part) => part.category === AvatarPartCategory.CATEGORY_COLOR_PRESET,
      ),
    [avatarParts],
  );

  return {
    colorPresets,
    skinColorParts,
    hairColorParts,
    eyebrowColorParts,
    eyelashColorParts,
  };
}
