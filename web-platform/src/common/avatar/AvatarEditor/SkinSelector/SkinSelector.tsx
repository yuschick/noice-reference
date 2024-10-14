import { Image, VisuallyHidden } from '@noice-com/common-ui';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback } from 'react';

import { AvatarComposition, AvatarCustomisations } from '../../types';
import { CategorySettings } from '../CategorySelect/types';

import styles from './SkinSelector.module.css';

interface Props {
  avatarParts: AvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  avatarCustomisations: Nullable<AvatarCustomisations>;
  selectedCategory: CategorySettings;
  onSelect(part: AvatarPart): void;
}

export function SkinSelector({
  avatarParts,
  avatarComposition,
  avatarCustomisations,
  selectedCategory,
  onSelect,
}: Props) {
  const getSkinParts = useCallback(() => {
    const part = avatarComposition?.get(selectedCategory.type);

    if (!part || !part.skinOptions?.length) {
      return [];
    }

    const skinParts: AvatarPart[] = [part];

    part.skinOptions.forEach((skinOptionId) => {
      const skinPart = avatarParts.find(
        (part) => part.id === skinOptionId && !!part.previewImgUrl,
      );

      if (!skinPart) {
        return;
      }

      skinParts.push(skinPart);
    });

    return skinParts;
  }, [avatarComposition, selectedCategory.type, avatarParts]);

  const part = avatarComposition?.get(selectedCategory.type);
  const selectedSkinPartId = part?.id
    ? avatarCustomisations?.get(part.id)?.skin ?? part.id
    : null;

  const skinParts = getSkinParts();

  if (!skinParts.length) {
    return null;
  }

  return (
    <div className={styles.skinSelectorContainer}>
      <span className={styles.titleText}>Skin</span>
      {skinParts.map((part, index) => {
        if (!part.previewImgUrl) {
          return null;
        }

        return (
          <button
            aria-current={part.id === selectedSkinPartId ? 'true' : 'false'}
            aria-label={`Change skin to ${part.name}`}
            className={classNames(styles.skinButton, {
              [styles.selected]: part.id === selectedSkinPartId,
            })}
            key={`${part.id}-${index}`}
            onClick={() => part.id && onSelect(part)}
          >
            <Image
              alt={`Preview for skin ${part.name}`}
              className={styles.skinPreviewImage}
              loading="lazy"
              src={part.previewImgUrl}
            />
            <VisuallyHidden>Change skin to {part.name}</VisuallyHidden>
          </button>
        );
      })}
    </div>
  );
}
