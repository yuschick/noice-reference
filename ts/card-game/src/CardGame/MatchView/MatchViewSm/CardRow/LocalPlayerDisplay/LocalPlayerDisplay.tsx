import { useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';

import { DisplayBottom } from '../DisplayBottom';
import { useShowCardDetails } from '../hooks';

import { AllOrNothingDialog } from './AllOrNothingDialog';
import styles from './LocalPlayerDisplay.module.css';

import {
  CardHighlightStateType,
  CardWithHighlightState,
  useCardRowCardHighlightState,
} from '@game-common/card';
import { useAllOrNothing } from '@game-common/card/hooks';
import { useHandleAutoOpenCardSelect } from '@game-common/game';
import { CardRowActiveCard } from '@game-components/CardRowActiveCard';
import { GameEventBonus } from '@game-components/GameEventBonus';
import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerBonuses } from '@game-logic/player/hooks';

export interface Props {
  className?: string;
}

export function LocalPlayerDisplay({ className }: Props) {
  const { userId } = useAuthenticatedUser();

  const { applyModeActive } = usePlayerBoosterApply();
  const { isBoosterTarget } = useIsBoosterTarget(userId);
  const { allOrNothing, onPlayAgainAllOrNothing, onCollectAllOrNothing } =
    useAllOrNothing(userId);
  const { highlightState } = useCardRowCardHighlightState(userId);
  const { gameEventBonusPoints } = usePlayerBonuses(userId);

  const { showDetails, toggleShowDetails, activeCardRef } = useShowCardDetails(userId);

  useHandleAutoOpenCardSelect({
    preventAutoOpen: !!allOrNothing,
  });

  return (
    <div
      className={classNames(styles.localPlayerRoot, className, {
        [styles.invalidApplyBoosterTarget]: applyModeActive && !isBoosterTarget,
        [styles.showDetails]: showDetails,
        [styles.isAllOrNothing]: !!allOrNothing,
        [styles.cardHighlighted]: !!highlightState,
        [styles.cardSuccess]: highlightState?.type === CardHighlightStateType.Success,
        [styles.cardFailure]: highlightState?.type === CardHighlightStateType.Failure,
        [styles.bestPlay]: highlightState?.type === CardHighlightStateType.BestPlay,
        [styles.applyBoosterMode]: applyModeActive,
      })}
    >
      <div className={styles.localPlayerColumn}>
        {applyModeActive && (
          <div
            className={styles.localPlayerApplyWrapper}
            data-ftue-anchor="booster-apply-help-text"
          >
            <h3 className={styles.localPlayerApplyTitle}>Choose card</h3>
            <div className={styles.localPlayerApplySmallText}>To apply booster</div>
          </div>
        )}
        {allOrNothing ? (
          <AllOrNothingDialog
            aonState={allOrNothing}
            className={styles.localPlayerAon}
            onCollect={onCollectAllOrNothing}
            onPlayAgain={onPlayAgainAllOrNothing}
          />
        ) : (
          <div className={styles.localPlayerCardWrapper}>
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
                activeCardRef={activeCardRef}
                className={styles.localPlayerCard}
                isHovered={showDetails}
                playerId={userId}
                onIdleActiveCardClick={toggleShowDetails}
              />
            )}
          </div>
        )}
        <DisplayBottom
          highlightState={highlightState}
          isCardHovered={showDetails}
          playerId={userId}
        />
      </div>
    </div>
  );
}
