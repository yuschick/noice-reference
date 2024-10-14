import { useIsMouseLeavingCard, useMousePositionOnCard } from '@noice-com/card-game';
import classNames from 'classnames';
import { CSSProperties, useRef } from 'react';

import CardBackBackground from './assets/card-back-background_01.png';
import CardBackLogo from './assets/card-back-noice-logo.png';
import CardBackPatternMask from './assets/card-back-patternMask_01.png';
import CardBackShineMask from './assets/card-back-shine-mask_01.png';
import { useCardBacksideTransforms } from './hooks';
import styles from './StoreItemGameCardBackside.module.css';

interface Props {
  className?: string;
  hasGlow?: boolean;
  onClick?(): void;
}

export function StoreItemGameCardBackside({ className, hasGlow, onClick }: Props) {
  const RootElement = onClick ? 'button' : 'div';
  const isGlowVisible = hasGlow;
  const playingCardRef = useRef<HTMLDivElement | HTMLButtonElement>(null);
  const { positionOnCard, isHovering } = useMousePositionOnCard({
    card: playingCardRef,
  });
  const { isMouseLeaving } = useIsMouseLeavingCard({ isHovering });
  const cssTransformVars = useCardBacksideTransforms({ positionOnCard });

  return (
    <RootElement
      className={classNames(styles.wrapper, className, {
        [styles.noGlow]: !isGlowVisible,
        [styles.isHovering]: isHovering,
        [styles.mouseIsLeaving]: isMouseLeaving,
      })}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={playingCardRef}
      style={
        {
          ...cssTransformVars,
          '--card-back-background': `url(${CardBackBackground})`,
          '--card-back-shine-mask': `url(${CardBackShineMask})`,
          '--card-back-pattern-mask': `url(${CardBackPatternMask})`,
        } as CSSProperties
      }
      onClick={onClick}
    >
      <div className={classNames(styles.movingWrapper)}>
        <div className={styles.innerBorder}>
          <div className={styles.shine} />
          <div className={styles.shineCircle} />
          <div className={styles.content}>
            <img
              alt="Noice"
              className={styles.logo}
              src={CardBackLogo}
            />
          </div>
        </div>
      </div>
    </RootElement>
  );
}
