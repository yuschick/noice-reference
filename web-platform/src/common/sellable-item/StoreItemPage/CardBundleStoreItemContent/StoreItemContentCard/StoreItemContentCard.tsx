import classNames from 'classnames';
import { CSSProperties } from 'react';

import { StoreItemGameCard } from '../../../StoreItemGameCard';

import styles from './StoreItemContentCard.module.css';

import { StoreItemContentCardItemRefFragment } from '@gen';

interface Props {
  item: StoreItemContentCardItemRefFragment;
  index: number;
}

const getItemCards = (item: StoreItemContentCardItemRefFragment) => {
  if (item.item.details?.__typename === 'GameLogicStreamerCard') {
    return {
      gameCard: item.item.details.baseCard,
      streamerCard: item.item.details,
    };
  }

  if (item?.inventoryState?.item?.details?.__typename === 'GameLogicCard') {
    return {
      gameCard: item.inventoryState.item.details,
      streamerCard: undefined,
    };
  }

  return {
    gameCard: undefined,
    streamerCard: undefined,
  };
};

export function StoreItemContentCard({ item, index }: Props) {
  const { inventoryState, count } = item;
  const { gameCard, streamerCard } = getItemCards(item);

  if (!gameCard) {
    return null;
  }
  const indexNumber = index;
  const inventoryCard =
    inventoryState?.item.details?.__typename === 'GameLogicCard'
      ? inventoryState?.item.details
      : inventoryState?.item.details?.__typename === 'GameLogicStreamerCard'
      ? inventoryState?.item.details.baseCard
      : undefined;

  const currentValue = inventoryCard?.leveling.progressToNextLevel || 0;
  const limit = inventoryCard?.leveling.nextLevelLimit || 9999;
  const nextValue = currentValue + count;
  const isUpgraded = nextValue >= limit;
  const isNewStreamerCard = !!streamerCard && !inventoryCard;
  const isOldStreamerCard = !!streamerCard && !isNewStreamerCard;

  return (
    <div
      className={classNames(styles.wrapper, { [styles.streamerCard]: !!streamerCard })}
      style={
        {
          '--store-item-content-card-slide-animation-delay': `${
            100 + indexNumber * 90
          }ms`,
        } as CSSProperties
      }
    >
      <div className={styles.cardV3}>
        <StoreItemGameCard
          card={{ ...gameCard, activeStreamerCard: streamerCard }}
          cardCount={item.count}
          isNewStreamerCard={isNewStreamerCard}
          isOldStreamerCard={isOldStreamerCard}
          cardIsRevealed
        />
      </div>

      <div className={classNames(styles.progressWrapper, styles.preview)}>
        {isNewStreamerCard ? (
          <div className={styles.upgradeInfo}>
            <span className={styles.levelUpLabel}>New</span>
            <span>Creator Card</span>
          </div>
        ) : (
          <div className={styles.progressDisplay}>
            {isUpgraded && (
              <div className={styles.upgradeInfo}>
                <span className={styles.levelUpLabel}>Level up</span>
                <span>on purchase</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
