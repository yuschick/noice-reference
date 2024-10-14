import classNames from 'classnames';

import { DisplayBottom } from '../DisplayBottom';

import styles from './TeamMateDisplay.module.css';

import {
  CardHighlightStateType,
  useCardHover,
  CardWithHighlightState,
  useCardRowCardHighlightState,
  AllOrNothingPending,
} from '@game-common/card';
import { useAllOrNothing } from '@game-common/card/hooks';
import { CardRowActiveCard } from '@game-components/CardRowActiveCard';
import { GameEventBonus } from '@game-components/GameEventBonus';
import { TeamMateBoosterButton } from '@game-components/TeamMateBoosterButton';
import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
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
  const activeCard = usePlayerActiveCard(playerId);

  const { isHovered, isLeavingHovered, setHovered } = useCardHover({
    playerId,
    preventHover:
      (!activeCard && !highlightState && !allOrNothing) || !!gameEventBonusPoints,
  });

  return (
    <div
      className={classNames(styles.teamMateRoot, className, {
        [styles.invalidApplyBoosterTarget]: applyModeActive && !isBoosterTarget,
        [styles.isHovered]: isHovered,
        [styles.isLeavingHovered]: isLeavingHovered,
        [styles.cardHighlighted]: !!highlightState,
        [styles.cardSuccess]: highlightState?.type === CardHighlightStateType.Success,
        [styles.cardFailure]: highlightState?.type === CardHighlightStateType.Failure,
        [styles.bestPlay]: highlightState?.type === CardHighlightStateType.BestPlay,
        [styles.applyBoosterMode]: applyModeActive,
      })}
    >
      {!gameEventBonusPoints && (
        <div className={styles.teamMateBoosterContainer}>
          <TeamMateBoosterButton ownerId={playerId} />
        </div>
      )}

      <div
        className={styles.teamMateCardWrapper}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
            className={styles.teamMateCard}
            isHovered={isHovered}
            playerId={playerId}
          />
        )}
      </div>

      <DisplayBottom
        highlightState={highlightState}
        isCardHovered={isHovered}
        playerId={playerId}
      />
    </div>
  );
}
