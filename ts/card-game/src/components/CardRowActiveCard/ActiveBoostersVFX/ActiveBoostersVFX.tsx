import { AnimatedPngPlayer } from '@noice-com/common-ui';
import classNames from 'classnames';

import { useShowBoosterAppliedVfx } from '../hooks';

import styles from './ActiveBoostersVFX.module.css';

import BoosterActiveLoop from '@game-assets/vfx/booster-activeloop-vfx-powerlvl1.png';
import BoosterAppliedApng from '@game-assets/vfx/booster-applied-vfx.png';
import { useCardActiveBoosters } from '@game-logic/card/hooks';

interface Props {
  className?: string;
  playerId: string;
}

export function ActiveBoostersVFX({ playerId, className }: Props) {
  const { appliedBoosterId, clearBoostersAppliedVfx } =
    useShowBoosterAppliedVfx(playerId);
  const { allBoosters } = useCardActiveBoosters(playerId);

  const hasBoosters = allBoosters.length > 0;
  const showBoosterVfx = hasBoosters;

  if (!showBoosterVfx) {
    return null;
  }

  return (
    <div className={classNames(styles.activeBoostersVfxRoot, className)}>
      {/* This is shown when booster is applied */}
      {!!appliedBoosterId && (
        <AnimatedPngPlayer
          animationCount={1}
          delay={800}
          duration={1250}
          src={BoosterAppliedApng}
          onCompleted={clearBoostersAppliedVfx}
        />
      )}
      {/* This plays when there is at least one booster on card */}
      <AnimatedPngPlayer
        delay={appliedBoosterId ? 2400 : undefined}
        duration={2000}
        src={BoosterActiveLoop}
        infinite
      />
    </div>
  );
}
