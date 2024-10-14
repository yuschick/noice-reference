import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { CSSProperties } from 'react';

import styles from './GameCardBottomLabel.module.css';
import { useProgressAnimation } from './hooks';

import pointsLoadingbarShine from '@game-assets/images/points-loadingbar-shine.png';
import {
  GameCardBottomLabelCardFragment,
  GameCardBottomLabelStreamerCardFragment,
} from '@game-gen';
import { GameTimer } from '@game-logic/timer';

export interface GameCardBottomLabelProps {
  card: GameCardBottomLabelCardFragment;
  streamerCard: Nullable<GameCardBottomLabelStreamerCardFragment>;
  progressBarTimer?: Nullable<GameTimer>;
}

export function GameCardBottomLabel({
  card,
  streamerCard,
  progressBarTimer,
}: GameCardBottomLabelProps) {
  const { isAllOrNothing, isMatchCard } = card;
  const { channel } = streamerCard ?? {};
  const isStreamerCard = !!streamerCard;

  const { ref } = useProgressAnimation(progressBarTimer ?? null);

  const text = isStreamerCard
    ? channel?.name
    : isAllOrNothing
    ? 'All or Nothing'
    : isMatchCard
    ? 'Match Card'
    : 'Standard';

  return (
    <div className={styles.gameCardBottomLabelRoot}>
      {!isAllOrNothing && progressBarTimer && (
        <div className={styles.gameCardBottomLabelProgressBarWrapper}>
          <div
            className={styles.gameCardBottomLabelProgressBar}
            ref={ref}
            style={
              {
                '--points-loadingbar-shine': `url(${pointsLoadingbarShine})`,
              } as CSSProperties
            }
          />
        </div>
      )}
      <span className={styles.gameCardBottomLabelText}>{text}</span>
    </div>
  );
}

GameCardBottomLabel.fragments = {
  streamerCard: gql`
    fragment GameCardBottomLabelStreamerCard on GameLogicStreamerCard {
      id
      channel {
        id
        name
      }
    }
  `,
  card: gql`
    fragment GameCardBottomLabelCard on GameLogicCard {
      isAllOrNothing
      isMatchCard
    }
  `,
};
