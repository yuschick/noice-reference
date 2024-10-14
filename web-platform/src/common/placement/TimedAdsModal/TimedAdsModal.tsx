import { gql } from '@apollo/client';
import { Breakpoint, CommonUtils, FullScreenModal } from '@noice-com/common-ui';
import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { Content, ContentState } from './Content/Content';
import { Header } from './Header/Header';
import { Wallet } from './Header/Wallet';
import styles from './TimedAdsModal.module.css';

import { TimedAdsModalAdFragment } from '@gen';

interface Props {
  placement: TimedAdsModalAdFragment;
  rewardedWalletTransactions: Nullable<Operation[]>;
  onClose(): void;
  onRewardPlacement(): void;
  onWatchedAd(): void;
}

export function TimedAdsModal({
  placement,
  rewardedWalletTransactions,
  onClose,
  onRewardPlacement,
  onWatchedAd,
}: Props) {
  const [showRewardCount, setShowRewardCount] = useState<boolean>(true);
  const [showWallet, setShowWallet] = useState<boolean>(true);

  const handleContentStateChange = (state: ContentState) => {
    setShowRewardCount(state === ContentState.Selection);
    setShowWallet(state === ContentState.Selection);

    if (state === ContentState.ClaimedReward) {
      onWatchedAd();
    }
  };

  return (
    <FullScreenModal ariaLabel="Rewarded Ads">
      <div className={styles.fullscreen}>
        <div className={styles.wrapper}>
          <Header
            hasClaimedRewards={!!rewardedWalletTransactions}
            rewards={placement.rewards}
            showRewardCount={showRewardCount}
            showWallet={showWallet}
            onClose={onClose}
          />
          <div className={styles.contentWrapper}>
            {showWallet && (
              <Breakpoint query={`(max-width: ${CommonUtils.getRem(799)})`}>
                <Wallet showUpdateAnimation={!!rewardedWalletTransactions} />
              </Breakpoint>
            )}
            <Content
              placement={placement}
              rewardedWalletTransactions={rewardedWalletTransactions}
              onCompleted={onClose}
              onRewardPlacement={onRewardPlacement}
              onStateChanged={handleContentStateChange}
            />
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
}

TimedAdsModal.fragments = {
  entry: gql`
    fragment TimedAdsModalAdReward on AdsRewardDescription {
      ...TimedAdsHeaderRewards
      ...TimedAdsContentReward
    }

    fragment TimedAdsModalAd on AdsGetPlacementResponse {
      placementId
      rewards {
        ...TimedAdsModalAdReward
      }

      ...TimedAdsContent
    }

    ${Header.fragments.entry}
    ${Content.fragments.entry}
  `,
};
