import { gql } from '@apollo/client';
import { FaHeart, FaInfoCircle } from 'react-icons/fa';
import { useLocation, useSearchParams } from 'react-router-dom';

import { StoreCardBundleCategory } from '../../StoreCardBundleCategory/StoreCardBundleCategory';
import { StoreGameSelector } from '../../StoreGameSelector/StoreGameSelector';
import { StorePlatformStoreCategory } from '../../StorePlatformStoreCategory';
import { StoreSectionHeader } from '../../StoreSectionHeader/StoreSectionHeader';
import { getCategorySearchParamString } from '../../utils';

import styles from './ChannelStoreFrontCategories.module.css';
import { ChannelStoreFrontCategoriesContent } from './ChannelStoreFrontCategoriesContent/ChannelStoreFrontCategoriesContent';
import { ChannelStoreFrontCosmetics } from './ChannelStoreFrontCategoriesContent/ChannelStoreFrontCosmetics/ChannelStoreFrontCosmetics';

import { useScrollToElementByElementId } from '@common/navigation';
import { Routes, CHANNEL_STORE_ANCHOR } from '@common/route';
import { useStoreFrontRefetch } from '@common/store-front-category/context';
import {
  ChannelStoreFrontCategoriesCategoryFragment,
  ChannelStoreFrontChannelFragment,
  ChannelStoreFrontProfileFragment,
  StoreV2ItemType,
} from '@gen';

gql`
  fragment ChannelStoreFrontCategoriesCategory on StoreV2StoreFrontCategory {
    itemType
    ...ChannelStoreFrontCategoriesContentCategory
  }

  fragment ChannelStoreFrontChannel on ChannelChannel {
    logo
    offlineBanner
    ...ChannelStoreFrontCategoriesContentChannel
  }

  fragment ChannelStoreFrontProfile on ProfileProfile {
    ...ChannelStoreFrontCategoriesContentProfile
  }
`;

interface Props {
  categories: ChannelStoreFrontCategoriesCategoryFragment[];
  loadingNewBundles: boolean;
  channel: ChannelStoreFrontChannelFragment;
  profile: ChannelStoreFrontProfileFragment;
  /** @default h2 */
  headingLevel?: 'h2' | 'h3';
}

export function ChannelStoreFrontCategories({
  categories,
  loadingNewBundles,
  channel,
  profile,
  headingLevel,
}: Props) {
  const { hash } = useLocation();
  const { refetchStoreFrontCategories } = useStoreFrontRefetch();

  useScrollToElementByElementId(
    CHANNEL_STORE_ANCHOR,
    hash !== `#${CHANNEL_STORE_ANCHOR}`,
  );

  const [searchParams] = useSearchParams();

  const hasCreatorCards = !!categories.find(
    ({ itemType }) => itemType === StoreV2ItemType.ItemTypeStreamerCard,
  )?.sellableItems.length;

  const cardSectionHeader = hasCreatorCards ? (
    <StoreSectionHeader
      color="magenta-main"
      headingLevel={headingLevel}
      infoTextIcon={FaHeart}
      title="Creator cards & card bundles"
    />
  ) : (
    <StoreSectionHeader
      color="magenta-main"
      headingLevel={headingLevel}
      infoTextIcon={FaInfoCircle}
      title="Card bundles"
    />
  );

  const hasAvailableCosmetics = !!categories.find(
    (category) => category.itemType === StoreV2ItemType.ItemTypeAvatarPart,
  )?.sellableItems.length;

  return (
    <section className={styles.sectionContainer}>
      {hasAvailableCosmetics && (
        <>
          <ChannelStoreFrontCosmetics
            categories={categories}
            channel={channel}
            headingLevel={headingLevel}
            refetchStoreFrontCategories={refetchStoreFrontCategories}
          />

          <hr className={styles.separator} />
        </>
      )}

      {cardSectionHeader}

      <ChannelStoreFrontCategoriesContent
        categories={categories}
        channel={channel}
        loadingNewBundles={loadingNewBundles}
        profile={profile}
      />

      <hr className={styles.separator} />

      <StoreSectionHeader
        linkTo={`${Routes.Store}?${getCategorySearchParamString(searchParams)}`}
        title="Available in the Noice store"
        hideBorder
      />

      <StorePlatformStoreCategory />
    </section>
  );
}

ChannelStoreFrontCategories.Loading = () => {
  return (
    <section className={styles.sectionContainer}>
      <StoreSectionHeader
        color="magenta-main"
        title="Creator cosmetics"
      />

      <ChannelStoreFrontCosmetics.Loading />

      <StoreSectionHeader
        color="magenta-main"
        infoText="You can preview bundles before purchasing"
        title="Creator cards & card bundles"
      />

      <StoreGameSelector.Loading />

      <StoreCardBundleCategory.Loading />
    </section>
  );
};
