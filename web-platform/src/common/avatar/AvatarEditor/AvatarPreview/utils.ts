import { AvatarBuilder } from '@noice-com/avatar-builder';
import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';

import { AvatarComposition, AvatarCustomisations } from '../../types';

import { CategoryToAvatarPartType, ColorCategoryToAvatarPartType } from './contants';

const { logWarn } = makeLoggers('createAvatarConfig');

export function createAvatarConfig(
  avatarComposition: AvatarComposition,
  avatarCustomisations: Nullable<AvatarCustomisations>,
  avatarParts: Nullable<AvatarPart[]>,
): AvatarBuilder.AvatarConfig {
  const config: AvatarBuilder.AvatarConfig = {
    bodyUrl: avatarComposition.get(AvatarPartCategory.CATEGORY_BODY)?.glbUrl || '',
    headUrl: avatarComposition.get(AvatarPartCategory.CATEGORY_HEAD)?.glbUrl || '',
    skinColor: {
      lutUrl: avatarComposition.get(AvatarPartCategory.CATEGORY_SKIN_COLOR)?.url,
    },
    partUrls: {},
    partColors: {},
    partSkins: {},
  };

  for (const [category, partType] of CategoryToAvatarPartType) {
    const part = avatarComposition.get(category);
    if (!part || !part.id) {
      continue;
    }

    let url: string | undefined;

    if (
      part?.glbUrlOverride?.category &&
      avatarComposition.get(part.glbUrlOverride.category)
    ) {
      url = part.glbUrlOverride.glbUrl;
    } else {
      url = part?.glbUrl;
    }

    config.partUrls[partType] = url;

    const customisation = avatarCustomisations?.get(part.id);

    if (customisation?.colorPreset) {
      const colorPreset = avatarParts?.find(
        (part) => part.id === customisation.colorPreset,
      );

      if (colorPreset?.colors) {
        const colors: string[] = colorPreset.colors;

        if (colors?.length === 1) {
          config.partColors[partType] = {
            color: colors[0],
          };
        } else if (colors?.length === 2) {
          config.partColors[partType] = {
            maskedColors: colors,
          };
        } else {
          logWarn('Only one or two color customisations supported');
        }
      }
    }

    if (customisation?.skin) {
      const skin = avatarParts?.find((part) => part.id === customisation.skin);

      if (
        !(
          skin?.skinData?.baseMapUrl &&
          skin?.skinData?.normalMapUrl &&
          skin?.skinData?.ormMapUrl
        )
      ) {
        continue;
      }

      config.partSkins[partType] = {
        baseMapUrl: skin.skinData?.baseMapUrl,
        normalMapUrl: skin.skinData?.normalMapUrl,
        ormMapUrl: skin.skinData?.ormMapUrl,
        emissionMapUrl: skin.skinData?.emissionMapUrl,
      };
    }
  }

  for (const [category, partType] of ColorCategoryToAvatarPartType) {
    const part = avatarComposition.get(category);
    const url = part?.url;
    const color = part?.color;

    config.partColors[partType] = {
      lutUrl: url,
      color: color,
    };
  }

  return config;
}
