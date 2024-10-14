import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, useAuthentication } from '@noice-com/common-ui';

import styles from './ChannelPageStoreSection.module.css';
import { useChannelStoreRedirect } from './hooks';

import { CHANNEL_STORE_ANCHOR } from '@common/route';
import { StoreFrontCategories } from '@common/store-front-category';
import {
  ChannelPageStoreSectionChannelFragment,
  useChannelStoreProfileQuery,
  useChannelStoreStoreFrontQuery,
} from '@gen';

gql`
  fragment ChannelPageStoreSectionChannel on ChannelChannel {
    id
    name
    monetizationSettings @skip(if: $skipAuthFields) {
      enabled
    }
    ...StoreFrontCategoriesChannel
    ...ChannelStoreRedirectChannel
  }

  query ChannelStoreStoreFront($gameID: ID, $channelId: ID!) {
    channelStoreFront(gameId: $gameID, channelId: $channelId) {
      id
      gameId
      categories {
        id
        itemType
        ...StoreFrontCategoriesCategory
      }
    }
  }

  query ChannelStoreProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...StoreFrontCategoryProfile
    }
  }
`;

interface Props {
  channel: ChannelPageStoreSectionChannelFragment;
}

export function ChannelPageStoreSection({ channel }: Props) {
  const { id, name, monetizationSettings } = channel;
  const isMonetizationEnabled = monetizationSettings?.enabled;

  const storeGameId = useChannelStoreRedirect({ channel });
  const { userId } = useAuthentication();

  const storeQueryArgs = variablesOrSkip({ gameID: storeGameId, channelId: id });
  const {
    data: storeFrontData,
    loading: storeFrontDataLoading,
    previousData: storeFrontPreviousData,
    refetch,
  } = useChannelStoreStoreFrontQuery({
    ...storeQueryArgs,
    variables: {
      gameID: storeGameId,
      channelId: id,
    },
    skip: !userId || !isMonetizationEnabled || storeQueryArgs.skip,
    fetchPolicy: 'cache-first',
  });

  const { data: profileData, loading: loadingProfile } = useChannelStoreProfileQuery({
    ...variablesOrSkip({ userId }),
  });

  if (
    !isMonetizationEnabled ||
    !profileData?.profile ||
    (!storeFrontData && !storeFrontDataLoading)
  ) {
    return <section id={CHANNEL_STORE_ANCHOR} />;
  }

  const loadingStoreFrontCategories =
    loadingProfile ||
    (storeFrontDataLoading &&
      !storeFrontPreviousData?.channelStoreFront?.categories?.length);

  return (
    <>
      <hr className={styles.divider} />

      <section id={CHANNEL_STORE_ANCHOR}>
        <div className={styles.channelStoreInfoWrapper}>
          <h2 className={styles.channelStoreTitle}>
            <Icon icon={CoreAssets.Icons.Shop} />
            Store
          </h2>

          <span>
            Show you support to <span className={styles.channelName}>{name}</span> by
            purchasing their creator merchandise.
          </span>
        </div>

        {loadingStoreFrontCategories ? (
          <StoreFrontCategories.Loading isChannelFrontCategory />
        ) : (
          <StoreFrontCategories
            channel={channel}
            headingLevel="h3"
            loadingNewBundles={storeFrontDataLoading}
            profile={profileData?.profile}
            refetchStoreFrontCategories={refetch}
            storeFrontCategories={
              storeFrontData?.channelStoreFront?.categories ??
              storeFrontPreviousData?.channelStoreFront?.categories ??
              []
            }
          />
        )}
      </section>
    </>
  );
}
