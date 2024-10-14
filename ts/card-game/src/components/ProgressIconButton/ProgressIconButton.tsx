import { Icon, SvgComponent } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import {
  useEffect,
  useState,
  ComponentProps,
  useRef,
  forwardRef,
  CSSProperties,
} from 'react';

import styles from './ProgressIconButton.module.css';

import { getBoosterIconComponent } from '@game-common/booster';
import { usePlaySound } from '@game-common/sound/hooks';
import { GameTimer } from '@game-logic/timer';
import { GameSoundKeys, BoosterType } from '@game-types';

export interface Props extends Omit<ComponentProps<'button'>, 'ref'> {
  icon: SvgComponent | BoosterType;
  disabled?: boolean;
  timer: Nullable<GameTimer>;
  isTimerPaused?: boolean;
  isSmall?: boolean;
  className?: string;
  isReady?: boolean;
  repeatPulse?: boolean;
  onClick?(): void;
}

const getIconComponent = (icon: SvgComponent | BoosterType) => {
  if (typeof icon === 'number') {
    const BoosterIcon = getBoosterIconComponent(icon);

    return <BoosterIcon className={styles.icon} />;
  }

  return (
    <Icon
      className={styles.icon}
      icon={icon}
    />
  );
};

export const ProgressIconButton = forwardRef<HTMLDivElement, Props>(
  (
    {
      icon,
      onClick,
      timer,
      isTimerPaused,
      isSmall,
      className,
      isReady,
      repeatPulse,
      ...buttonProps
    },
    ref,
  ) => {
    const [playHover] = usePlaySound(GameSoundKeys.GenericHover);
    const [showHighlight, setShowLight] = useState(false);
    const [timerEnded, setTimerEnded] = useState(false);
    const [duration, setDuration] = useState(0);
    const progressStartedRef = useRef(false);

    // React when button is ready
    useEffect(() => {
      if (!isReady) {
        return;
      }

      setTimerEnded(true);
      setDuration(0);

      // Highlight button when timer ends (if progress was started)
      if (progressStartedRef.current) {
        setShowLight(true);
        progressStartedRef.current = false;
      }
    }, [isReady]);

    // React to timer changes
    useEffect(() => {
      if (!timer) {
        return;
      }

      if (!timer.timeLeft) {
        return;
      }

      // Reset timer end when new timer
      setTimerEnded(false);
      setDuration(timer.timeLeft);
      progressStartedRef.current = true;
    }, [timer]);

    // If repeat pulse is enabled, show highlight every X seconds
    useEffect(() => {
      if (!repeatPulse) {
        return;
      }

      setShowLight(true);

      const interval = window.setInterval(() => {
        setShowLight(true);
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }, [repeatPulse]);

    const onHighlighEnd = () => {
      // Hide highlight after animation is done
      setShowLight(false);
    };

    const onMouseEnter = () => {
      playHover();
    };

    const IconComponent = getIconComponent(icon);

    return (
      <div
        className={classNames(className, styles.buttonWrapper, {
          [styles.progressOn]: duration && !timerEnded,
          [styles.buttonReadyAnimation]: showHighlight,
          [styles.progressPaused]: isTimerPaused,
        })}
        ref={ref}
        style={
          {
            '--progress-icon-button-progress-duration': `${duration}ms`,
          } as CSSProperties
        }
      >
        <button
          className={classNames(styles.button, {
            [styles.basicButton]: !isReady,
            [styles.greenButton]: isReady,
            [styles.isSmall]: isSmall,
          })}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          {...buttonProps}
        >
          {IconComponent}

          {!!duration && <div className={styles.buttonProgress} />}
        </button>

        {showHighlight && (
          <div
            className={styles.highlight}
            onAnimationEnd={onHighlighEnd}
          />
        )}
      </div>
    );
  },
);
