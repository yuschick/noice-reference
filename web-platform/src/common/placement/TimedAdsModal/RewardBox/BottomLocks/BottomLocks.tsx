import classNames from 'classnames';

import { Sprite } from '../Sprite/Sprite';

import styles from './BottomLocks.module.css';

import { RarityRarity } from '@gen';

export interface BottomLocksState {
  open: boolean;
}

interface Props {
  state: BottomLocksState;
  onAnimationEnd?(state: BottomLocksState): void;
}

export function BottomLocks({ state, onAnimationEnd }: Props) {
  return (
    <Sprite
      imageClass={classNames(styles.locks, { [styles.open]: state.open })}
      name="bottom-locks"
      rarity={RarityRarity.RarityRare}
      onAnimationEnd={() => onAnimationEnd?.(state)}
    />
  );
}
