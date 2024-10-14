import { CoreAssets } from '@noice-com/assets-core';
import {
  Icon,
  SetTimeoutId,
  Tooltip,
  useMouseClickWithSound,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import styles from './ChallengesButton.module.css';
import { TooltipContent } from './TooltipContent/TooltipContent';

import { useCardGameUIState } from '@game-context';
import {
  useChallengeStatuses,
  useIsChallengesEnabled,
  useIsChallengesLocked,
  useSelectedChallenge,
} from '@game-logic/challenges/hooks';
import { useMatchEnded } from '@game-logic/game/hooks';

const PULSE_ANIMATION_DURATION = 1150;
const RESOLUTION_ANIMATION_DURATION = 3250;

export type ChallengeSelectedStatus = 'initial' | 'selected' | 'unselected';

export interface Props {
  /** @default 'full' */
  animationVfx?: 'minimal' | 'full';
  showSelectedIcon?: boolean;
}

export function ChallengesButton({ animationVfx = 'full', showSelectedIcon }: Props) {
  const animationShown = useRef(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showExpandVfx, setShowExpandVfx] = useState(false);

  const { isChallengesDialogOpen, openChallengesDialog } = useCardGameUIState();
  const { selectedChallengeId } = useSelectedChallenge();
  const { statuses } = useChallengeStatuses();
  const { isEnabled } = useIsChallengesEnabled();
  const { isChallengesLocked } = useIsChallengesLocked();

  const challengeSelectedStatus =
    isChallengesLocked || !showSelectedIcon
      ? 'initial'
      : selectedChallengeId
      ? 'selected'
      : 'unselected';

  const selectedChallengeStatus = selectedChallengeId
    ? statuses[selectedChallengeId] ?? 'unresolved'
    : null;

  const reset = useCallback(() => {
    animationShown.current = false;
    setShowPulse(false);
    setShowExpandVfx(false);
  }, []);

  const handleClickWithSound = useMouseClickWithSound(openChallengesDialog);

  useMatchEnded(reset);

  // Show pulse and success animation
  useLayoutEffect(() => {
    if (
      !isEnabled ||
      !['success', 'failure'].includes(selectedChallengeStatus ?? '') ||
      animationShown.current
    ) {
      return;
    }

    setShowPulse(true);
    animationShown.current = true;

    const timeouts: SetTimeoutId[] = [];

    if (selectedChallengeStatus === 'success') {
      timeouts.push(
        setTimeout(() => {
          setShowPulse(false);
          setShowExpandVfx(true);

          timeouts.push(
            setTimeout(() => {
              setShowExpandVfx(false);
            }, RESOLUTION_ANIMATION_DURATION),
          );
        }, PULSE_ANIMATION_DURATION),
      );
    }

    if (selectedChallengeStatus === 'failure') {
      timeouts.push(
        setTimeout(() => {
          setShowPulse(false);
          setShowExpandVfx(true);

          timeouts.push(
            setTimeout(() => {
              setShowExpandVfx(false);
            }, RESOLUTION_ANIMATION_DURATION),
          );
        }, PULSE_ANIMATION_DURATION),
      );
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isEnabled, selectedChallengeStatus]);

  // Clear if dialog is open
  useEffect(() => {
    if (!isChallengesDialogOpen) {
      return;
    }

    setShowPulse(false);
    setShowExpandVfx(false);
  }, [isChallengesDialogOpen]);

  if (!isEnabled) {
    return null;
  }
  const animationText = selectedChallengeStatus === 'success' ? 'success' : 'fail';

  return (
    <div
      className={classNames(styles.challengesButtonRoot, {
        [styles.success]: selectedChallengeStatus === 'success' && !showPulse,
        [styles.failure]: selectedChallengeStatus === 'failure' && !showPulse,
        [styles.vfxFull]: animationVfx === 'full',
      })}
      style={
        {
          '--_pulse-animation-duration': `${PULSE_ANIMATION_DURATION}ms`,
          '--_resolution-animation-duration': `${RESOLUTION_ANIMATION_DURATION}ms`,
        } as CSSProperties
      }
    >
      <Tooltip
        content={<TooltipContent challengeSelectedStatus={challengeSelectedStatus} />}
        delay={50}
        placement="top"
        renderIn="inline"
      >
        <button
          aria-label={'Open Match Challenges'}
          className={styles.challengesButton}
          onClick={handleClickWithSound}
        >
          <Icon icon={CoreAssets.Icons.MatchChallenges} />

          {challengeSelectedStatus !== 'initial' && (
            <div className={styles.selectedIconContainer}>
              {challengeSelectedStatus === 'selected' && (
                <Icon
                  color="green-main"
                  icon={CoreAssets.Icons.CheckCircle}
                  size={16}
                />
              )}
              {challengeSelectedStatus === 'unselected' && (
                <Icon
                  color="status-alert-main"
                  icon={CoreAssets.Icons.Exclamation}
                  size={16}
                />
              )}
            </div>
          )}
        </button>
      </Tooltip>

      {showExpandVfx && (
        <div
          className={classNames(styles.extensionAnimation, {
            [styles.failure]: selectedChallengeStatus === 'failure',
            [styles.success]: selectedChallengeStatus === 'success',
          })}
        >
          <span className={styles.extensionAnimationText}>{animationText}</span>
        </div>
      )}

      {showPulse && (
        <div
          className={classNames(styles.pulse, {
            [styles.failure]: selectedChallengeStatus === 'failure',
            [styles.success]: selectedChallengeStatus === 'success',
          })}
        />
      )}
    </div>
  );
}
