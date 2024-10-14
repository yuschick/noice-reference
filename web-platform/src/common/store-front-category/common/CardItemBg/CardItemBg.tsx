import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './CardItemBg.module.css';

interface Props {
  showBorder?: boolean;
  image?: string;
  shouldDarkenBackground?: boolean;
}

export function CardItemBg({ image, showBorder, shouldDarkenBackground }: Props) {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.border]: showBorder,
      })}
      style={{ '--_bg-image': `url(${image})` } as CSSProperties}
    >
      <div
        className={classNames(styles.backgroundImage, {
          [styles.dark]: shouldDarkenBackground,
        })}
      />

      <div className={styles.darkerColor} />
    </div>
  );
}
