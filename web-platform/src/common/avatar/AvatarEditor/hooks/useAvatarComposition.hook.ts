import { useClient, useConditionalOnce } from '@noice-com/common-react-core';
import {
  AvatarPart,
  AvatarPartCategory,
  AvatarPartCustomization,
  Gender,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AvatarComposition, AvatarCustomisations } from '../../types';
import { ClothingCategories, OverrideRemovedCategories } from '../constants';
import {
  changeAvatarGender,
  getDefaultCustomisation,
  getInitialAvatarComposition,
  randomizeOutfit,
} from '../utils';

interface Props {
  avatarParts: Nullable<AvatarPart[]>;
  avatarId?: string;
}

interface AvatarData {
  composition: Nullable<AvatarComposition>;
  customisations: Nullable<AvatarCustomisations>;
}

interface CompositionActions {
  revert(): void;
  clearItem(category: AvatarPartCategory): void;
  changeItem(part: AvatarPart): boolean;
  equipClothingSet(items: AvatarPart[]): void;
  randomize(): void;
  changeCustomisation(partId: string, customisation: AvatarPartCustomization): void;
  removeCustomisation(partId: string, type: 'colorPreset' | 'skin'): void;
  changeGender(gender: Gender): void;
}

interface HookResult extends AvatarData {
  actions: CompositionActions;
  loading: boolean;
  isInitialAvatarDefault: boolean;
  compositionHasChanged: boolean;
}

