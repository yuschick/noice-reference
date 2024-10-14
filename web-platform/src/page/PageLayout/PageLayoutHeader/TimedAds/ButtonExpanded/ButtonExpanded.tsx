import { CoreAssets } from '@noice-com/assets-core';
import { Icon, VisuallyHidden } from '@noice-com/common-ui';

import styles from './ButtonExpanded.module.css';

import { useTimedAdsSounds } from '@common/placement';

export interface Props {
  numSegments: number;
  adsExist: boolean;
  onOpen: () => void;
}

export function ButtonExpanded({ numSegments, onOpen, adsExist }: Props) {
  const { playHoverSound } = useTimedAdsSounds();

  return (
    <button
      className={styles.rewardsExpandedWrapper}
      data-ftue-anchor="adButton"
      onClick={onOpen}
      onMouseEnter={playHoverSound}
    >
      {adsExist && (
        <>
          <Icon
            className={styles.rewardsIcon}
            icon={CoreAssets.Icons.RewardBox}
          />
          <span className={styles.rewardsCount}>
            {numSegments} Rewards <VisuallyHidden>available</VisuallyHidden>
          </span>
        </>
      )}
    </button>
  );
}
