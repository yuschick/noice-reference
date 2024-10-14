import { CoreAssets } from '@noice-com/assets-core';
import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useMemo } from 'react';

import { AvatarComposition } from '../../types';
import { CategoryTitle } from '../CategoryTitle/CategoryTitle';
import { Grid } from '../Grid/Grid';
import { getCompositionGender } from '../utils';

import styles from './Heads.module.css';

interface Props {
  avatarParts: AvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  onSelect(part: AvatarPart): void;
}

export function Heads({ avatarComposition, avatarParts, onSelect }: Props) {
  const selectableParts = useMemo(
    () =>
      avatarParts.filter(
        (part) =>
          part.gender === getCompositionGender(avatarComposition) &&
          part.category === AvatarPartCategory.CATEGORY_HEAD,
      ) ?? [],
    [avatarParts, avatarComposition],
  );

  const selectedCategoryPartId =
    avatarComposition?.get(AvatarPartCategory.CATEGORY_HEAD)?.id ?? null;

  return (
    <div className={styles.headContainer}>
      <CategoryTitle
        icon={CoreAssets.Icons.FacePreset}
        title="Head type"
      />

      <Grid
        avatarParts={selectableParts}
        isClearable={false}
        label={AvatarPartCategory.CATEGORY_HEAD}
        selectedPartId={selectedCategoryPartId}
        onClear={() => {}}
        onSelect={onSelect}
      />
    </div>
  );
}
