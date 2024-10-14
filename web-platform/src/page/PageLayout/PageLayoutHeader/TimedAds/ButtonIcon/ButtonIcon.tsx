import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './ButtonIcon.module.css';
import { useButtonIconSegments } from './hooks/useButtonIconSegments.hook';
import { EMPTY_SEGMENT_STROKE_WIDTH, SEGMENT_STROKE_WIDTH } from './types';

import { useTimedAdsSounds } from '@common/placement';

export interface Props {
  adsExist: boolean;
  maxSegments: number;
  numSegments: number;
  onOpen: () => void;
}

export function ButtonIcon({ maxSegments, numSegments, onOpen, adsExist }: Props) {
  const { playHoverSound } = useTimedAdsSounds();
  const { segments, emptySegment } = useButtonIconSegments({
    maxSegments,
    numSegments,
  });

  const showEmptyPath = maxSegments !== numSegments;

  return (
    <button
      aria-label={`You have ${numSegments} available rewards`}
      className={styles.button}
      data-ftue-anchor="adButton"
      onClick={onOpen}
      onMouseEnter={playHoverSound}
    >
      {adsExist && (
        <div
          className={classNames(styles.wrapper, {
            [styles.adAvailable]: numSegments > 0,
          })}
        >
          <Icon
            className={styles.icon}
            icon={CoreAssets.Icons.RewardBox}
          />
          <svg
            className={styles.circleSvg}
            height="100"
            viewBox="0 0 100 100"
            width="100"
          >
            {segments.map((segment, index) => {
              return (
                <path
                  className={styles.circle}
                  d={segment}
                  fill="none"
                  key={`seg_${index}`}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={SEGMENT_STROKE_WIDTH}
                />
              );
            })}
            {showEmptyPath && (
              <path
                className={styles.emptyCircle}
                d={emptySegment}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={EMPTY_SEGMENT_STROKE_WIDTH}
              />
            )}
          </svg>
        </div>
      )}
    </button>
  );
}
