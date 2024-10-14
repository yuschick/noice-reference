import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  SeasonRankBadge,
  LoadingSkeleton,
  useMediaQuery,
  CommonUtils,
} from '@noice-com/common-ui';

import styles from './SeasonsHeader.module.css';

import { SeasonSelector } from '@common/season';
import { useSelectedUIState } from '@context';
import { SeasonsHeaderProgressionFragment, useSeasonsHeaderGameQuery } from '@gen';

gql`
  query SeasonsHeaderGame($gameId: ID!) {
    game(id: $gameId) {
      id
      name
      activeSeasonId
    }
  }
`;

SeasonsHeader.fragments = {
  progression: gql`
    fragment SeasonsHeaderProgression on ProgressionSeasonProgression {
      level
    }
  `,
};

export function SeasonsHeader({ level }: SeasonsHeaderProgressionFragment) {
  // @todo Remove usages of useSelectedUIState in favor of "useDefaultGameId" and "useDefaultSeasonId"
  const { selectedGameId, selectedSeasonId, setSelectedSeason } = useSelectedUIState();
  const { data } = useSeasonsHeaderGameQuery({
    ...variablesOrSkip({ gameId: selectedGameId }),
  });

  const isFullView = useMediaQuery(`(min-width: ${CommonUtils.getRem(390)})`);

  return (
    <div className={styles.seasonsHeaderWrapper}>
      {data?.game && (
        <SeasonSelector
          gameId={data.game.id}
          seasonId={selectedSeasonId}
          showSeasonEndTime
          onSelectSeason={setSelectedSeason}
        />
      )}
      <div className={styles.seasonsBadgeWrapper}>
        <SeasonRankBadge
          rank={level}
          size={isFullView ? 'xl' : 'lg'}
        />
      </div>
    </div>
  );
}

SeasonsHeader.Loading = () => {
  return (
    <div className={styles.seasonsHeaderWrapper}>
      <LoadingSkeleton
        height={40}
        width={250}
      />
      <LoadingSkeleton
        height={128}
        width={128}
      />
    </div>
  );
};
