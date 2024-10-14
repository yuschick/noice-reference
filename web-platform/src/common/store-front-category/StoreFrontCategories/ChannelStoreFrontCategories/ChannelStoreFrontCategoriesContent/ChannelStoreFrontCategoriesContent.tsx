import { gql } from '@apollo/client';
import { ButtonLink, useBooleanFeatureFlag } from '@noice-com/common-ui';
import { Fragment } from 'react';

import { StoreCardBundleCategory } from '../../../StoreCardBundleCategory';
import { StoreGameSelector } from '../../../StoreGameSelector';
import { StoreNewSeasonBanner } from '../../../StoreNewSeasonBanner';
import { StoreStreamerCardCategory } from '../../../StoreStreamerCardCategory';
import { showNewSeasonBannerForUser } from '../../utils';

import styles from './ChannelStoreFrontCategoriesContent.module.css';
import { ChannelStorePremiumBundlePrefix } from './ChannelStorePremiumBundlePrefix';

import { BROWSE_CHANNELS_PATH, Routes } from '@common/route';
import { useSelectedUIState } from '@context';
import {
  ChannelStoreFrontCategoriesContentCategoryFragment,
  ChannelStoreFrontCategoriesContentChannelFragment,
  ChannelStoreFrontCategoriesContentProfileFragment,
  StoreV2ItemType,
} from '@gen';

gql`
  fragment ChannelStoreFrontCategoriesContentCategory on StoreV2StoreFrontCategory {
    itemType
    ...StoreCardBundleCategory
    ...StoreStreamerCardCategory
    ...ShowNewSeasonBannerForUserCategory
    ...StoreChannelStoreAvatarPart
  }

  fragment ChannelStoreFrontCategoriesContentChannel on ChannelChannel {
    name
    streamedGames {
      id
      noicePredictionsEnabled
      ...StoreNewSeasonBannerGame
      ...StoreGameSelectorGame
    }
    ...StoreNewSeasonBannerChannel
    ...ChannelStorePremiumBundlePrefixChannel
  }

  fragment ChannelStoreFrontCategoriesContentProfile on ProfileProfile {
    playedGames {
      id
      userId
    }
    ...ShowNewSeasonBannerForUserProfile
  }
`;

interface Props {
  categories: ChannelStoreFrontCategoriesContentCategoryFragment[];
  loadingNewBundles: boolean;
  channel: ChannelStoreFrontCategoriesContentChannelFragment;
  profile: ChannelStoreFrontCategoriesContentProfileFragment;
}

const getEmptyStateGameList = (
  channelStreamedGames: ChannelStoreFrontCategoriesContentChannelFragment['streamedGames'],
) => {
  const gamesWithNoicePredictionsEnabled = channelStreamedGames?.filter(
    ({ noicePredictionsEnabled }) => !!noicePredictionsEnabled,
  );

  if (!gamesWithNoicePredictionsEnabled?.length) {
    return null;
  }

  // If there is only one game, we can just return the name
  if (gamesWithNoicePredictionsEnabled.length === 1) {
    return (
      <span className={styles.gameName}>
        {gamesWithNoicePredictionsEnabled[0].name} Creators
      </span>
    );
  }

  // If there are two or more games, we need to return a comma separated list
  return gamesWithNoicePredictionsEnabled.map(({ name, id }, index) => (
    <Fragment key={id}>
      {/* before the last item we need to add an 'and' */}
      {index === gamesWithNoicePredictionsEnabled.length - 1 && ' and '}

      <span className={styles.gameName}>{name} Creators</span>

      {/* after all but the last two items (the item before and after 'and') we need to add a comma */}
      {index < gamesWithNoicePredictionsEnabled.length - 2 && ', '}
    </Fragment>
  ));
};

export function ChannelStoreFrontCategoriesContent({
  categories,
  loadingNewBundles,
  channel,
  profile,
}: Props) {
  const { name: channelName, streamedGames: channelStreamedGames } = channel;
  const { selectedGameId } = useSelectedUIState();
  const [useNewBrowseLink] = useBooleanFeatureFlag('categoriesListing');

  const userHasPlayedAnyChannelGame = profile.playedGames.some(
    ({ id }) => channelStreamedGames?.some(({ id: gameId }) => id === gameId) ?? false,
  );

  if (!userHasPlayedAnyChannelGame) {
    return (
      <div className={styles.emptyStateWrapper}>
        <div className={styles.emptyStateContent}>
          <div className={styles.title}>
            <span className={styles.playTheStream}>Play the Stream</span> to access{' '}
            <span className={styles.channelName}>{channelName}’s</span> card bundles and
            creator cards.
          </div>

          <div className={styles.description}>
            {channelName}’s store has {getEmptyStateGameList(channelStreamedGames)} card
            bundles.
          </div>
        </div>

        <ButtonLink
          fit="content"
          level="secondary"
          size="sm"
          to={useNewBrowseLink ? BROWSE_CHANNELS_PATH : Routes.Browse}
        >
          Browse streams
        </ButtonLink>
      </div>
    );
  }

  const gameSelectorGames =
    channelStreamedGames?.filter(
      ({ noicePredictionsEnabled }) => !!noicePredictionsEnabled,
    ) ?? [];

  const showNewSeasonBanner = showNewSeasonBannerForUser({
    selectedGameId,
    profile,
    categories,
  });

  if (showNewSeasonBanner) {
    const currentGame = channelStreamedGames?.find(({ id }) => id === selectedGameId);

    return (
      <>
        <StoreGameSelector games={gameSelectorGames} />

        {currentGame && (
          <StoreNewSeasonBanner
            channel={channel}
            game={currentGame}
          />
        )}
      </>
    );
  }

  return (
    <>
      <StoreGameSelector games={gameSelectorGames} />

      {loadingNewBundles ? (
        <StoreCardBundleCategory.Loading />
      ) : (
        categories.map((category) => {
          const { itemType } = category;

          if (itemType === StoreV2ItemType.ItemTypeStreamerCard) {
            return (
              <StoreStreamerCardCategory
                category={categories[0]}
                key={categories[0].id}
              />
            );
          }

          if (itemType === StoreV2ItemType.ItemTypePremiumCardBundle) {
            return (
              <StoreCardBundleCategory
                channelName={channelName}
                key={category.id}
                slots={{ prefix: <ChannelStorePremiumBundlePrefix channel={channel} /> }}
                storeCategory={category}
              />
            );
          }
        })
      )}
    </>
  );
}
