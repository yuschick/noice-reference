import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Breakpoint, CommonUtils, IconButton } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './Header.module.css';
import { Wallet } from './Wallet';

import { useTimedAdsSounds } from '@common/placement/hooks/useTimedAdsSounds.hook';
import { TimedAdsHeaderRewardsFragment } from '@gen';

interface Props {
  rewards: TimedAdsHeaderRewardsFragment[];
  showRewardCount: boolean;
  showWallet: boolean;
  hasClaimedRewards: boolean;
  onClose(): void;
}

export function Header({
  showRewardCount,
  showWallet,
  hasClaimedRewards,
  onClose,
}: Props) {
  const { playHoverSound } = useTimedAdsSounds();

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.rewardCount]: showRewardCount,
      })}
    >
      {showRewardCount && <h1 className={styles.rewardTitle}>Rewards</h1>}

      <div className={styles.rightWrapper}>
        {showWallet && (
          <Breakpoint query={`(min-width: ${CommonUtils.getRem(800)})`}>
            <Wallet showUpdateAnimation={hasClaimedRewards} />
          </Breakpoint>
        )}
        <IconButton
          icon={CoreAssets.Icons.Close}
          label="Close"
          size="sm"
          onClick={onClose}
          onMouseEnter={playHoverSound}
        />
      </div>
    </div>
  );
}

Header.fragments = {
  entry: gql`
    fragment TimedAdsHeaderRewards on AdsRewardDescription {
      readyAt
    }

    fragment TimedAdsHeader on AdsGetPlacementResponse {
      placementId
    }
  `,
};
