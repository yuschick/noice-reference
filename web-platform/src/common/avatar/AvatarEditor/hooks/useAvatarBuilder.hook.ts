import { AvatarBuilder } from '@noice-com/avatar-builder';
import { useBooleanFeatureFlag, useLazyValue } from '@noice-com/common-ui';
import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { AvatarComposition, AvatarCustomisations } from '../../types';
import { createAvatarConfig } from '../AvatarPreview/utils';
import { OverrideRemovedCategories } from '../constants';
import { Avatar } from '../types';

interface Props {
  avatarComposition: Nullable<AvatarComposition>;
  avatarCustomisations: Nullable<AvatarCustomisations>;
  avatarParts: Nullable<AvatarPart[]>;
  onConstructingAvatar?(constructing: boolean): void;
}

interface HookResult {
  avatar: Avatar;
  processing: boolean;
}

export function useAvatarBuilder({
  avatarComposition,
  avatarCustomisations,
  avatarParts,
  onConstructingAvatar,
}: Props): HookResult {
  const [avatar, setAvatar] = useState<Avatar>(null);
  const avatarBuilder = useLazyValue(
    () => new AvatarBuilder.Builder(new GLTFLoader(), new EXRLoader()),
  );
  const [processing, setProcessing] = useState<boolean>(true);
  const [applyShoeOffset] = useBooleanFeatureFlag('avatars_applyShoeOffset', false);
  const [deformNormalsAndTangents] = useBooleanFeatureFlag(
    'avatarbuilder_deformNormalsAndTangents',
    false,
  );
  const [smoothFaceItemDeformations] = useBooleanFeatureFlag(
    'avatarbuilder_smoothFaceItemDeformations',
    false,
  );

  useEffect(() => {
    if (
      !avatarParts?.length ||
      !avatarComposition?.size ||
      !avatarCustomisations ||
      !(
        avatarComposition.has(AvatarPartCategory.CATEGORY_BODY) &&
        avatarComposition.has(AvatarPartCategory.CATEGORY_HEAD)
      )
    ) {
      return;
    }

    setProcessing(true);
    onConstructingAvatar?.(true);

    const constructAvatar = async () => {
      // All the items that are overridden but did not get removed
      // by OverrideRemovedCategories in item change should be filtered
      // out here, so that they are not shown in the AvatarPreview,
      // but not removed from the actual composition.
      const filteredComposition = new Map(avatarComposition);
      avatarComposition.forEach(
        (part) =>
          part.categoryOverride?.length &&
          part.categoryOverride.forEach(
            (overrideCategory) =>
              !OverrideRemovedCategories.includes(overrideCategory) &&
              filteredComposition.delete(overrideCategory),
          ),
      );

      const extras = {
        applyShoeOffset,
        deformNormalsAndTangents,
        smoothFaceItemDeformations,
      };

      const settings = { ...AvatarBuilder.DefaultBuilderSettings, ...extras };
      const config = createAvatarConfig(
        filteredComposition,
        avatarCustomisations,
        avatarParts,
      );

      const avatar = await avatarBuilder.construct(config, settings);

      setAvatar(avatar);
      onConstructingAvatar?.(false);
      setProcessing(false);
    };

    constructAvatar().catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  }, [
    avatarComposition,
    avatarCustomisations,
    avatarParts,
    avatarBuilder,
    onConstructingAvatar,
    applyShoeOffset,
    deformNormalsAndTangents,
    smoothFaceItemDeformations,
  ]);

  useEffect(() => {
    return () => {
      avatarBuilder.dispose();
    };
  }, [avatarBuilder]);

  return { avatar, processing };
}
