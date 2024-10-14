import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppLocalStorage } from '@common/localstorage';
import {
  UseEndSeasonEndDialogsProfileFragment,
  UseSeasonEndDialogsSeasonFragment,
  useUseSeasonEndDialogsSeasonsLazyQuery,
} from '@gen';

gql`
  query UseSeasonEndDialogsSeasons($seasonIds: [String!]) {
    seasons(ids: $seasonIds) {
      seasons {
        id
        ...UseSeasonEndDialogsSeason
      }
    }
  }

  fragment UseEndSeasonEndDialogsProfile on ProfileProfile {
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

  fragment UseSeasonEndDialogsSeason on GameSeason {
    id
    gameId
  }
`;

interface HookResult {
  season: Nullable<UseSeasonEndDialogsSeasonFragment>;
  onClose(): void;
}

interface Props {
  profile: Nullable<UseEndSeasonEndDialogsProfileFragment>;
}

export function useSeasonEndSeasons({ profile }: Props): HookResult {
  const { hasRole } = useAuthenticatedUser();
  const localStorage = useAppLocalStorage();
  const [season, setSeason] = useState<Nullable<UseSeasonEndDialogsSeasonFragment>>(null);
  const seasonEndsNotSeen = useRef<Nullable<UseSeasonEndDialogsSeasonFragment[]>>(null);
  const seenSeasonEndsData = useRef<Nullable<UseSeasonEndDialogsSeasonFragment[]>>(null);
  const [fetchSeasons] = useUseSeasonEndDialogsSeasonsLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!profile || hasRole('bot')) {
      return;
    }

    const onProfileData = async () => {
      // Check for which users playedGames a season has changed.
      const gamesWithChangedSeason = profile?.playedGames.filter(
        (game) => game.seasonId !== game.game.activeSeasonId,
      );

      // If no games with changed seasons are found, return early.
      if (!gamesWithChangedSeason?.length) {
        return;
      }

      // When profile data has been fetched, fetch data for the seasons the
      // user has already seen seasons ends for.
      const seasonEndsSeenIds = localStorage.GetValue('season.seasonEndSeen');
      const { data: seasonsData } = seasonEndsSeenIds
        ? await fetchSeasons({
            variables: { seasonIds: seasonEndsSeenIds },
          })
        : { data: null };

      seenSeasonEndsData.current = seasonsData?.seasons?.seasons ?? null;

      // From the games with changed seasons, filter out the games for which
      // last season they played in, user has already seen a season end for. Then
      // map them to an array of seasons for which we need to show the season end
      // dialog.
      seasonEndsNotSeen.current =
        gamesWithChangedSeason
          ?.filter(
            (game) =>
              !seenSeasonEndsData.current?.find(
                (season) => season.gameId === game.id && season.id === game.seasonId,
              ),
          )
          .map<UseSeasonEndDialogsSeasonFragment>((game) => {
            return {
              id: game.seasonId,
              gameId: game.id,
            };
          }) ?? null;

      setSeason(seasonEndsNotSeen.current?.shift() ?? null);
    };

    onProfileData();
  }, [fetchSeasons, hasRole, localStorage, profile, profile?.playedGames]);

  const handleDialogClose = useCallback(() => {
    seenSeasonEndsData.current =
      seenSeasonEndsData.current?.filter(
        (existingSeason) => existingSeason.gameId !== season?.gameId,
      ) ?? [];

    season && seenSeasonEndsData.current?.push(season);

    const seasonEndsSeenIds =
      seenSeasonEndsData.current?.map((season) => season.id) ?? null;
    localStorage.SetValue('season.seasonEndSeen', seasonEndsSeenIds);

    const nextSeason = seasonEndsNotSeen.current?.shift() ?? null;

    setSeason(nextSeason);
  }, [season, localStorage]);

  return { season, onClose: handleDialogClose };
}
