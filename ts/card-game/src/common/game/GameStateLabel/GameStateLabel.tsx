import classNames from 'classnames';
import { CSSProperties, ReactNode } from 'react';

import { AnimatedLabel } from '../AnimatedLabel';
import { useEnterAndLeaveAnimation } from '../hooks';

import styles from './GameStateLabel.module.css';
import { GameStateLabelSubtitle } from './GameStateLabelSubtitle';

export interface Props {
  title: string;
  subtitle?: string | ReactNode | ReactNode[];
  onAnimationEnd?: () => void;
}

const ENTER_ANIMATION_DURATION = 1500;
const LEAVE_ANIMATION_DURATION = 600;
const SUBTITLE_START_INITIAL_DELAY = ENTER_ANIMATION_DURATION * 0.6;
const SUBTITLE_ANIMATION_DURATION = 2250;

export function GameStateLabel({ title, subtitle, onAnimationEnd }: Props) {
  const subtitles =
    subtitle && Array.isArray(subtitle) ? subtitle : subtitle ? [subtitle] : [];

  const durationToLeave = subtitles.length
    ? SUBTITLE_START_INITIAL_DELAY +
      subtitles.length * SUBTITLE_ANIMATION_DURATION -
      // We want the last subtitle and the title to start to leave at the same time
      LEAVE_ANIMATION_DURATION * 0.5
    : ENTER_ANIMATION_DURATION;

  const animationState = useEnterAndLeaveAnimation({
    durations: {
      enter: ENTER_ANIMATION_DURATION,
      wait: durationToLeave - ENTER_ANIMATION_DURATION,
      leave: LEAVE_ANIMATION_DURATION,
    },
    onLeavingCompleted: onAnimationEnd,
  });

  const rootElementCssProps = {
    '--_game-state-label-enter-duration': `${ENTER_ANIMATION_DURATION}ms`,
    '--_game-state-label-leave-duration': `${LEAVE_ANIMATION_DURATION}ms`,
  } as CSSProperties;

  return (
    <>
      <div
        className={classNames(styles.gameStateLabelOverlay, styles[animationState])}
        style={rootElementCssProps}
      />
      <div
        className={classNames(styles.gameStateLabel, styles[animationState])}
        style={rootElementCssProps}
      >
        <div className={styles.gameStateLabelContentContainer}>
          <h2 className={styles.gameStateLabelTitleContainer}>
            <AnimatedLabel
              animationDurations={{
                enter: ENTER_ANIMATION_DURATION,
                wait: durationToLeave - ENTER_ANIMATION_DURATION,
                leave: LEAVE_ANIMATION_DURATION,
              }}
              className={styles.gameStateLabelAnimatedTitle}
              text={title}
            />
          </h2>

          {subtitles.map((subtitle, index) => (
            <GameStateLabelSubtitle
              animationDelay={
                SUBTITLE_START_INITIAL_DELAY + index * SUBTITLE_ANIMATION_DURATION
              }
              animationDuration={SUBTITLE_ANIMATION_DURATION}
              key={index}
              subtitle={subtitle}
            />
          ))}
        </div>
      </div>
    </>
  );
}
