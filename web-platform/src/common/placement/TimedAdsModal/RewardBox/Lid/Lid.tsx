import classNames from 'classnames';

import { Sprite } from '../Sprite/Sprite';

import styles from './Lid.module.css';

import { RarityRarity } from '@gen';

export interface LidState {
  locksOpen: boolean;
  openFirstPhase: boolean;
  openSecondPhase: boolean;
}

interface Props {
  state: LidState;
  rarity: RarityRarity;
  onAnimationEnd?(state: LidState): void;
}

export function Lid({ state, rarity, onAnimationEnd }: Props) {
  return (
    <Sprite
      imageClass={classNames(styles.boxLid, {
        [styles.openFirstPhase]: state.openFirstPhase,
        [styles.openSecondPhase]: state.openSecondPhase,
        [styles.locksOpen]: state.locksOpen,
      })}
      name="box-lid"
      rarity={rarity}
      onAnimationEnd={() => onAnimationEnd?.(state)}
    />
  );
}
