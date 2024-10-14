import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, LoadingSkeleton } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import { useRewardTrackNavigation } from './hooks/useRewardTrackNavigation.hook';
import styles from './RewardTrack.module.css';
import { RewardTrackItem } from './RewardTrackItem/RewardTrackItem';
import { resolveInitialIndex } from './utils';

import {
  RewardTrackLevelConfigFragment,
  RewardTrackRewardsFragment,
  RewardTrackSeasonProgressionFragment,
} from '@gen';

RewardTrack.fragments = {
  levelConfig: gql`
    fragment RewardTrackLevelConfig on ProgressionLevelConfig {
      ...RewardTrackItemLevelConfig
    }

    ${RewardTrackItem.fragments.levelConfig}
  `,

  progression: gql`
    fragment RewardTrackSeasonProgression on ProgressionSeasonProgression {
      seasonId
      ...RewardTrackItemProgression
    }

    ${RewardTrackItem.fragments.progression}
  `,

  rewards: gql`
    fragment RewardTrackRewards on RewardReward {
      id
      ...RewardTrackItemRewards
    }

    ${RewardTrackItem.fragments.rewards}
  `,
};

interface Props {
  levelConfigs: RewardTrackLevelConfigFragment[];
  progression: RewardTrackSeasonProgressionFragment;
  rewards?: RewardTrackRewardsFragment[];
  remainingDailyXpBoost: number;
}

export function RewardTrack({
  levelConfigs,
  progression,
  rewards,
  remainingDailyXpBoost,
}: Props) {
  const [itemCount, setItemCount] = useState<number>(2);
  const measureWrapper = useRef<HTMLDivElement>(null);
  const [initialIndex, setInitialIndex] = useState<number>(0);
  const previousSeasonId = useRef<Nullable<string>>(null);

  useEffect(() => {
    if (previousSeasonId.current === progression.seasonId) {
      return;
    }

    previousSeasonId.current = progression.seasonId;
    setInitialIndex(resolveInitialIndex(progression, rewards));
  }, [progression, rewards]);

  const {
    scrollContainerRef,
    nextScrollRef,
    prevScrollRef,
    targetIndices,
    isDragScrolling,
    visibleIndices,
    scrollForwards,
    scrollBackwards,
    startDragScroll,
    endDragScroll,
    dragScroll,
  } = useRewardTrackNavigation({
    initialIndex,
    itemCount,
    totalCount: levelConfigs.length,
  });

  useEffect(() => {
    if (!measureWrapper.current) {
      return;
    }

    const calcItemCount = () => {
      if (!measureWrapper.current) {
        return;
      }

      const scrollButtonWidth = measureWrapper.current.children[0].clientWidth;
      const itemWidth = measureWrapper.current.children[1].clientWidth;
      const spaceForItems = measureWrapper.current.clientWidth - scrollButtonWidth * 2;

      const count = Math.floor(spaceForItems / itemWidth);
      setItemCount(count);
    };

    const observer = new ResizeObserver(() => {
      calcItemCount();
    });

    observer.observe(measureWrapper.current);
  }, []);

  const firstShownMainRewardIndex = visibleIndices[0] - 1;
  const lastShownMainRewardIndex = visibleIndices[visibleIndices.length - 1] + 1;
  const disableBackwardsButton = visibleIndices[0] <= 0;
  const disableForwardsButton =
    visibleIndices[visibleIndices.length - 1] >= levelConfigs.length - 1;

  return (
    <>
      <section className={styles.seasonsActionsAndTrackWrapper}>
        <div className={styles.rewardsActionsWrapper}>
          <div className={styles.rewardsNavigationWrapper}>
            <span>
              {progression.level < levelConfigs.length ? (
                <>
                  <strong className={styles.xpToUnlock}>
                    {progression.nextLevelThreshold - progression.xpAmount} XP{' '}
                  </strong>
                  to next rank
                </>
              ) : (
                <span>Max level reached</span>
              )}
            </span>

            <div className={styles.navigationButtonsWrapper}>
              <IconButton
                icon={CoreAssets.Icons.ChevronLeft}
                isDisabled={disableBackwardsButton}
                label="Previous"
                size="sm"
                onClick={scrollBackwards}
              />
              <IconButton
                icon={CoreAssets.Icons.ChevronRight}
                isDisabled={disableForwardsButton}
                label="Next"
                size="sm"
                onClick={scrollForwards}
              />
            </div>
          </div>
        </div>

        <section className={styles.rewardsTrackWrapper}>
          <div className={styles.rewardsTrackInnerWrapper}>
            <div
              className={styles.measureWrapper}
              ref={measureWrapper}
            >
              <div className={styles.buttonMeasure} />
              <div className={styles.itemMeasure} />
            </div>

            <div className={styles.trackWrapper}>
              <div className={styles.itemsWrapper}>
                {/* eslint-disable jsx-a11y/no-static-element-interactions */}
                <div
                  className={classNames(styles.items, {
                    [styles.snap]: !isDragScrolling,
                  })}
                  ref={scrollContainerRef}
                  style={
                    {
                      '--reward-track-item-count': itemCount,
                    } as CSSProperties
                  }
                  onMouseDown={startDragScroll}
                  onMouseLeave={endDragScroll}
                  onMouseMove={dragScroll}
                  onMouseUp={endDragScroll}
                >
                  {levelConfigs?.map((value, index) => (
                    <div
                      className={styles.item}
                      data-element-index={index}
                      key={index}
                      ref={
                        index === targetIndices.backwards ||
                        index === targetIndices.forwards
                          ? index === targetIndices.backwards
                            ? prevScrollRef
                            : nextScrollRef
                          : null
                      }
                    >
                      <RewardTrackItem
                        level={value}
                        previousThreshold={levelConfigs[index - 1]?.threshold ?? 0}
                        progression={progression}
                        remainingDailyXpBoost={remainingDailyXpBoost}
                        rewards={rewards}
                        showMainReward={
                          index >= firstShownMainRewardIndex &&
                          index <= lastShownMainRewardIndex
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

RewardTrack.Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <LoadingSkeleton height={350} />
    </div>
  );
};
