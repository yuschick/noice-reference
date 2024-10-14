import { CoreAssets } from '@noice-com/assets-core';
import { GameCard } from '@noice-com/card-game';
import { useHighScoringCardSounds } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useState } from 'react';

import styles from './HighScoringCardWithVFX.module.css';

import { HighScoringCardEventFragment } from '@gen';

export type Props = HighScoringCardEventFragment & {
  className?: string;
};

enum CardAnimationState {
  None,
  New,
}

export function HighScoringCardWithVFX({ card, className, groupName, user }: Props) {
  const [cardAnimationState, setCardAnimationState] = useState<CardAnimationState>(
    CardAnimationState.New,
  );
  const { playCardPromotedSound } = useHighScoringCardSounds();

  useEffect(() => {
    setCardAnimationState(CardAnimationState.New);

    playCardPromotedSound();

    const animStateHandler = setInterval(
      () => setCardAnimationState(CardAnimationState.None),
      3100,
    );

    return () => {
      clearInterval(animStateHandler);
    };
  }, [playCardPromotedSound, groupName, user, card]);

  const showEffects = cardAnimationState === CardAnimationState.New;

  return (
    <div
      className={classNames(styles.gameCard, styles.medium, className, {
        [styles.success]: showEffects,
      })}
      style={
        {
          '--game-card-with-vfx-duration': `3000ms`,
          '--game-card-with-vfx-sprite-image': `url(${CoreAssets.Images.SpriteLightning})`,
        } as CSSProperties
      }
    >
      <div className={styles.content}>
        {showEffects && (
          <div className={styles.spriteContainer}>
            <div className={styles.spriteImage} />
          </div>
        )}

        <div className={styles.card}>
          <GameCard card={{ ...card.card, pointsMin: card.points }} />
        </div>

        {showEffects && (
          <div className={styles.highlightContainer}>
            <div className={styles.highlight} />
          </div>
        )}
      </div>
    </div>
  );
}
