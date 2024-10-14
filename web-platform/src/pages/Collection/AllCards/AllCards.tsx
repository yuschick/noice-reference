import { LoadingSpinner } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { EmptyState } from '../EmptyState/EmptyState';
import { useCollectionChannelId } from '../hooks/useCollectionChannelId.hook';
import { useCollectionItemId } from '../hooks/useCollectionItemId.hook';
import { useCollectionSeasonId } from '../hooks/useCollectionSeasonId.hook';

import styles from './AllCards.module.css';
import { CardGrid } from './CardGrid/CardGrid';
import { CardModal } from './CardModal/CardModal';
import { CardsUnlockedCount } from './CardsUnlockedCount/CardsUnlockedCount';
import { useBaseCards } from './hooks/useBaseCards.hook';

import { SeasonSelector } from '@common/season';

interface Props {
  gameId: Nullable<string>;
}

export function AllCards({ gameId }: Props) {
  const {
    seasonId,
    actions: { setSeasonId },
  } = useCollectionSeasonId({ gameId });

  const {
    itemId,
    actions: { setItemId },
  } = useCollectionItemId();

  const {
    channelId,
    actions: { setChannelId },
  } = useCollectionChannelId({ gameId });

  const { cards, loading: loadingGameCards } = useBaseCards({ gameId, seasonId });

  const selectedCard =
    [
      ...cards.unlockedCards,
      ...cards.uncollectedCards,
      ...cards.lockedCards.map((card) => card.card),
    ].find((card) => card.id.split('|')[0] === itemId) ?? null;

  const isSelectedCardLocked = !!cards.lockedCards.find(
    (card) => card.card.id === selectedCard?.id,
  );

  const handleSelectCard = (cardId: string, channelId: Nullable<string>) => {
    setItemId(cardId);
    setChannelId(channelId);
  };

  return (
    <>
      <div className={styles.onTopOfCardGrid}>
        <SeasonSelector
          gameId={gameId}
          seasonId={seasonId}
          onSelectSeason={setSeasonId}
        />

        <CardsUnlockedCount
          className={styles.cardsUnlockedCount}
          gameId={gameId}
          seasonId={seasonId}
        />
      </div>

      {loadingGameCards ? (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {!cards?.unlockedCards.length ? (
            <EmptyState text="You haven't yet unlocked any cards this season, play a card in a match to unlock the starter cards." />
          ) : (
            <CardGrid
              lockedCards={cards?.lockedCards ?? null}
              uncollectedCards={cards?.uncollectedCards ?? null}
              unlockedCards={cards?.unlockedCards ?? null}
              onSelectCard={handleSelectCard}
            />
          )}
        </>
      )}

      {!!selectedCard && (
        <CardModal
          card={selectedCard}
          channelId={channelId}
          isCardOwned={!isSelectedCardLocked}
          onCloseModal={() => setItemId(null)}
          onSelectChannel={setChannelId}
        />
      )}
    </>
  );
}
