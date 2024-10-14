import classNames from 'classnames';

import { ActiveBoosterWithVFX } from '../ActiveBoosterWithVFX';
import { useShowBoosterAppliedVfx } from '../hooks';

import styles from './ActiveBoostersPreview.module.css';

import { useCardActiveBoosters } from '@game-logic/card/hooks';

export interface Props {
  className?: string;
  cardOwnerId: string;
}

export function ActiveBoostersPreview({ className, cardOwnerId }: Props) {
  const { localPlayerBooster, teamMateBoosters } = useCardActiveBoosters(cardOwnerId);
  const { appliedBoosterId, clearBoostersAppliedVfx } =
    useShowBoosterAppliedVfx(cardOwnerId);

  // No need to render anything if there are no boosters and we are not in apply mode
  if (!localPlayerBooster && teamMateBoosters.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.activeBoostersBoostersRoot, className)}>
      {localPlayerBooster && (
        <ActiveBoosterWithVFX
          boosterId={localPlayerBooster.boosterId}
          showVfx={appliedBoosterId === localPlayerBooster.boosterId}
          timer={localPlayerBooster.activeTimer}
          onVfxCompleted={clearBoostersAppliedVfx}
        />
      )}
      {teamMateBoosters.map((booster, index) => (
        <ActiveBoosterWithVFX
          boosterId={booster.boosterId}
          key={index}
          showVfx={appliedBoosterId === booster.boosterId}
          timer={booster.activeTimer}
        />
      ))}
    </div>
  );
}
