import { Client } from '@noice-com/platform-client';
import {
  AvatarPart,
  AvatarPartCategory,
  AvatarPartCustomization,
  Gender,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';

import { AvatarComposition, AvatarCustomisations, ExtendedAvatarPart } from '../types';

import { ClothingCategories } from './constants';

const { logInfo } = makeLoggers('AvatarEditor');

export function getRandomPartByCategory(
  avatarParts: AvatarPart[],
  category: AvatarPartCategory,
  options?: { gender?: Gender },
): AvatarPart {
  const parts = avatarParts.filter(
    (a) =>
      a.category === category &&
      (options?.gender
        ? options.gender === a.gender || a.gender === Gender.GENDER_UNSPECIFIED
        : true),
  );

  return parts[Math.floor(Math.random() * parts.length)];
}

export function randomizeOutfit(
  currentComposition: AvatarComposition,
  avatarParts: ExtendedAvatarPart[],
  options?: { gender?: Gender },
) {
  const composition = new Map(currentComposition);
  const ownedParts = avatarParts.filter(
    (item) => item.sellable === false || !item.sellableItem,
  );
  const skippedCategories: AvatarPartCategory[] = [];

  !(Math.random() * 10 > 6) &&
    skippedCategories.push(AvatarPartCategory.CATEGORY_HEAD_ITEM);

  !(Math.random() * 10 > 8) &&
    skippedCategories.push(AvatarPartCategory.CATEGORY_FACE_ITEM);

  !(Math.random() * 10 > 8) && skippedCategories.push(AvatarPartCategory.CATEGORY_HANDS);

  ClothingCategories.forEach((category) => {
    if (skippedCategories.includes(category)) {
      composition.delete(category);
      return;
    }

    const part = getRandomPartByCategory(ownedParts, category, options);
    composition.set(category, part);
  });

  return composition;
}

export function getDefaultAvatarParts(
  avatarParts: AvatarPart[],
  gender: Gender,
): AvatarPart[] {
  const parts: AvatarPart[] = [];

  for (const key of Object.keys(AvatarPartCategory)) {
    const part = avatarParts.find(
      (a) => a.category === key && a.gender === gender && a.default === true,
    );

    if (part) {
      parts.push(part);
    }
  }

  // set default colors
  const skinColorPart = avatarParts.find(
    (part) => part.category === AvatarPartCategory.CATEGORY_SKIN_COLOR && !!part.default,
  );
  skinColorPart && parts.push(skinColorPart);

  const hairColorPart = avatarParts.find(
    (part) => part.category === AvatarPartCategory.CATEGORY_HAIR_COLOR && !!part.default,
  );
  hairColorPart && parts.push(hairColorPart);

  const eyebrowColorPart = avatarParts.find(
    (part) =>
      part.category === AvatarPartCategory.CATEGORY_EYEBROWS_COLOR && !!part.default,
  );
  eyebrowColorPart && parts.push(eyebrowColorPart);

  const eyelashColorPart = avatarParts.find(
    (part) =>
      part.category === AvatarPartCategory.CATEGORY_EYELASHES_COLOR && !!part.default,
  );
  eyelashColorPart && parts.push(eyelashColorPart);

  // there is no default eyes or teeth by gender, get them separately
  const defaultEyes = avatarParts.find(
    (a) => a.category === AvatarPartCategory.CATEGORY_EYES,
  );

  defaultEyes && parts.push(defaultEyes);

  const defaultTeeth = avatarParts.find(
    (a) => a.category === AvatarPartCategory.CATEGORY_TEETH,
  );

  defaultTeeth && parts.push(defaultTeeth);

  return parts;
}

export function getAvatarComposition(avatarParts: AvatarPart[]): AvatarComposition {
  const composition = new Map<string, AvatarPart>();

  for (const part of avatarParts) {
    if (part.category) {
      composition.set(part.category, part);
    }
  }

  return composition;
}

export function getAvatarCustomisations(
  customisations: AvatarPartCustomization[],
): AvatarCustomisations {
  const customisationsMap: AvatarCustomisations = new Map();

  customisations.forEach((customisation) => {
    if (!customisation.partId) {
      return;
    }

    customisationsMap.set(customisation.partId, customisation);
  });

  return customisationsMap;
}

export async function getInitialAvatarComposition(
  client: Client,
  avatarId?: string,
  partOverrideIds?: string[],
): Promise<{
  composition: AvatarComposition;
  customisations: AvatarCustomisations;
  isDefault: boolean;
}> {
  let avatarPartIds: string[] = [];
  let avatarPartCustomizations: AvatarPartCustomization[] = [];

  if (!avatarId) {
    logInfo('No Avatar set, getting default composition');
  } else {
    try {
      const avatar = await client.AvatarService.getAvatar(avatarId);

      avatarPartIds = avatar.avatarComposition?.partIds ?? [];
      avatarPartCustomizations = avatar.avatarComposition?.partCustomizations ?? [];
    } catch (e) {
      logInfo('No Avatar found, getting default composition');
    }
  }

  if (partOverrideIds?.length) {
    avatarPartIds = [...partOverrideIds, ...avatarPartIds];
  }

  const [composition, _changes, isDefault] =
    await client.AvatarService.validateAvatarComposition(
      avatarPartIds,
      avatarPartCustomizations,
    );

  const avatarParts = await client.AvatarService.batchGetAvatarParts(
    composition.partIds ?? [],
  );

  return {
    composition: getAvatarComposition(avatarParts),
    customisations: getAvatarCustomisations(composition.partCustomizations ?? []),
    isDefault,
  };
}

export function changeAvatarGender(
  avatarComposition: AvatarComposition,
  avatarParts: AvatarPart[],
): AvatarComposition {
  const head = avatarComposition.get(AvatarPartCategory.CATEGORY_HEAD);
  const gender = head?.gender || Gender.GENDER_MALE;

  const defaultAvatarParts = getDefaultAvatarParts(avatarParts, gender);
  const composition = getAvatarComposition(defaultAvatarParts);

  if (head) {
    composition.set(AvatarPartCategory.CATEGORY_HEAD, head);
  }

  return composition;
}

export function getDefaultCustomisation(
  part: AvatarPart,
  randomColorPreset = false,
): Nullable<AvatarPartCustomization> {
  if (!part.id) {
    return null;
  }

  if (!part.colorPresetOptions?.length || !part.colorPresetOptions?.[0]) {
    return null;
  }

  const presetIndex = randomColorPreset
    ? Math.floor(Math.random() * part.colorPresetOptions.length)
    : 0;

  return {
    colorPreset: part.colorPresetOptions[presetIndex],
    partId: part.id,
  };
}

export function getCompositionGender(
  avatarComposition: Nullable<AvatarComposition>,
): Gender {
  return (
    avatarComposition?.get(AvatarPartCategory.CATEGORY_HEAD)?.gender ?? Gender.GENDER_MALE
  );
}