export function useAvatarComposition({ avatarParts, avatarId }: Props): HookResult {
  const cli = useClient();
  const [composition, setComposition] = useState<Nullable<AvatarComposition>>(null);
  const [customisations, setCustomisations] =
    useState<Nullable<AvatarCustomisations>>(null);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const originalAvatarData = useRef<Nullable<AvatarData>>(null);
  const [isInitialAvatarDefault, setIsInitialAvatarDefault] = useState(true);
  const [searchParams] = useSearchParams();

  const handleRevert = () => {
    setComposition(originalAvatarData.current?.composition ?? null);
    setCustomisations(originalAvatarData.current?.customisations ?? null);
    setHasChanged(false);
  };

  const handleClearItem = useCallback(
    (category: AvatarPartCategory) => {
      const existingPart = composition?.get(category);

      if (!existingPart) {
        return;
      }

      const newComposition = new Map(composition);
      newComposition.delete(category);

      // If we removed the hair, also remove the hair color
      if (category === AvatarPartCategory.CATEGORY_HAIR) {
        newComposition.delete(AvatarPartCategory.CATEGORY_HAIR_COLOR);
      }

      // Remove also items possible customisations
      if (existingPart.id && customisations?.get(existingPart.id)) {
        const newCustomisations = new Map(customisations);
        newCustomisations.delete(existingPart.id);
        setCustomisations(newCustomisations);
      }

      setComposition(newComposition);
      setHasChanged(true);
    },
    [composition, customisations],
  );

  const handleChangeItem = useCallback(
    (part: AvatarPart) => {
      if (!avatarParts) {
        return false;
      }

      const { category, id } = part;

      if (!category || !id) {
        return false;
      }

      // Do not change to the same part again
      if (composition?.get(category)?.id === id) {
        return false;
      }

      const newComposition = new Map(composition);
      newComposition.set(category, part);

      // Add default hair color if we are changing hair and there is no default color
      if (
        category === AvatarPartCategory.CATEGORY_HAIR &&
        !newComposition.get(AvatarPartCategory.CATEGORY_HAIR_COLOR)
      ) {
        const defaultHairPart = avatarParts.find(
          (part) =>
            part.category === AvatarPartCategory.CATEGORY_HAIR_COLOR && !!part.default,
        );

        if (defaultHairPart) {
          newComposition.set(AvatarPartCategory.CATEGORY_HAIR_COLOR, defaultHairPart);
        }
      }

      // If this item overrides any of the categories in OverrideRemovedCategories,
      // just remove it.
      if (part.categoryOverride?.length) {
        part.categoryOverride.forEach(
          (category) =>
            OverrideRemovedCategories.includes(category) &&
            newComposition.delete(category),
        );
      }

      const newCustomisations = new Map(customisations);
      const prevPartId = composition?.get(category)?.id;

      if (prevPartId) {
        newCustomisations.delete(prevPartId);
      }

      const defaultCustomisation = getDefaultCustomisation(part);
      if (part.id && defaultCustomisation) {
        newCustomisations.set(part.id, defaultCustomisation);
      }

      setComposition(newComposition);
      setCustomisations(newCustomisations);
      setHasChanged(true);

      return true;
    },
    [composition, customisations, avatarParts],
  );

  const handleRandomize = useCallback(() => {
    if (!avatarParts?.length) {
      return;
    }

    const gender = composition?.get(AvatarPartCategory.CATEGORY_HEAD)?.gender;

    if (!gender) {
      return;
    }

    const newComposition = randomizeOutfit(composition ?? new Map(), avatarParts, {
      gender,
    });

    const customisations = new Map();

    ClothingCategories.forEach((category) => {
      const part = newComposition.get(category);

      if (!part) {
        return;
      }

      const defaultCustomisation = getDefaultCustomisation(part, true);

      if (defaultCustomisation && part.id) {
        customisations.set(part.id, defaultCustomisation);
      }
    });

    setComposition(newComposition);
    setCustomisations(customisations);
    setHasChanged(true);
  }, [composition, avatarParts]);

  const handleEquipClothingSet = useCallback(
    (items: AvatarPart[]) => {
      const newComposition = new Map(composition);
      const newCustomisations = new Map(customisations);

      ClothingCategories.forEach((category) => {
        const existingPartId = composition?.get(category)?.id;
        existingPartId && newCustomisations.delete(existingPartId);

        const part = items.find((item) => item.category === category);

        if (part && part.category && part.id) {
          newComposition.set(part.category, part);
          const defaultCustomisation = getDefaultCustomisation(part);

          if (defaultCustomisation) {
            newCustomisations.set(part.id, defaultCustomisation);
          }

          return;
        }

        newComposition.delete(category);
      });

      setComposition(newComposition);
      setCustomisations(newCustomisations);
      setHasChanged(true);
    },
    [composition, customisations],
  );

  const handleChangeCustomisation = useCallback(
    (partId: string, customisation: AvatarPartCustomization) => {
      const existing = customisations?.get(partId) ?? {};
      const newCustomisations = new Map(customisations);

      newCustomisations.set(partId, { ...existing, ...customisation });

      setCustomisations(newCustomisations);
      setHasChanged(true);
    },
    [customisations],
  );

  const handleRemoveCustomisation = useCallback(
    (partId: string, type: 'colorPreset' | 'skin') => {
      const newCustomisations = new Map(customisations);
      const existing = customisations?.get(partId) ?? {};
      delete existing[type];
      newCustomisations.set(partId, existing);

      setCustomisations(newCustomisations);
      setHasChanged(true);
    },
    [customisations],
  );

  const handleChangeGender = useCallback(
    (gender: Gender) => {
      const templateComposition = new Map<string, AvatarPart>();

      const defaultGenderHeadPart =
        avatarParts?.find(
          (part) =>
            part.category === AvatarPartCategory.CATEGORY_HEAD &&
            part.gender === gender &&
            !!part.default,
        ) ?? null;

      if (!defaultGenderHeadPart || !avatarParts) {
        return;
      }

      templateComposition.set(AvatarPartCategory.CATEGORY_HEAD, defaultGenderHeadPart);
      const newComposition = changeAvatarGender(templateComposition, avatarParts);
      const newCustomisations: AvatarCustomisations = new Map();

      for (const [_key, value] of newComposition.entries()) {
        const defaultCustomisation = getDefaultCustomisation(value);
        if (value.id && defaultCustomisation) {
          newCustomisations.set(value.id, defaultCustomisation);
        }
      }

      setComposition(newComposition);
      setCustomisations(newCustomisations);
      setHasChanged(true);
    },
    [avatarParts],
  );

  useConditionalOnce(() => {
    const getAvatar = async () => {
      const partIdOverrides = searchParams?.get('parts')?.split(',') ?? [];
      const composition = await getInitialAvatarComposition(
        cli,
        avatarId,
        partIdOverrides,
      );

      originalAvatarData.current = composition;

      setIsInitialAvatarDefault(composition.isDefault);

      setComposition(composition.composition);
      setCustomisations(composition.customisations);
      setHasChanged(partIdOverrides?.length > 0);
    };

    getAvatar();
  }, !!avatarParts?.length);

  return {
    composition,
    customisations,
    compositionHasChanged: hasChanged,
    isInitialAvatarDefault,
    loading: (composition?.size ?? 0) === 0,
    actions: {
      revert: handleRevert,
      clearItem: handleClearItem,
      changeItem: handleChangeItem,
      randomize: handleRandomize,
      equipClothingSet: handleEquipClothingSet,
      changeCustomisation: handleChangeCustomisation,
      changeGender: handleChangeGender,
      removeCustomisation: handleRemoveCustomisation,
    },
  };
}
