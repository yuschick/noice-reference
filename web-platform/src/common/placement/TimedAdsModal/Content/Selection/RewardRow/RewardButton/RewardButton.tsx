import { Icon, Tooltip } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, RefObject, useEffect, useRef } from 'react';
import { useTimer } from 'react-timer-hook';

import { Legend } from '../../Legend/Legend';

import styles from './RewardButton.module.css';

import Lock from '@assets/images/timed-ads-locked.svg';
import SmallRewardBoxes from '@assets/images/timed-ads-small-reward-boxes.webp';
import { useTimedAdsSounds } from '@common/placement/hooks';
import { RarityRarity, TimedAdsRewardRowRewardFragment } from '@gen';

interface Props {
  reward: TimedAdsRewardRowRewardFragment;
  className?: string;
  locked: boolean;
  rarity: RarityRarity;
  readyAt: number;
  rewardItemRefs: RefObject<HTMLButtonElement[]>;
  selected: boolean;
  showCountdown: boolean;
}

export function RewardButton({
  className,
  locked,
  rarity,
  reward,
  readyAt,
  rewardItemRefs,
  selected,
  showCountdown,
}: Props) {
  const { playHoverSound } = useTimedAdsSounds();

  const rewardItemRef = useRef<HTMLButtonElement>(null);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(readyAt),
    autoStart: false,
  });

  useEffect(() => {
    if (readyAt <= Date.now()) {
      return;
    }

    restart(new Date(readyAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyAt]);

  useEffect(() => {
    if (
      !rewardItemRef.current ||
      !rewardItemRefs.current ||
      (rewardItemRef && rewardItemRefs.current.includes(rewardItemRef.current))
    ) {
      return;
    }

    rewardItemRefs.current.push(rewardItemRef.current);
  }, [rewardItemRefs]);

  return (
    <div className={styles.buttonWrapper}>
      <Tooltip
        content={
          <div className={styles.tooltipContent}>
            <p className={styles.tooltipRewardName}>{`${rarity
              .replace('RARITY_', '')
              .toLowerCase()} reward`}</p>
            <Legend prizes={reward.prizes} />
          </div>
        }
        forceState={selected ? 'hide' : undefined}
        placement="bottom"
        triggerRef={rewardItemRef}
      >
        <button
          aria-current={selected}
          aria-disabled={!selected || locked}
          className={classNames(
            styles.button,
            { [styles.selected]: selected },
            className,
          )}
          type="button"
          onMouseEnter={playHoverSound}
        >
          <div
            className={classNames(styles.boxWrapper, {
              [styles.disabled]: locked,
              [styles.common]: rarity === RarityRarity.RarityCommon,
              [styles.uncommon]: rarity === RarityRarity.RarityUncommon,
              [styles.rare]: rarity === RarityRarity.RarityRare,
              [styles.epic]: rarity === RarityRarity.RarityEpic,
              [styles.legendary]: rarity === RarityRarity.RarityLegendary,
            })}
            style={{ '--reward-background': `url(${SmallRewardBoxes})` } as CSSProperties}
          />
          {locked && (
            <Icon
              className={styles.lockIcon}
              icon={Lock}
              title="Locked"
            />
          )}
          {showCountdown && (
            <span
              className={classNames(styles.countdown, styles.stateRow)}
              role="timer"
            >{`${minutes}:${seconds.toString().padStart(2, '0')}`}</span>
          )}
        </button>
      </Tooltip>
    </div>
  );
}
