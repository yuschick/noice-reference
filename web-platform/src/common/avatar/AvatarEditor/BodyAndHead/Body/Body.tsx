import { CoreAssets } from '@noice-com/assets-core';
import { Button } from '@noice-com/common-ui';
import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import { AvatarComposition } from '../../../types';
import { CategoryTitle } from '../../CategoryTitle/CategoryTitle';
import { getCompositionGender } from '../../utils';

import styles from './Body.module.css';

interface Props {
  avatarParts: AvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  onSelect(part: AvatarPart): void;
}

export function Body({ avatarComposition, avatarParts, onSelect }: Props) {
  const selectedCategoryPartId =
    avatarComposition?.get(AvatarPartCategory.CATEGORY_BODY)?.id ?? null;

  return (
    <div className={styles.bodyContainer}>
      <CategoryTitle
        icon={CoreAssets.Icons.BodyType}
        title="Body type"
      />

      <div className={styles.bodyTypeButtonsContainer}>
        {avatarParts
          .filter(
            (part) =>
              part.category === AvatarPartCategory.CATEGORY_BODY &&
              part.gender === getCompositionGender(avatarComposition),
          )
          .map((part) => (
            <div key={`body_type_${part.id}`}>
              <Button
                level={selectedCategoryPartId === part.id ? 'primary' : 'secondary'}
                shape="pill"
                size="md"
                onClick={() => onSelect(part)}
              >
                {part.name}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
