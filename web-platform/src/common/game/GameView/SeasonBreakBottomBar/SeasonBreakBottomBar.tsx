import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './SeasonBreakBottomBar.module.css';

import { SeasonBreakBottomBarSeasonFragment } from '@gen';

gql`
  fragment SeasonBreakBottomBarSeason on GameSeason {
    seasonBreak
    seasonBreakReason
  }
`;

interface Props {
  season: SeasonBreakBottomBarSeasonFragment;
}

export function SeasonBreakBottomBar({ season }: Props) {
  const { seasonBreak, seasonBreakReason } = season;

  if (!seasonBreak) {
    return null;
  }

  return (
    <div className={styles.seasonBreakBottomBar}>
      <Icon icon={CoreAssets.Icons.Alert} />
      Predictions are currently disabled due to: {seasonBreakReason}
    </div>
  );
}
