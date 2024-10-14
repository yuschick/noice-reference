import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './SeasonBreakInfo.module.css';

import { useSeasonBreakInfoGameQuery } from '@gen';

gql`
  query SeasonBreakInfoGame($gameId: ID!) {
    game(id: $gameId) {
      id
      name
      activeSeason {
        id
        seasonBreak
        seasonBreakReason
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
}

export function SeasonBreakInfo({ gameId }: Props) {
  const { data, loading } = useSeasonBreakInfoGameQuery({
    ...variablesOrSkip({ gameId }),
  });

  const gameName = data?.game?.name ?? '';
  const seasonBreak = data?.game?.activeSeason?.seasonBreak ?? false;
  const seasonBreakReason = data?.game?.activeSeason?.seasonBreakReason ?? '';

  if (loading || !seasonBreak) {
    return null;
  }

  return (
    <div className={styles.seasonBreakInfoRoot}>
      <Icon
        className={styles.seasonBreakInfoIcon}
        icon={CoreAssets.Icons.Alert}
      />
      <p className={styles.seasonBreakInfoText}>
        Noice for {gameName} Creators is currently unavailable. {seasonBreakReason}
      </p>
    </div>
  );
}
