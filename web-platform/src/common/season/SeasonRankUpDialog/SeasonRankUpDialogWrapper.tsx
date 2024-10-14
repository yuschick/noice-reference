import { gql } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientRankUpDialogType } from '@noice-com/schemas/analytics/analytics.pb';
import { useMemo } from 'react';

import { useUnclaimedSeasonRewards } from './hooks';
import { SeasonRankUpDialog } from './SeasonRankUpDialog';

import { useSeasonRankUpDialogClaimRewardMutation } from '@gen';

gql`
  mutation SeasonRankUpDialogClaimReward($rewardId: ID) {
    claimReward(rewardId: $rewardId) {
      emptyTypeWorkaround
    }
  }
`;

export function SeasonRankUpDialogWrapper({
  onClose: onCloseProp,
  context,
}: {
  onClose?: () => void;
  context: AnalyticsEventClientRankUpDialogType;
}) {
  const { unclaimedSeasonRewards, loading } = useUnclaimedSeasonRewards();
  const { trackEvent } = useAnalytics();

  const [claimReward] = useSeasonRankUpDialogClaimRewardMutation();

  const claimRewards = async (rewardIds: string[]) => {
    await Promise.all(
      rewardIds.map((rewardId) =>
        claimReward({
          variables: {
            rewardId,
          },
        }),
      ),
    );
  };

  const onClose = () => {
    onCloseProp?.();
    claimRewards(unclaimedSeasonRewards.map((reward) => reward.id));
    trackEvent({
      clientRankUpDialogRewardsCollected: {
        location: context,
        rewardsAmount: unclaimedSeasonRewards.length,
      },
    });
  };

  const maxLevel = useMemo(
    () =>
      unclaimedSeasonRewards.reduce(
        (max, cur) =>
          cur.reason.reason?.__typename === 'ReasonReasonLevelUp'
            ? Math.max(max, cur.reason.reason.level)
            : 0,
        0,
      ),
    [unclaimedSeasonRewards],
  );

  if (loading || !unclaimedSeasonRewards.length) {
    return null;
  }

  return (
    <SeasonRankUpDialog
      context={context}
      level={maxLevel}
      rewards={unclaimedSeasonRewards}
      onClose={onClose}
    />
  );
}
