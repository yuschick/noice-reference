import { gql } from '@apollo/client';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { getLevelGroupClassName } from '../utils';

import styles from './GameCardLevel.module.css';

import { GameCardLevelCardFragment, useGameCardLevelSeasonQuery } from '@game-gen';

interface Props {
  card: GameCardLevelCardFragment;
}

gql`
  query GameCardLevelSeason($seasonId: ID!) {
    season(id: $seasonId) {
      id
      badgeUrl
    }
  }
`;

export function GameCardLevel({ card }: Props) {
  const { seasonId } = card;
  const level = card.leveling.currentLevel;

  const { data } = useGameCardLevelSeasonQuery({
    variables: {
      seasonId,
    },
  });

  const levelGroupClassName = getLevelGroupClassName(level);
  const badgeUrl = data?.season?.badgeUrl ?? '';

  return (
    <div
      className={classNames(styles.gameCardLevelWrapper, styles[levelGroupClassName])}
      style={
        {
          '--game-card-level-season-badge-url': `url(${badgeUrl})`,
        } as CSSProperties
      }
    >
      <div className={styles.gameCardLevelSeasonBadge} />
      <div className={styles.gameCardLevel}>{level}</div>
    </div>
  );
}

GameCardLevel.fragments = {
  card: gql`
    fragment GameCardLevelCard on GameLogicCard {
      leveling {
        currentLevel
      }
      seasonId
    }
  `,
};
