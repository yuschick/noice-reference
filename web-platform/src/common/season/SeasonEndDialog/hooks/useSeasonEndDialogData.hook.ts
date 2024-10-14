import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import {
  SeasonEndDialogInventoryFragment,
  SeasonEndDialogProfileFragment,
  SeasonEndDialogProfileStatsFragment,
  SeasonEndDialogSeasonFragment,
  useUseSeasonEndDialogWrapperMutatingQuery,
  useUseSeasonEndDialogWrapperProfileQuery,
} from '@gen';

gql`
  query UseSeasonEndDialogWrapperProfile($userId: ID, $seasonId: String) {
    profile(userId: $userId) {
      userId
      ...SeasonEndDialogProfile

      stats(season_id: $seasonId) {
        ...SeasonEndDialogProfileStats
      }
    }
  }

  query UseSeasonEndDialogWrapperMutating($userId: ID, $gameId: ID, $seasonId: ID) {
    inventory(
      userId: $userId
      filters: [
        { gameId: $gameId }
        { itemType: TYPE_GAME_CARD }
        { seasonId: $seasonId }
      ]
    ) {
      items {
        itemId
        ...SeasonEndDialogInventory
      }
    }

    season(id: $seasonId) {
      id
      ...SeasonEndDialogSeason
    }
  }
`;

interface Props {
  seasonId: Nullable<string>;
  gameId: Nullable<string>;
}

interface HookResult {
  profile: Nullable<SeasonEndDialogProfileFragment>;
  items: Nullable<SeasonEndDialogInventoryFragment[]>;
  season: Nullable<SeasonEndDialogSeasonFragment>;
  stats: Nullable<SeasonEndDialogProfileStatsFragment>;
  loading: boolean;
}

export function useSeasonEndDialogData({ seasonId, gameId }: Props): HookResult {
  const { userId } = useAuthenticatedUser();

  const { data: profileData, loading: profileDataLoading } =
    useUseSeasonEndDialogWrapperProfileQuery({
      variables: { userId, seasonId },
      skip: !userId || !seasonId,
    });

  const { data: mutatingData, loading: mutatingDataLoading } =
    useUseSeasonEndDialogWrapperMutatingQuery({
      variables: { gameId, seasonId, userId },
      skip: !gameId || !seasonId || !userId,
    });

  return {
    profile: profileData?.profile ?? null,
    items: mutatingData?.inventory?.items ?? null,
    season: mutatingData?.season ?? null,
    stats: profileData?.profile?.stats ?? null,
    loading: profileDataLoading || mutatingDataLoading,
  };
}
