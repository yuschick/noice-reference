import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useConditionalOnce } from '@noice-com/common-react-core';
import { AuthenticatedUserProvider, useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { Helmet } from 'react-helmet-async';

import { emitEmbeddedPageLoaded, isReactNativeWebView } from '../../embeds/bridge';

import { EmptyState } from './EmptyState/EmptyState';
import { usePlatformStoreRedirect, useStoreTracking } from './hooks';
import { RewardedVideoBanner } from './RewardedVideoBanner';
import styles from './Store.module.css';
import { StoreChannelSection } from './StoreChannelSection/StoreChannelSection';

import { StoreFrontCategories, StoreFrontBreakLine } from '@common/store-front-category';
import { useStreamGame } from '@common/stream';
import {
  StoreChannelListChannelFragment,
  StoreV2ItemType,
  useStorePageCurrentChannelQuery,
  useStorePageStoreFrontQuery,
  useStorePageUserDataQuery,
} from '@gen';

gql`
  query StorePageStoreFront($gameID: ID!) {
    platformStoreFront(gameId: $gameID) {
      id
      gameId
      categories {
        id
        ...StoreFrontCategoriesCategory
      }
    }
  }

  query StorePageUserData($userId: ID!) {
    followedChannels(userId: $userId) {
      channels {
        id
        ...StoreChannelListChannel
      }
    }

    profile(userId: $userId) {
      userId
      ...StoreFrontCategoryProfile
    }
  }

  query StorePageCurrentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...StoreChannelListChannel
    }
  }
`;

const getStoreChannels = (
  followedChannels: StoreChannelListChannelFragment[],
  currentChannel: Nullable<StoreChannelListChannelFragment>,
) => {
  if (!currentChannel) {
    return followedChannels;
  }

  // Show the current channel always first
  return [
    currentChannel,
    ...followedChannels.filter((channel) => channel.id !== currentChannel.id),
  ];
};

export function Store() {
  const { channelId } = useStreamGame();
  const storeGameId = usePlatformStoreRedirect();
  const { userId } = useAuthentication();
  const isEmbedded = isReactNativeWebView();

  useStoreTracking();

  const {
    data: storeFrontData,
    loading: storeFrontDataLoading,
    previousData: storeFrontPreviousData,
    refetch,
  } = useStorePageStoreFrontQuery({
    ...variablesOrSkip({ gameID: storeGameId }),
  });

  const { data: userData, loading: userDataLoading } = useStorePageUserDataQuery({
    ...variablesOrSkip({ userId }),
  });

  const { data: currentChannelData } = useStorePageCurrentChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  const storeChannels = getStoreChannels(
    userData?.followedChannels?.channels ?? [],
    currentChannelData?.channel ?? null,
  ).filter((ch) => ch.monetizationSettings.enabled);

  const loadingStoreFrontCategories =
    storeFrontDataLoading &&
    !storeFrontPreviousData?.platformStoreFront?.categories?.length;
  const hasNoContent =
    !storeFrontDataLoading && !storeFrontData?.platformStoreFront?.categories?.length;

  const filteredStoreFrontCategories =
    storeFrontData?.platformStoreFront?.categories?.filter((category) => {
      // Normally we show all categories
      if (!isEmbedded) {
        return true;
      }

      // @todo, in the future we might want to either remove this filter or change
      // which categories are shown in embedded views.
      return category.itemType === StoreV2ItemType.ItemTypeStandardCardBundle;
    }) ?? [];

  useConditionalOnce(() => {
    emitEmbeddedPageLoaded();
  }, isEmbedded && !loadingStoreFrontCategories);

  return (
    <section
      className={styles.section}
      data-ftue-anchor="storeView"
    >
      <Helmet>
        <title>Store</title>
      </Helmet>

      {!isEmbedded && <h1 className={styles.title}>Store</h1>}

      {!isEmbedded && !!userId && (
        <AuthenticatedUserProvider userId={userId}>
          <RewardedVideoBanner />
        </AuthenticatedUserProvider>
      )}

      {loadingStoreFrontCategories ? (
        <StoreFrontCategories.Loading />
      ) : (
        <>
          {hasNoContent || !userData?.profile ? (
            <EmptyState text="Play a card in a game to see your store" />
          ) : (
            <>
              {!isEmbedded && (
                <>
                  <StoreChannelSection
                    channels={storeChannels}
                    loading={userDataLoading}
                  />

                  <StoreFrontBreakLine />
                </>
              )}

              <StoreFrontCategories
                loadingNewBundles={storeFrontDataLoading}
                profile={userData?.profile}
                refetchStoreFrontCategories={refetch}
                storeFrontCategories={filteredStoreFrontCategories}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}
