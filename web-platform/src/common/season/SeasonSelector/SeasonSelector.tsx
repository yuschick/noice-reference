import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Icon,
  Image,
  LoadingSkeleton,
  PopoverMenu,
  useAuthenticatedUser,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import styles from './SeasonSelector.module.css';

import {
  GameSeasonSelectorSeasonFragment,
  useGameSeasonSelectorProgressionQuery,
} from '@gen';

gql`
  fragment GameSeasonSelectorSeason on GameSeason {
    id
    name
    badgeUrl
    gameId
    startTime
    endTime
  }

  query GameSeasonSelectorProgression($userId: ID!, $gameId: ID!) {
    listSeasonProgression(userId: $userId) {
      progression {
        season {
          ...GameSeasonSelectorSeason

          game {
            id
            activeSeason {
              id
            }
          }
        }
      }
    }

    game(id: $gameId) {
      id
      activeSeason {
        ...GameSeasonSelectorSeason
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
  seasonId: Nullable<string>;
  showSeasonEndTime?: boolean;
  onSelectSeason(seasonId: string): void;
}

export function SeasonSelector({
  gameId,
  seasonId,
  onSelectSeason,
  showSeasonEndTime,
}: Props) {
  const { userId } = useAuthenticatedUser();
  const [seasons, setSeasons] =
    useState<Nullable<GameSeasonSelectorSeasonFragment[]>>(null);

  const { loading: progressionDataLoading } = useGameSeasonSelectorProgressionQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { userId, gameId: gameId! },
    skip: !gameId,
    fetchPolicy: 'cache-and-network',
    onCompleted({ listSeasonProgression, game }) {
      const seasons: Nullable<GameSeasonSelectorSeasonFragment[]> =
        listSeasonProgression?.progression
          .filter(
            ({ season }) =>
              season.gameId === gameId && season.game.activeSeason.id !== season.id,
          )
          .map(({ season }) => season)
          .sort(
            (seasonA, seasonB) =>
              new Date(seasonA.startTime).getTime() -
              new Date(seasonB.startTime).getTime(),
          ) ?? null;

      if (game) {
        seasons?.push(game.activeSeason);
      }

      setSeasons(seasons);
    },
  });

  const store = usePopoverMenu({
    initialState: 'closed',
    placement: 'bottom-start',
  });

  const handleSeasonSelectFunc = useCallback(
    (seasonId: string) => {
      onSelectSeason(seasonId);
    },
    [onSelectSeason],
  );

  if (progressionDataLoading) {
    return (
      <LoadingSkeleton
        height={40}
        width={200}
      />
    );
  }

  let selectedSeason = seasons?.find((season) => season.id === seasonId) ?? null;

  if (!selectedSeason) {
    selectedSeason = seasons?.length ? seasons[0] : null;
  }

  if (!selectedSeason) {
    return null;
  }

  const selectedSeasonHasEnded =
    new Date(selectedSeason.endTime).getTime() < new Date().getTime();

  return (
    <>
      {!!seasons && (
        <PopoverMenu store={store}>
          <PopoverMenu.Section>
            {seasons.map((season) => {
              return (
                <PopoverMenu.Button
                  aria-current={selectedSeason?.name === season.name}
                  iconEnd={
                    selectedSeason?.name === season.name
                      ? CoreAssets.Icons.Check
                      : undefined
                  }
                  key={season.id}
                  title={season.name}
                  onClick={() => handleSeasonSelectFunc(season.id)}
                >
                  <div className={styles.seasonSelectorButtonContentWrapper}>
                    <Image
                      className={styles.seasonBadgeSmall}
                      height={24}
                      sizes="1.5rem"
                      src={season.badgeUrl}
                      width={24}
                    />
                    <div className={styles.seasonSelectorName}>{season.name}</div>
                  </div>
                </PopoverMenu.Button>
              );
            })}
          </PopoverMenu.Section>
        </PopoverMenu>
      )}

      <button
        className={styles.seasonSelectorWrapper}
        ref={store.state.popoverMenuTriggerRef}
        onClick={store.actions.toggle}
      >
        <Image
          alt={`${selectedSeason.name} badge`}
          className={styles.seasonBadge}
          height={40}
          sizes="2.5rem"
          src={selectedSeason.badgeUrl}
          width={40}
        />
        <div>
          <span className={styles.seasonText}>{selectedSeason.name}</span>
          {showSeasonEndTime && (
            <>
              {selectedSeasonHasEnded ? (
                <span className={styles.seasonEndTimer}>Ended</span>
              ) : (
                <time
                  className={styles.seasonEndTimer}
                  dateTime={DateAndTimeUtils.getHTMLAttributeTimeRelative(
                    selectedSeason.endTime,
                  )}
                >
                  Ends in{' '}
                  {DateAndTimeUtils.getFullRelativeTime(selectedSeason.endTime, {
                    days: true,
                    hours: true,
                    fallbackToMoreGranularTime: true,
                  })}
                </time>
              )}
            </>
          )}
        </div>
        <Icon
          color="text-light-secondary"
          icon={CoreAssets.Icons.ChevronDown}
          size={20}
        />
      </button>
    </>
  );
}
