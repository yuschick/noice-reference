import { CoreAssets } from '@noice-com/assets-core';
import {
  Countdown,
  Icon,
  LoadingSkeleton,
  useBooleanFeatureFlag,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { useHomeSounds } from '../../../hooks/useHomeSounds';

import styles from './DailyGoalWidget.module.css';

import { Routes } from '@common/route';

export interface WidgetProps {
  setGoals: number;
  completed: number;
  total: number;
  unclaimed: number;
  resetTime: Date;
}

export function DailyGoalWidget({
  setGoals,
  completed,
  total,
  unclaimed = -1,
  resetTime,
}: WidgetProps) {
  const { playDailyGoalsWidgetHoverSound, playDailyGoalsWidgetClickSound } =
    useHomeSounds();

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  return (
    <Link
      aria-label={
        setGoals > 0
          ? `${completed} of ${total} daily goals completed ${
              unclaimed > 0 ? 'You have unclaimed rewards' : ''
            }`
          : 'Select your daily goals'
      }
      className={classNames(styles.dailyGoalsWrapper, {
        [styles.tighterHomePage]: tighterHomePage,
      })}
      to={Routes.DailyGoals}
      onClick={playDailyGoalsWidgetClickSound}
      onMouseEnter={playDailyGoalsWidgetHoverSound}
    >
      {setGoals ? (
        <>
          <div className={styles.dailyGoalsProgressCount}>
            <span className={styles.dailyGoalsCompletedCount}>{completed}</span>
            &nbsp;/&nbsp;
            {setGoals}
          </div>

          <div className={styles.activeGoalsWrapper}>
            <span>Daily goals completed</span>
            {unclaimed ? (
              <span className={styles.unclaimedRewards}>
                {unclaimed} unclaimed rewards
              </span>
            ) : (
              <span className={styles.resetsInWrapper}>
                Resets in{' '}
                <Countdown
                  className={styles.resetsInTime}
                  label="Daily goals reset"
                  target={resetTime}
                />
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <Icon
            icon={CoreAssets.Icons.DailyGoals}
            size={tighterHomePage ? 24 : 32}
          />

          <span>Select your daily goals</span>
        </>
      )}
      <Icon
        icon={CoreAssets.Icons.ChevronRight}
        size={24}
      />
    </Link>
  );
}

DailyGoalWidget.Loading = () => <LoadingSkeleton className={styles.loadingSkeleton} />;
