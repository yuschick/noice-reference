import {
  useIsMatchPaused,
  useIsRoundBasedGame,
  useRoundPhase,
} from '@noice-com/card-game';
import { Icon, useAnimatedNumber } from '@noice-com/common-ui';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import styles from './InactivityKickNotification.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';

export interface InactivityKickNotificationProps extends NotificationComponentBaseProps {
  secondsLeft: number;
}

export function InactivityKickNotification({
  secondsLeft,
  description,
  icon,
}: InactivityKickNotificationProps) {
  const isMatchPaused = useIsMatchPaused();
  const isRoundBased = useIsRoundBasedGame();
  const roundPhase = useRoundPhase();
  const [isCountdownFinished, setCountdownFinished] = useState(false);

  const onCountdownEnd = useCallback(() => setCountdownFinished(true), []);

  const isCountdownPaused =
    isMatchPaused ||
    (roundPhase !== StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED &&
      roundPhase !== StreamStateRoundPhase.ROUND_PHASE_COMPETITION);

  const { value: animatedSecondsLeft } = useAnimatedNumber({
    target: 0,
    initialValue: secondsLeft,
    duration: secondsLeft * 1000,
    isPaused: isCountdownPaused,
    suffix: 's',
    onEnd: onCountdownEnd,
  });

  return (
    <div className={classNames(styles.wrapper)}>
      {icon && (
        <Icon
          className={styles.icon}
          icon={icon}
        />
      )}

      <div className={styles.textContent}>
        <span>{description}</span>
        <div className={styles.countdownContainer}>
          <span className={styles.subtext}>
            {isCountdownFinished && isRoundBased
              ? 'Moving to Solo play on next round start'
              : `Moving to Solo play in: ${animatedSecondsLeft}${
                  isCountdownPaused ? ' (paused)' : ''
                }`}
          </span>
        </div>
      </div>
    </div>
  );
}
