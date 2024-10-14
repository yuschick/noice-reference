import { gql } from '@apollo/client';

import { StoreFrontRefetchProvider } from '../context';

import { ChannelStoreFrontCategories } from './ChannelStoreFrontCategories/ChannelStoreFrontCategories';
import { useStoreFrontCategoriesAnalytics } from './hooks/useStoreFrontCategoriesAnalytics.hook';
import { PlatformStoreFrontCategories } from './PlatformStoreFrontCategories/PlatformStoreFrontCategories';

import {
  StoreFrontCategoriesCategoryFragment,
  StoreFrontCategoriesChannelFragment,
  StoreFrontCategoryProfileFragment,
} from '@gen';

gql`
  fragment StoreFrontCategoriesCategory on StoreV2StoreFrontCategory {
    id
    itemType
    ...PlatformStoreFrontCategoriesCategory
    ...ChannelStoreFrontCategoriesCategory
    ...StoreFrontCategoriesAnalyticsCategory
  }

  fragment StoreFrontCategoriesChannel on ChannelChannel {
    id
    ...ChannelStoreFrontChannel
  }

  fragment StoreFrontCategoryProfile on ProfileProfile {
    ...ChannelStoreFrontProfile
    ...PlatformStoreFrontCategoriesProfile
  }
`;

interface Props {
  storeFrontCategories: StoreFrontCategoriesCategoryFragment[];
  channel?: StoreFrontCategoriesChannelFragment;
  profile: StoreFrontCategoryProfileFragment;
  loadingNewBundles: boolean;
  /** @default h2 */
  headingLevel?: 'h2' | 'h3';
  refetchStoreFrontCategories(): void;
}

export function StoreFrontCategories({
  storeFrontCategories,
  channel,
  profile,
  loadingNewBundles,
  refetchStoreFrontCategories,
  headingLevel,
}: Props) {
  useStoreFrontCategoriesAnalytics({
    categories: storeFrontCategories,
    channelId: channel?.id,
  });

  if (!storeFrontCategories.length) {
    return null;
  }

  return (
    <StoreFrontRefetchProvider refetchStoreFrontCategories={refetchStoreFrontCategories}>
      {channel ? (
        <ChannelStoreFrontCategories
          categories={storeFrontCategories}
          channel={channel}
          headingLevel={headingLevel}
          loadingNewBundles={loadingNewBundles}
          profile={profile}
        />
      ) : (
        <PlatformStoreFrontCategories
          categories={storeFrontCategories}
          loadingNewBundles={loadingNewBundles}
          profile={profile}
        />
      )}
    </StoreFrontRefetchProvider>
  );
}

StoreFrontCategories.Loading = ({
  isChannelFrontCategory,
}: {
  isChannelFrontCategory?: boolean;
}) => {
  if (isChannelFrontCategory) {
    return <ChannelStoreFrontCategories.Loading />;
  }

  return <PlatformStoreFrontCategories.Loading />;
};
