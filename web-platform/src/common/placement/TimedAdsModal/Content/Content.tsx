import { gql } from '@apollo/client';
import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { ClaimedReward } from './ClaimedReward/ClaimedReward';
import { Selection } from './Selection/Selection';

import { WatchingAdBackground } from '@common/placement/TimedAdsModal/Content/WatchingAdBackground/WatchingAdBackground';
import { TimedAdsContentFragment } from '@gen';

export enum ContentState {
  Selection,
  WatchingAd,
  ClaimedReward,
}

interface Props {
  placement: TimedAdsContentFragment;
  rewardedWalletTransactions: Nullable<Operation[]>;
  onCompleted(): void;
  onStateChanged(state: ContentState): void;
  onRewardPlacement(): void;
}

export function Content({
  placement,
  rewardedWalletTransactions,
  onCompleted,
  onStateChanged,
  onRewardPlacement,
}: Props) {
  const [contentState, setContentState] = useState<ContentState>(ContentState.Selection);
  const [rewardToClaim, setRewardToClaim] = useState<
    TimedAdsContentFragment['rewards'][0]
  >(placement.rewards[0]);
  const [hasAdBeenWatched, setHasAdBeenWatched] = useState(false);

  const giveReward = (isAdWatched: boolean) => {
    onRewardPlacement();
    setHasAdBeenWatched(isAdWatched);
    setContentState(ContentState.ClaimedReward);
    onStateChanged(ContentState.ClaimedReward);
    setRewardToClaim(placement.rewards[0]);
  };

  return (
    <>
      {contentState === ContentState.Selection && placement.rewards && (
        <Selection
          giveReward={giveReward}
          rewards={placement.rewards}
          onStartWatchingAd={() => {
            setContentState(ContentState.WatchingAd);
            onStateChanged(ContentState.WatchingAd);
          }}
        />
      )}
      {contentState === ContentState.WatchingAd && (
        <WatchingAdBackground
          giveReward={giveReward}
          onAdDismissed={onCompleted}
        />
      )}
      {contentState === ContentState.ClaimedReward && (
        <ClaimedReward
          hasAdBeenWatched={hasAdBeenWatched}
          reward={rewardToClaim}
          rewardedWalletTransactions={rewardedWalletTransactions}
          onCompleted={onCompleted}
          onRewardPlacement={onRewardPlacement}
        />
      )}
    </>
  );
}

Content.fragments = {
  entry: gql`
    fragment TimedAdsContentReward on AdsRewardDescription {
      ...TimedAdsSelectionRewards
      ...TimedAdsVideoReward
    }

    fragment TimedAdsContent on AdsGetPlacementResponse {
      rewards {
        ...TimedAdsContentReward
      }
    }

    ${Selection.fragments.entry}
    ${ClaimedReward.fragments.entry}
  `,
};
