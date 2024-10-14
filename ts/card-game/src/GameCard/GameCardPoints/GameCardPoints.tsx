import { gql } from '@apollo/client';
import { NumberCounter } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

import styles from './GameCardPoints.module.css';

import {
  GameCardPointsCardFragment,
  GameCardPointsStreamerCardFragment,
} from '@game-gen';

export interface GameCardPointsProps {
  card: GameCardPointsCardFragment;
  streamerCard: Nullable<GameCardPointsStreamerCardFragment>;
}

export function GameCardPoints({ card, streamerCard }: GameCardPointsProps) {
  const { pointsMin: min, pointsMax: max, isAllOrNothing } = card;
  const isStreamerCard = !!streamerCard;

  const prevPoints = useRef<Nullable<number>>(null);

  const showMax = (max ?? 0) > 0 && !isAllOrNothing;
  const oldMin = prevPoints.current ?? min;
  const newMin = min;

  useEffect(() => {
    if (min < 0) {
      return;
    }

    prevPoints.current = min;
  }, [min]);

  return (
    <div
      className={classNames(styles.gameCardPointsWrapper, {
        [styles.streamerCard]: isStreamerCard,
        [styles.hideMax]: !showMax,
      })}
    >
      <NumberCounter
        className={styles.gameCardPointsNumber}
        duration={225}
        initialValue={oldMin}
        targetValue={newMin}
      />

      <div className={styles.gameCardPointsMaxWrapper}>
        <span className={styles.gameCardPointsMaxLabel}>MAX</span>
        <span className={styles.gameCardPointsMaxValue}>{max}</span>
      </div>
    </div>
  );
}

GameCardPoints.fragments = {
  streamerCard: gql`
    fragment GameCardPointsStreamerCard on GameLogicStreamerCard {
      id
    }
  `,
  card: gql`
    fragment GameCardPointsCard on GameLogicCard {
      pointsMax
      pointsMin
      isAllOrNothing
    }
  `,
};
