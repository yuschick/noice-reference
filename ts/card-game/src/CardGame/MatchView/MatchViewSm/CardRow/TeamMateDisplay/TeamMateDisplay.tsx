import classNames from 'classnames';

import { DisplayBottom } from '../DisplayBottom';
import { useShowCardDetails } from '../hooks';

import styles from './TeamMateDisplay.module.css';

import {
  CardHighlightStateType,
  CardWithHighlightState,
  useCardRowCardHighlightState,
  AllOrNothingPending,
} from '@game-common/card';
import { useAllOrNothing } from '@game-common/card/hooks';
import { CardRowActiveCard } from '@game-components/CardRowActiveCard';
import { GameEventBonus } from '@game-components/GameEventBonus';
import { TeamMateBoosterButton } from '@game-components/TeamMateBoosterButton';
import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerBonuses } from '@game-logic/player/hooks';

export interface Props {
  className?: string;
  playerId: string;
}

export function TeamMateDisplay({ className, playerId }: Props) {
  const { allOrNothing } = useAllOrNothing(playerId);
  const { highlightState } = useCardRowCardHighlightState(playerId);
  const { gameEventBonusPoints } = usePlayerBonuses(playerId);
  const { applyModeActive } = usePlayerBoosterApply();
  const { isBoosterTarget } = useIsBoosterTarget(playerId);

  const { showDetails, toggleShowDetails, activeCardRef } = useShowCardDetails(playerId);

  return (
    <div
      className={classNames(styles.teamMateRoot, className, {
        [styles.invalidApplyBoosterTarget]: applyModeActive && !isBoosterTarget,
        [styles.showDetails]: showDetails,
        [styles.cardHighlighted]: !!highlightState,
        [styles.cardSuccess]: highlightState?.type === CardHighlightStateType.Success,
        [styles.cardFailure]: highlightState?.type === CardHighlightStateType.Failure,
        [styles.bestPlay]: highlightState?.type === CardHighlightStateType.BestPlay,
      })}
    >
      <div className={styles.teamMateColumn}>
        {!showDetails && !gameEventBonusPoints && (
          <div className={styles.teamMateBoosterContainer}>
            <TeamMateBoosterButton ownerId={playerId} />
          </div>
        )}
        <div className={styles.teamMateCardWrapper}>
          {gameEventBonusPoints ? (
            <GameEventBonus
              className={styles.teamMateBonus}
              points={gameEventBonusPoints}
            />
          ) : allOrNothing ? (
            <AllOrNothingPending
              aonState={allOrNothing}
              className={styles.teamMateCard}
            />
          ) : highlightState ? (
            <CardWithHighlightState
              className={styles.teamMateCard}
              state={highlightState}
            />
          ) : (
            <CardRowActiveCard
              activeCardRef={activeCardRef}
              className={styles.teamMateCard}
              isHovered={showDetails}
              playerId={playerId}
              onIdleActiveCardClick={toggleShowDetails}
            />
          )}
        </div>

        <DisplayBottom
          highlightState={highlightState}
          isCardHovered={showDetails}
          playerId={playerId}
        />
      </div>
    </div>
  );
}
