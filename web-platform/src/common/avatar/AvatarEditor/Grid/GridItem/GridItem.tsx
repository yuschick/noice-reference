import {
  WithChildren,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './GridItem.module.css';

interface Props {
  selected?: boolean;
  style?: 'standard' | 'premium' | 'purchaseable';
  onClick(): void;
}

const SHINE_IMAGE_URL = `${NOICE.CDN_URL}/card-shines/v12/levelgroup3.png`;

export function GridItem({ selected, style, children, onClick }: WithChildren<Props>) {
  const onMouseEnter = useMouseEnterWithSound();
  const onClickWithSound = useMouseClickWithSound(onClick);

  return (
    <button
      className={classNames(styles.gridItem, {
        [styles.selected]: selected,
        [styles.premium]: style === 'premium',
        [styles.purchaseable]: style === 'purchaseable',
      })}
      style={
        {
          '--shine-pattern-image-url': `url(${SHINE_IMAGE_URL})`,
        } as CSSProperties
      }
      onClick={onClickWithSound}
      onMouseEnter={onMouseEnter}
    >
      {(style === 'premium' || style === 'purchaseable') && (
        <div className={styles.premiumPattern} />
      )}
      {children}
    </button>
  );
}
