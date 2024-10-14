import classNames from 'classnames';
import { CSSProperties, ReactNode } from 'react';

import { useEnterAndLeaveAnimation } from '../../hooks';

import styles from './GameStateLabelSubtitle.module.css';

export interface Props {
  animationDelay: number;
  animationDuration: number;
  subtitle: string | ReactNode;
}

const TRANSITION_DURATION = 300;

export function GameStateLabelSubtitle({
  animationDelay,
  animationDuration,
  subtitle,
}: Props) {
  const animationState = useEnterAndLeaveAnimation({
    delay: animationDelay,
    durations: {
      enter: TRANSITION_DURATION,
      wait: animationDuration - TRANSITION_DURATION,
      leave: TRANSITION_DURATION,
    },
  });

  return (
    <div
      className={classNames(styles.gameStateLabelSubtitleRoot, styles[animationState])}
      style={
        {
          '--_game-state-label-subtitle-transition-duration': `${TRANSITION_DURATION}ms`,
        } as CSSProperties
      }
    >
      {subtitle}
    </div>
  );
}
