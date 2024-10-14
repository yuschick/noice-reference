import classNames from 'classnames';
import { CSSProperties } from 'react';

import { useEnterAndLeaveAnimation } from '../hooks';

import styles from './AnimatedLabel.module.css';

export interface Props {
  className?: string;
  text: string;
  animationDurations?: {
    enter?: number;
    wait?: number;
    leave?: number;
  };
  onAnimationEnd?: () => void;
}

const ENTER_ANIMATION_DURATION = 1500;
const LEAVE_ANIMATION_DURATION = 600;

export function AnimatedLabel({
  className,
  text,
  animationDurations,
  onAnimationEnd,
}: Props) {
  const {
    enter = ENTER_ANIMATION_DURATION,
    wait = 0,
    leave = LEAVE_ANIMATION_DURATION,
  } = animationDurations ?? {};

  const words = text.split(' ');

  const animationState = useEnterAndLeaveAnimation({
    durations: {
      enter,
      wait,
      leave,
    },
    onLeavingCompleted: onAnimationEnd,
  });

  return (
    <>
      {words.map((word, index) => (
        <span
          className={classNames(styles.animatedTitle, styles[animationState], className)}
          key={index}
          style={
            {
              '--_animated-label-word': `"${word}"`,
              '--_animated-label-enter-duration': `${ENTER_ANIMATION_DURATION}ms`,
              '--_animated-label-leave-duration': `${LEAVE_ANIMATION_DURATION}ms`,
            } as CSSProperties
          }
        >
          {word}&nbsp;
        </span>
      ))}
    </>
  );
}
