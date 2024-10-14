import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { BottomGlow } from './BottomGlow/BottomGlow';
import { BottomLocks, BottomLocksState } from './BottomLocks/BottomLocks';
import { FrontGlow } from './FrontGlow/FrontGlow';
import { GlowRings } from './GlowRings/GlowRings';
import { Lid, LidState } from './Lid/Lid';
import { LightPillar } from './LightPillar/LightPillar';
import styles from './RewardBox.module.css';
import { Sprite } from './Sprite/Sprite';
import { Streaks } from './Streaks/Streaks';

import { useTimedAdsSounds } from '@common/placement/hooks/useTimedAdsSounds.hook';
import { RarityRarity } from '@gen';

export interface Props {
  open: boolean;
  rarity: RarityRarity;
  className?: string;
  hideStreaks?: boolean;
  onLidOpen?(): void;
}

/**
 * The RewardBox sprite sheet is now 8 square sprites because the longest animation
 * is 8 sprites. We can scale and translate the sprite sheet based on exact pixel
 * perfect percentage values (in this case horizontally by 12.5% and vertically 50%).
 * This enables the sprite sheet animations to scale purely with CSS and according
 * to the dimensions of the parent where the RewardBox is placed without us knowing
 * what is the pixel size of the sprite sheet.
 */
export function RewardBox({ open, rarity, className, hideStreaks, onLidOpen }: Props) {
  const [lidOpen, setLidOpen] = useState<boolean>(false);
  const [locksOpen, setLocksOpen] = useState<boolean>(false);
  const [lidFirstPhaseDone, setLidFistPhaseDone] = useState<boolean>(false);
  const { playOpenRewardsSound } = useTimedAdsSounds();

  useEffect(() => {
    setLidFistPhaseDone(false);
    setLidOpen(false);
    setLocksOpen(false);
  }, [open]);

  const onLocksOpened = (state: BottomLocksState) => {
    if (!state.open) {
      return;
    }

    setLocksOpen(true);
    playOpenRewardsSound();
  };

  const onLidFirstPhaseDone = (state: LidState) => {
    if (!state.openFirstPhase) {
      return;
    }

    setLidFistPhaseDone(true);
  };

  const onStreaksAnimationEnd = () => {
    setLidOpen(true);
    onLidOpen?.();
  };

  return (
    <div
      className={classNames(styles.container, className, {
        [styles.open]: open && !lidOpen,
        [styles.moveDown]: lidOpen,
      })}
    >
      <div className={styles.bottomShadow} />

      {lidOpen && <BottomGlow rarity={rarity} />}

      {lidOpen && <GlowRings rarity={rarity} />}

      {lidFirstPhaseDone && (
        <Lid
          rarity={rarity}
          state={{
            locksOpen: false,
            openFirstPhase: false,
            openSecondPhase: true,
          }}
        />
      )}

      <Sprite
        imageClass={styles.boxBack}
        name="box-back"
        rarity={rarity}
      />

      {lidOpen && <LightPillar rarity={rarity} />}

      <Sprite
        imageClass={styles.boxFront}
        name="box-front"
        rarity={rarity}
      />

      {open && (
        <BottomLocks
          state={{
            open: true,
          }}
          onAnimationEnd={onLocksOpened}
        />
      )}

      {!hideStreaks && (
        <Streaks
          rarity={rarity}
          state={{
            disappear: lidOpen,
            idle: !lidOpen && !locksOpen,
            scaleUp: locksOpen,
          }}
          onAnimationEnd={onStreaksAnimationEnd}
        />
      )}

      {!lidFirstPhaseDone && (
        <Lid
          rarity={rarity}
          state={{
            locksOpen: open,
            openFirstPhase: !lidFirstPhaseDone && lidOpen,
            openSecondPhase: false,
          }}
          onAnimationEnd={onLidFirstPhaseDone}
        />
      )}

      {!open && (
        <BottomLocks
          state={{
            open: false,
          }}
        />
      )}

      {locksOpen && !lidOpen && <FrontGlow rarity={rarity} />}
    </div>
  );
}
