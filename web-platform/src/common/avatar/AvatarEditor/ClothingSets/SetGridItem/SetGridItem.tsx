import {
  CommonUtils,
  Image,
  VisuallyHidden,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from '@noice-com/common-ui';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import classNames from 'classnames';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import styles from './SetGridItem.module.css';

interface Props {
  avatarParts: AvatarPart[];
  setName: string;
  selected: boolean;
  onSelect(setName: string): void;
}

export function SetGridItem({ avatarParts, setName, selected, onSelect }: Props) {
  const onMouseEnter = useMouseEnterWithSound();
  const onClickWithSound = useMouseClickWithSound(
    !selected ? () => onSelect(setName) : undefined,
  );

  return (
    <button
      aria-current={selected ? 'true' : 'false'}
      aria-label={`Select ${setName} outfit`}
      className={styles.outfitItem}
      onClick={onClickWithSound}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.imageContainer}>
        <div className={styles.imageList}>
          {avatarParts.map((part, index) => (
            <Image
              alt={part.name}
              className={styles.image}
              decoding="async"
              key={`part_${index}`}
              loading="lazy"
              loadingType="none"
              sizes={`${CommonUtils.getRem(100)}`}
              src={part.previewImgUrl}
            />
          ))}
        </div>
      </div>
      <p className={styles.outfitName}>{setName}</p>
      {selected && (
        <IoIosCheckmarkCircle
          className={classNames(styles.checkIcon, { [styles.selected]: selected })}
        />
      )}
      <VisuallyHidden>Select ${setName} outfit</VisuallyHidden>
    </button>
  );
}
