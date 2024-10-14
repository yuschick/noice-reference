import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import {
  ShowNewSeasonBannerForUserCategoryFragment,
  ShowNewSeasonBannerForUserProfileFragment,
  StoreV2ItemType,
} from '@gen';

gql`
  fragment ShowNewSeasonBannerForUserProfile on ProfileProfile {
    playedGames {
      id
      userId
      seasonId
      game {
        id
        activeSeasonId
      }
    }
  }

  fragment ShowNewSeasonBannerForUserCategory on StoreV2StoreFrontCategory {
    itemType
    sellableItems {
      id
    }
  }
`;

interface Options {
  selectedGameId: Nullable<string>;
  profile: ShowNewSeasonBannerForUserProfileFragment;
  categories: ShowNewSeasonBannerForUserCategoryFragment[];
}

export const showNewSeasonBannerForUser = ({
  selectedGameId,
  profile,
  categories,
}: Options) => {
  if (!selectedGameId) {
    return true;
  }

  const playedGame = profile?.playedGames.find((g) => g.id === selectedGameId);

  // If user has not played the game, show the banner
  if (!playedGame) {
    return true;
  }

  // Check if there is card bundles to show for the game
  const hasCardBundlesToShow = categories.some(({ itemType }) =>
    [
      StoreV2ItemType.ItemTypePremiumCardBundle,
      StoreV2ItemType.ItemTypeStandardCardBundle,
    ].includes(itemType),
  );

  // If there is card bundles to show, don't show the banner
  if (hasCardBundlesToShow) {
    return false;
  }

  // If the user has not played the latest season, show the banner
  return playedGame.game?.activeSeasonId !== playedGame.seasonId;
};
