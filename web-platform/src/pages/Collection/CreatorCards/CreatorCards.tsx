import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { ChannelLogo, LoadingSpinner } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { useCollectionItemId } from '../hooks/useCollectionItemId.hook';
import { useCollectionSeasonId } from '../hooks/useCollectionSeasonId.hook';

import { CreatorCardGrid } from './CreatorCardGrid/CreatorCardGrid';
import { CreatorCardModal } from './CreatorCardModal/CreatorCardModal';
import styles from './CreatorCards.module.css';
import { useCreatorCards } from './hooks/useCreatorCards.hook';

import { SeasonSelector } from '@common/season';
import { useCreatorCardsChannelQuery } from '@gen';

gql`
  query CreatorCardsChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      ...ChannelLogoChannel
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
  channelId: Nullable<string>;
}

export function CreatorCards({ gameId, channelId }: Props) {
  const {
    seasonId,
    actions: { setSeasonId },
  } = useCollectionSeasonId({ gameId });

  const {
    itemId,
    actions: { setItemId },
  } = useCollectionItemId();

  const {
    cards,
    loading: creatorCardsLoading,
    refetch: refetchCreatorCards,
  } = useCreatorCards({
    gameId,
    channelId,
    seasonId,
  });

  const { data: channelData } = useCreatorCardsChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  return (
    <>
      {creatorCardsLoading ? (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {!!channelData?.channel && (
            <div className={styles.inPlayWrapper}>
              <div className={styles.inPlayChannelWrapper}>
                <ChannelLogo
                  channel={channelData.channel}
                  size="lg"
                />
                <span className={styles.inPlayHeader}>In play</span>
                <span className={styles.channelText}>
                  On {channelData.channel.name}&apos;s channel
                </span>
              </div>
              <CreatorCardGrid
                cards={cards?.activeCards ?? null}
                ownedCards={cards?.ownedCards ?? null}
                onSelectCreatorCard={setItemId}
              />
            </div>
          )}

          <SeasonSelector
            gameId={gameId}
            seasonId={seasonId}
            onSelectSeason={setSeasonId}
          />

          <CreatorCardGrid
            cards={cards?.seasonCards ?? null}
            ownedCards={cards?.ownedCards ?? null}
            onSelectCreatorCard={setItemId}
          />
        </>
      )}

      {!!itemId && (
        <CreatorCardModal
          channelId={channelId}
          gameId={gameId}
          isCardOwned={cards?.ownedCards?.includes(itemId) ?? false}
          itemId={itemId}
          refetchCreatorCards={refetchCreatorCards}
          seasonId={seasonId}
          onCloseModal={() => setItemId(null)}
        />
      )}
    </>
  );
}
