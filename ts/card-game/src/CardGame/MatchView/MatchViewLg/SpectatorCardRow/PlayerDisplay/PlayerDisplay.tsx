import { gql } from '@apollo/client';
import classNames from 'classnames';

import { SpectatorDisplayBottom } from '../SpectatorDisplayBottom';

import styles from './PlayerDisplay.module.css';

import {
  AllOrNothingPending,
  CardHighlightStateType,
  CardWithHighlightState,
  useCardRowCardHighlightState,
} from '@game-common/card';
import { useAllOrNothing } from '@game-common/card/hooks';
import { CardRowActiveCard } from '@game-components/CardRowActiveCard';
import { GameEventBonus } from '@game-components/GameEventBonus';
import { TeamMateBoosterButton } from '@game-components/TeamMateBoosterButton';
import { useSpectatorPlayerDisplayProfileQuery } from '@game-gen';
import { usePlayerBonuses } from '@game-logic/player/hooks';

gql`
  query SpectatorPlayerDisplayProfile($id: ID!) {
    profile(userId: $id) {
      ...SpectatorDisplayBottomProfile
    }
  }

  ${SpectatorDisplayBottom.fragments.entry}
`;

export interface Props {
  className?: string;
  playerId: string;
}

export function PlayerDisplay({ className, playerId }: Props) {
  const { allOrNothing } = useAllOrNothing(playerId);
  const { highlightState } = useCardRowCardHighlightState(playerId);
  const { loading, data } = useSpectatorPlayerDisplayProfileQuery({
    variables: { id: playerId },
  });
  const { gameEventBonusPoints } = usePlayerBonuses(playerId);

  const player = data?.profile ?? null;

  return (
    <div
      className={classNames(styles.displayWrapper, className, {
        [styles.cardHighlighted]: !!highlightState,
        [styles.cardSuccess]: highlightState?.type === CardHighlightStateType.Success,
        [styles.cardFailure]: highlightState?.type === CardHighlightStateType.Failure,
        [styles.bestPlay]: highlightState?.type === CardHighlightStateType.BestPlay,
      })}
    >
      <div className={styles.column}>
        {!gameEventBonusPoints && (
          <div className={styles.topBoosterContainer}>
            <TeamMateBoosterButton ownerId={playerId} />
          </div>
        )}

        <div className={styles.cardWrapper}>
          {gameEventBonusPoints ? (
            <GameEventBonus points={gameEventBonusPoints} />
          ) : allOrNothing ? (
            <AllOrNothingPending aonState={allOrNothing} />
          ) : highlightState ? (
            <CardWithHighlightState state={highlightState} />
          ) : (
            <CardRowActiveCard playerId={playerId} />
          )}
        </div>
        {loading ? (
          <SpectatorDisplayBottom.Loading />
        ) : (
          player && (
            <SpectatorDisplayBottom
              highlightState={highlightState}
              player={player}
            />
          )
        )}
      </div>
    </div>
  );
}
