import { gql } from '@apollo/client';
import { Fragment } from 'react';

import { StoreCardBundleCategory } from '../../StoreCardBundleCategory';
import { StoreCurrencyPackCategory } from '../../StoreCurrencyPackCategory';
import { StoreFrontBreakLine } from '../../StoreFrontBreakLine';
import { StoreGameSelector } from '../../StoreGameSelector';
import { StoreNewSeasonBanner } from '../../StoreNewSeasonBanner';
import { StoreSectionHeader } from '../../StoreSectionHeader';
import { showNewSeasonBannerForUser } from '../utils';

import styles from './PlatformStoreFrontCategories.module.css';

import { useScrollToElementByAnchorHash } from '@common/navigation';
import { useSelectedUIState } from '@context';
import {
  PlatformStoreFrontCategoriesCategoryFragment,
  PlatformStoreFrontCategoriesProfileFragment,
  StoreV2ItemType,
} from '@gen';

gql`
  fragment PlatformStoreFrontCategoriesCategory on StoreV2StoreFrontCategory {
    id
    itemType
    ...StoreCardBundleCategory
    ...StoreCurrencyPackCategory
    ...ShowNewSeasonBannerForUserCategory
  }

  fragment PlatformStoreFrontCategoriesProfile on ProfileProfile {
    userId
    playedGames {
      id
      userId
      game {
        id
        ...StoreGameSelectorGame
        ...StoreNewSeasonBannerGame
      }
    }
    ...ShowNewSeasonBannerForUserProfile
  }
`;

interface Props {
  categories: PlatformStoreFrontCategoriesCategoryFragment[];
  profile: PlatformStoreFrontCategoriesProfileFragment;
  loadingNewBundles: boolean;
}

export function PlatformStoreFrontCategories({
  categories,
  profile,
  loadingNewBundles,
}: Props) {
  useScrollToElementByAnchorHash();
  const { selectedGameId } = useSelectedUIState();

  const gameSelectorGames = profile.playedGames?.map(({ game }) => game) ?? [];

  const showNewSeasonBanner = showNewSeasonBannerForUser({
    selectedGameId,
    profile,
    categories,
  });

  const currentGame = gameSelectorGames.find((game) => game.id === selectedGameId);

  return (
    <>
      {categories.map((category) => {
        const { itemType } = category;

        if (itemType === StoreV2ItemType.ItemTypeCurrencyPack) {
          return (
            <StoreCurrencyPackCategory
              currencyStoreCategory={category}
              key={category.id}
            />
          );
        }

        if (itemType === StoreV2ItemType.ItemTypeStandardCardBundle) {
          return (
            <Fragment key={category.id}>
              <section className={styles.cardBundleSection}>
                <StoreSectionHeader
                  color="green-main"
                  id="standard-card-bundle"
                  infoText="You can preview bundles before purchasing"
                  title="Standard Card Bundles"
                />

                <StoreGameSelector games={gameSelectorGames} />

                {showNewSeasonBanner ? (
                  currentGame && (
                    <StoreNewSeasonBanner
                      game={currentGame}
                      key={category.id}
                    />
                  )
                ) : loadingNewBundles ? (
                  <StoreCardBundleCategory.Loading />
                ) : (
                  <StoreCardBundleCategory storeCategory={category} />
                )}
              </section>

              <StoreFrontBreakLine />
            </Fragment>
          );
        }

        if (itemType === StoreV2ItemType.ItemTypePremiumCardBundle) {
          return (
            <section
              className={styles.cardBundleSection}
              key={category.id}
            >
              <StoreSectionHeader
                color="magenta-main"
                infoText="You can preview bundles before purchasing"
                title="Premium Card Bundles"
              />

              <StoreGameSelector games={gameSelectorGames} />

              {loadingNewBundles ? (
                <StoreCardBundleCategory.Loading />
              ) : (
                <StoreCardBundleCategory storeCategory={category} />
              )}
            </section>
          );
        }
      })}
    </>
  );
}

PlatformStoreFrontCategories.Loading = () => {
  return (
    <section className={styles.cardBundleSection}>
      <StoreSectionHeader
        color="green-main"
        infoText="You can preview bundles before purchasing"
        title="Standard Card Bundles"
      />

      <StoreGameSelector.Loading />

      <StoreCardBundleCategory.Loading />
    </section>
  );
};
