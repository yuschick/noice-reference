import { GameCardProps } from '@noice-com/card-game';
import { Tooltip } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useMemo, useRef } from 'react';

import { StoreItemGameCardBackside } from '../StoreItemGameCardBackside';

import { FLIP_TRANSITION_TIME, useCardIsFlipping } from './hooks';
import styles from './StoreItemGameCard.module.css';
import { StoreItemGameCardDuplicates } from './StoreItemGameCardDuplicates';

import { CardStack } from '@common/card-stack';

export interface Props {
  card: GameCardProps['card'];
  cardCount?: number;
  showBackside?: boolean;
  cardClassName?: string;
  isNewStreamerCard?: boolean;
  isOldStreamerCard?: boolean;
  cardIsRevealed?: boolean;
  onReveal?(): void;
}

export function StoreItemGameCard({
  card,
  cardCount,
  showBackside,
  cardClassName: className,
  isNewStreamerCard,
  isOldStreamerCard,
  cardIsRevealed,
  onReveal,
}: Props) {
  const hasBackside = useRef<boolean>(showBackside ?? false);
  const cardIsFlipping = useCardIsFlipping(showBackside);
  const cardLevel = card.leveling.currentLevel;
  const cardClassName = className;

  useEffect(() => {
    if (hasBackside.current) {
      return;
    }

    if (showBackside || cardIsFlipping) {
      hasBackside.current = true;
    }
  }, [cardIsFlipping, showBackside]);

  // @todo: https://linear.app/noice/issue/NOI-14908
  // Investigate why tooltip is not sometimes shown when bundle has been purchased
  const tooltipContent = useMemo(
    () =>
      cardIsRevealed && isNewStreamerCard ? (
        <div className={styles.streamerCardTooltip}>
          <span className={styles.streamerCardTooltipTitle}>Creator Card</span>
          <span className={styles.streamerCardTooltipBody}>
            +10% points for this season
          </span>
        </div>
      ) : cardIsRevealed && isOldStreamerCard ? (
        'Creator card shares progress with the standard card'
      ) : (
        ''
      ),
    [cardIsRevealed, isNewStreamerCard, isOldStreamerCard],
  );

  return (
    <div className={styles.storeItemGameCardRoot}>
      <StoreItemGameCardDuplicates
        amount={cardCount ?? 1}
        cardLevel={cardLevel}
        delay={hasBackside.current ? FLIP_TRANSITION_TIME : 0}
        isHidden={showBackside}
      />

      <Tooltip
        content={tooltipContent}
        distance={20}
        placement="top"
      >
        <div
          className={classNames(styles.storeItemGameCardFlippingRoot, {
            [styles.showBackside]: showBackside,
            [styles.cardIsFlipping]: cardIsFlipping,
            [styles.hasBackside]: hasBackside.current,
          })}
          style={
            {
              '--_game-card-flip-transition': `${FLIP_TRANSITION_TIME}ms`,
            } as CSSProperties
          }
        >
          <div className={classNames(cardClassName, styles.storeItemGameCardWrapper)}>
            <CardStack
              card={{
                ...card,
                activeStreamerCards:
                  card.activeStreamerCard && !isNewStreamerCard
                    ? [card.activeStreamerCard]
                    : [],
              }}
              showLevelUpVfx={!!card.activeStreamerCard}
              showStreamerCardOnTop
            />
          </div>

          {hasBackside.current && (
            <StoreItemGameCardBackside
              className={styles.storeItemGameCardBackside}
              hasGlow
              onClick={onReveal}
            />
          )}
        </div>
      </Tooltip>
    </div>
  );
}
