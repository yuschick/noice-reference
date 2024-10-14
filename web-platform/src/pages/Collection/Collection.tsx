import { gql } from '@apollo/client';
import { useConditionalOnce } from '@noice-com/common-react-core';
import { LoadingSpinner, useAuthenticatedUser } from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';

import { emitEmbeddedPageLoaded, isReactNativeWebView } from '../../embeds/bridge';

import { AllCards } from './AllCards/AllCards';
import { ChannelSelector } from './ChannelSelector/ChannelSelector';
import styles from './Collection.module.css';
import { CreatorCards } from './CreatorCards/CreatorCards';
import { EmptyState } from './EmptyState/EmptyState';
import { GameSelector } from './GameSelector/GameSelector';
import { useCollectionChannelId } from './hooks/useCollectionChannelId.hook';
import { useCollectionGameId } from './hooks/useCollectionGameId.hook';

import BackgroundImage1000Avif from '@assets/images/collection/noice-collection-bg-1000.avif';
import BackgroundImage1000WebP from '@assets/images/collection/noice-collection-bg-1000.webp';
import BackgroundImage1500Avif from '@assets/images/collection/noice-collection-bg-1500.avif';
import BackgroundImage1500WebP from '@assets/images/collection/noice-collection-bg-1500.webp';
import { PageBackgroundImage } from '@common/page';
import { SeasonBreakInfo } from '@common/season';
import { ItemItemType, useCollectionPageDataQuery } from '@gen';

gql`
  query CollectionPageData(
    $userId: ID!
    $inventoryFilters: [InventoryListUserInventoryRequestFilterInput!]
  ) {
    inventory(userId: $userId, filters: $inventoryFilters) {
      items {
        itemId
        itemCount
        item {
          id
        }
      }
    }

    profile(userId: $userId) {
      userId
      playedGames {
        userId
        id
        game {
          id
        }
      }
    }
  }
`;

export function Collection() {
  const { userId } = useAuthenticatedUser();
  const { gameId, loading: gameIdLoading } = useCollectionGameId();
  const {
    channelId,
    actions: { setChannelId },
  } = useCollectionChannelId({ gameId });
  const isEmbedded = isReactNativeWebView();

  const { data: collectionPageData, loading: loadingCollectionData } =
    useCollectionPageDataQuery({
      variables: {
        userId,
        inventoryFilters: [{ gameId }, { itemType: ItemItemType.TypeStreamerCard }],
      },
      fetchPolicy: 'cache-and-network',
      skip: !gameId,
    });

  const hasPlayedGame =
    !!gameId &&
    !!collectionPageData?.profile?.playedGames.find((game) => game.game.id === gameId);

  const hasCreatorCardsForGame =
    !!gameId && !!collectionPageData?.inventory?.items.find((item) => item.itemCount > 0);

  useConditionalOnce(() => {
    emitEmbeddedPageLoaded();
  }, isEmbedded && !gameIdLoading && !loadingCollectionData);

  return (
    <>
      <PageBackgroundImage
        sources={[
          {
            srcSet: `${BackgroundImage1000Avif} 1000w, ${BackgroundImage1500Avif} 1500w`,
          },
          {
            srcSet: `${BackgroundImage1000WebP} 1000w, ${BackgroundImage1500WebP} 1500w`,
          },
        ]}
        src={BackgroundImage1000Avif}
      />

      <section className={styles.wrapper}>
        <Helmet>
          <title>Collection</title>
        </Helmet>

        {!isEmbedded && <h1 className={styles.header}>Collection</h1>}

        {gameIdLoading || loadingCollectionData ? (
          <div className={styles.loadingWrapper}>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {gameId && hasPlayedGame ? (
              <>
                <div className={styles.gameSelectorWrapper}>
                  <GameSelector gameId={gameId} />
                  <SeasonBreakInfo gameId={gameId} />
                </div>

                {hasCreatorCardsForGame && (
                  <ChannelSelector
                    channelId={channelId}
                    gameId={gameId}
                    onSelectChannel={setChannelId}
                  />
                )}

                {!channelId && <AllCards gameId={gameId} />}

                {!!channelId && (
                  <CreatorCards
                    channelId={channelId}
                    gameId={gameId}
                  />
                )}
              </>
            ) : (
              <EmptyState text="Play a card in a game to unlock your first set of cards" />
            )}
          </>
        )}
      </section>
    </>
  );
}
