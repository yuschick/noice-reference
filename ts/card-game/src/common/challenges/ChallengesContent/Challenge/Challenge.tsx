import { CurrencyIcon, SetTimeoutId, WalletCurrencyId } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';

import styles from './Challenge.module.css';

import { ChallengeStatus } from '@game-logic/challenges';

export type Props =
  | {
      challenge: {
        description: string;
        pickRatePercentage: number;
        status: ChallengeStatus;
        reward: {
          currencyId: WalletCurrencyId;
          amount: number;
        };
      };
      isSelected?: boolean;
      isDisabled?: boolean;
      isLoading?: never;
      onClick?(): void;
    }
  | {
      challenge?: never;
      reward?: never;
      isLoading: true;
      isDisabled?: never;
      isSelected?: never;
      onClick?: never;
    };

const SELECTED_ANIMATION_DURATION = 400;

export const Challenge = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
  const timeout = useRef<Nullable<SetTimeoutId>>(null);
  const [showSelectedAnimation, setShowSelectedAnimation] = useState(false);

  useEffect(() => {
    if (!props.isSelected) {
      setShowSelectedAnimation(false);
      return;
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [props.isSelected]);

  if (props.isLoading) {
    return (
      <div className={classNames(styles.challengeRoot, styles.loadingRoot)}>
        <div className={styles.loadingChallenge} />
      </div>
    );
  }

  const { challenge, isSelected, isDisabled, onClick } = props;
  const { description, pickRatePercentage, status, reward } = challenge;
  const { amount: rewardAmount, currencyId: currencyType } = reward;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // If the challenge is selected, we want to show the animation
    setShowSelectedAnimation(true);
    onClick?.();

    // Also clear the animation after a certain duration
    timeout.current = setTimeout(() => {
      setShowSelectedAnimation(false);
    }, SELECTED_ANIMATION_DURATION);
  };

  return (
    <button
      {...(isDisabled && { 'aria-disabled': true })}
      className={classNames(styles.challengeRoot, styles[status], {
        [styles.selected]: isSelected,
        [styles.showSelectedAnimation]: showSelectedAnimation,
        [styles.disabled]: isDisabled,
      })}
      ref={ref}
      style={
        {
          '--_selected-animation-duration': `${SELECTED_ANIMATION_DURATION}ms`,
        } as CSSProperties
      }
      onClick={handleClick}
    >
      <div className={styles.background} />
      <div className={styles.border} />

      {(status === 'success' || status === 'failure') && (
        <div className={styles.vfx}></div>
      )}

      {isSelected && <span className={styles.selectedTextWrapper}>Selected</span>}
      <div className={styles.challengeContent}>
        <p className={styles.challengeDescriptionContainer}>{description}</p>
        <div className={styles.challengeMetaWrapper}>
          <div className={styles.challengePickRate}>
            <span className={styles.challengePickRateLabel}>Selected by</span>
            <span>{pickRatePercentage}%</span>
            <div
              className={styles.challengePickRateProgress}
              style={{ width: `${pickRatePercentage}%` }}
            />
          </div>
          <div className={styles.challengeRewardWrapper}>
            <span className={styles.challengeRewardLabel}>Reward</span>
            <div className={styles.challengeReward}>
              <CurrencyIcon
                className={styles.challengeRewardIcon}
                size="sm"
                type={currencyType}
              />
              {rewardAmount}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
});
