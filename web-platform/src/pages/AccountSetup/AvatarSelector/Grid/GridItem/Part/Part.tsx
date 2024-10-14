import { CoreAssets } from '@noice-com/assets-core';
import { Icon, Image, VisuallyHidden } from '@noice-com/common-ui';
import { AvatarPart, AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import classNames from 'classnames';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import styles from './Part.module.css';

interface Props {
  selected?: boolean;
  part: AvatarPart;
}

export function Part({ selected, part }: Props) {
  return (
    <div className={classNames(styles.partContainer, { [styles.selected]: selected })}>
      {part.previewImgUrl ? (
        <Image
          alt={part.name}
          className={styles.partImage}
          src={part.previewImgUrl}
        />
      ) : (
        <>
          {part.category === AvatarPartCategory.CATEGORY_BODY && (
            <Icon
              className={styles.partIcon}
              icon={CoreAssets.Icons.BodyType}
            />
          )}
          {part.category === AvatarPartCategory.CATEGORY_HEAD && (
            <Icon
              className={styles.partIcon}
              icon={CoreAssets.Icons.FacePreset}
            />
          )}
        </>
      )}
      <span className={styles.partName}>{part.name}</span>
      <VisuallyHidden>{`Select ${part.name}`}</VisuallyHidden>
      {selected && (
        <IoIosCheckmarkCircle
          className={classNames(styles.checkIcon, { [styles.selected]: selected })}
        />
      )}
    </div>
  );
}
