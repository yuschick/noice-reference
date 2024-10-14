import classNames from 'classnames';

import { Sprite } from '../Sprite/Sprite';

import styles from './Streaks.module.css';

import { RarityRarity } from '@gen';

interface State {
  idle: boolean;
  scaleUp: boolean;
  disappear: boolean;
}

interface Props {
  state: State;
  rarity: RarityRarity;
  onAnimationEnd?(state: State): void;
}

export function Streaks({ state, rarity, onAnimationEnd }: Props) {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.scaleUp]: state.scaleUp,
        [styles.disappear]: state.disappear,
      })}
      onAnimationEnd={() => onAnimationEnd?.(state)}
    >
      <Sprite
        imageClass={styles.streak}
        name="streak"
        rarity={rarity}
        type="fx"
        wrapperClass={classNames(styles.streak1, styles.streakSize)}
      />

      <Sprite
        imageClass={styles.streak}
        name="streak"
        rarity={rarity}
        type="fx"
        wrapperClass={classNames(styles.streak2, styles.streakSize)}
      />

      <Sprite
        imageClass={styles.streak}
        name="streak"
        rarity={rarity}
        type="fx"
        wrapperClass={classNames(styles.streak3, styles.streakSize)}
      />
    </div>
  );
}
