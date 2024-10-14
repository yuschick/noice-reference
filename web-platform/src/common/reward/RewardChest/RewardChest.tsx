import classNames from 'classnames';
import { CSSProperties } from 'react';

import { Chest, ChestProps } from '../Chest';

import styles from './RewardChest.module.css';
import { RewardChestState } from './types';

export interface RewardChestProps extends ChestProps {
  scale: number;
  state: RewardChestState;
  onOpened?(): void;
}

export function RewardChest({ rarity, state, scale, onOpened }: RewardChestProps) {
  return (
    <div
      className={classNames(styles.rewardChest, {
        [styles.opened]: state === 'opened',
        [styles.opening]: state === 'opening',
      })}
      style={
        {
          '--reward-chest-scale': scale,
        } as CSSProperties
      }
      onAnimationEnd={onOpened}
    >
      <Chest rarity={rarity} />
    </div>
  );
}
