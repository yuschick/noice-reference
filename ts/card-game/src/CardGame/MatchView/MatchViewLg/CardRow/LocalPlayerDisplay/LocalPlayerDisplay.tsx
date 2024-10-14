import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import { DisplayBottom } from '../DisplayBottom';

import { AllOrNothingDialog } from './AllOrNothingDialog';
import styles from './LocalPlayerDisplay.module.css';

import {
  AllOrNothingState,
  CardHighlightStateType,
  CardWithHighlightState,
  useCardHover,
  useCardRowCardHighlightState,
} from '@game-common/card';
import { useAllOrNothing } from '@game-common/card/hooks';
import { useHandleAutoOpenCardSelect } from '@game-common/game';
import { CardRowActiveCard } from '@game-components/CardRowActiveCard';
import { GameEventBonus } from '@game-components/GameEventBonus';
import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { usePlayerBonuses } from '@game-logic/player/hooks';

export interface Props {
  className?: string;
  onAonStateChange: (state: Nullable<AllOrNothingState>) => void;
}

export function LocalPlayerDisplay({ className, onAonStateChange }: Props) {
  const { userId } = useAuthenticatedUser();

  const activeCard = usePlayerActiveCard(userId);
  const { applyModeActive } = usePlayerBoosterApply();
  const { isBoosterTarget } = useIsBoosterTarget(userId);
  const { allOrNothing, onPlayAgainAllOrNothing, onCollectAllOrNothing } =
    useAllOrNothing(userId, { onAonStateChange });
  const { highlightState } = useCardRowCardHighlightState(userId);
  const { gameEventBonusPoints } = usePlayerBonuses(userId);
  const { isHovered, isLeavingHovered, setHovered } = useCardHover({
    playerId: userId,
    preventHover: (!activeCard && !highlightState) || !!gameEventBonusPoints,
  });

  useHandleAutoOpenCardSelect({
    preventAutoOpen: !!allOrNothing,
  });

  return (
    <div
      className={classNames(styles.localPlayerRoot, className, {
        [styles.invalidApplyBoosterTarget]: applyModeActive && !isBoosterTarget,
        [styles.isHovered]: isHovered,
        [styles.isLeavingHovered]: isLeavingHovered,
        [styles.isAllOrNothing]: !!allOrNothing,
        [styles.cardHighlighted]: !!highlightState,
        [styles.cardSuccess]: highlightState?.type === CardHighlightStateType.Success,
        [styles.cardFailure]: highlightState?.type === CardHighlightStateType.Failure,
        [styles.bestPlay]: highlightState?.type === CardHighlightStateType.BestPlay,
        [styles.applyBoosterMode]: applyModeActive,
      })}
    >
      {applyModeActive && (
        <div
          className={styles.applyHelperTextWrapper}
          data-ftue-anchor="booster-apply-help-text"
        >
          <h3 className={styles.applyHelperTitle}>Choose card</h3>
          <div className={styles.applyHelperSmallText}>To apply booster</div>
        </div>
      )}

      {allOrNothing ? (
        <div className={styles.localPlayerAonWrapper}>
          <AllOrNothingDialog
            aonState={allOrNothing}
            className={styles.localPlayerAon}
            onCollect={onCollectAllOrNothing}
            onPlayAgain={onPlayAgainAllOrNothing}
          />
        </div>
      ) : (
        <div
          className={styles.localPlayerCardWrapper}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {gameEventBonusPoints ? (
            <GameEventBonus
              className={styles.localPlayerBonus}
              points={gameEventBonusPoints}
            />
          ) : highlightState ? (
            <CardWithHighlightState
              className={styles.localPlayerCard}
              state={highlightState}
            />
          ) : (
            <CardRowActiveCard
              className={styles.localPlayerCard}
              isHovered={isHovered}
              playerId={userId}
            />
          )}
        </div>
      )}

      <DisplayBottom
        highlightState={highlightState}
        isCardHovered={isHovered}
        playerId={userId}
      />
    </div>
  );
}
