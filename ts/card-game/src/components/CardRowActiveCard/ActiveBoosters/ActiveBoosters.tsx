import classNames from 'classnames';
import { TransitionEvent, useEffect, useRef, useState } from 'react';

import { useShowBoosterAppliedVfx } from '../hooks';

import { ActiveBooster } from './ActiveBooster';
import styles from './ActiveBoosters.module.css';
import { useReplacementBoosterData } from './hooks/useReplacementBoosterData.hook';

import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { useCardActiveBoosters } from '@game-logic/card/hooks';
import { useLocalPlayerId } from '@game-logic/game/hooks';
import { useTeamMates } from '@game-logic/group/hooks';

export interface Props {
  backgroundClassName?: string;
  boostersClassName?: string;
  cardOwnerId: string;
  isCardHovered?: boolean;
}

export function ActiveBoosters({
  backgroundClassName,
  boostersClassName,
  cardOwnerId,
  isCardHovered,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transitionDone, setTransitionDone] = useState(true);

  const { teamPlayerIds } = useTeamMates();
  const { applyModeActive } = usePlayerBoosterApply();

  const { localPlayerBooster, teamMateBoosters } = useCardActiveBoosters(cardOwnerId);
  const replacementBooster = useReplacementBoosterData();
  const localPlayerId = useLocalPlayerId();

  // +1 for the local player but reduced the amount of actual applied booster (-1 with mocked data)
  const localPlayerBoosterModifier =
    localPlayerBooster !== null || replacementBooster !== null ? 1 : 0;
  const appliedBoosterAmount = teamMateBoosters.length + localPlayerBoosterModifier;
  const maxApplyBoosterAmount = teamPlayerIds.length + 1 - appliedBoosterAmount;

  const { appliedBoosterId, clearBoostersAppliedVfx } =
    useShowBoosterAppliedVfx(cardOwnerId);

  useEffect(() => {
    if (!isCardHovered) {
      return;
    }
    // When card is hovered, active booster have hover transition
    setTransitionDone(false);
  }, [isCardHovered]);

  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === ref.current) {
      setTransitionDone(true);
    }
  };

  // No need to render anything if there are no boosters and we are not in apply mode
  if (!localPlayerBooster && teamMateBoosters.length === 0 && !applyModeActive) {
    return null;
  }

  return (
    <>
      {/* To have better control on bg vs boosters z-indexes, have them as separate divs */}
      <div
        className={classNames(styles.activeBoostersBackground, backgroundClassName)}
        ref={ref}
        onTransitionEnd={onTransitionEnd}
      />
      <div
        className={classNames(styles.activeBoostersBoostersContainer, boostersClassName)}
      >
        {/* We want to render content only in hovered state to avoid any hover jitter issues */}
        {isCardHovered && (
          <>
            {(localPlayerBooster || replacementBooster) && (
              <ActiveBooster
                boosterOwnerId={localPlayerId}
                cardOwnerId={cardOwnerId}
                forceShowTooltip={
                  applyModeActive &&
                  isCardHovered &&
                  !!replacementBooster &&
                  transitionDone
                }
                replaceBooster={
                  isCardHovered && applyModeActive ? replacementBooster : null
                }
                showVfx={appliedBoosterId === localPlayerBooster?.boosterId}
                onVfxCompleted={clearBoostersAppliedVfx}
              />
            )}
            {teamMateBoosters.map((booster, index) => (
              <ActiveBooster
                boosterOwnerId={booster.givenById}
                cardOwnerId={cardOwnerId}
                key={index}
                showVfx={appliedBoosterId === booster.boosterId}
                onVfxCompleted={clearBoostersAppliedVfx}
              />
            ))}
            {maxApplyBoosterAmount > 0 &&
              Array(maxApplyBoosterAmount)
                .fill(0)
                .map((_, index) => (
                  <div
                    className={styles.activeBoostersBoosterPlaceholder}
                    key={index}
                  />
                ))}
          </>
        )}
      </div>
    </>
  );
}
