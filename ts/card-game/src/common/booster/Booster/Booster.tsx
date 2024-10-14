import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties, Ref, useEffect, useState } from 'react';

import { getBoosterIconComponent } from '../utils';

import styles from './Booster.module.css';

import { GameTimer } from '@game-logic/timer';
import { BoosterType } from '@game-types';

export interface BoosterProps {
  className?: string;
  boosterIconClassName?: string;
  forwardRef?: Ref<HTMLDivElement>;
  boosterId: BoosterType;
  timer?: Nullable<GameTimer>;
}

export function Booster({
  boosterId,
  timer,
  forwardRef,
  className,
  boosterIconClassName,
}: BoosterProps) {
  const BoosterIcon = getBoosterIconComponent(boosterId);

  const [duration, setDuration] = useState(timer?.timeLeft ?? 0);

  useEffect(() => {
    setDuration(timer?.timeLeft ?? 0);
  }, [timer]);

  return (
    <div
      className={classNames(className, styles.container)}
      ref={forwardRef}
      style={{ '--booster-timer-duration': `${duration}ms` } as CSSProperties}
    >
      <BoosterIcon className={classNames(styles.icon, boosterIconClassName)} />

      {!!duration && <div className={styles.progress} />}
    </div>
  );
}
