import { RewardTrackRewardsFragment, RewardTrackSeasonProgressionFragment } from '@gen';

export const resolveInitialIndex = (
  progression: RewardTrackSeasonProgressionFragment,
  rewards?: RewardTrackRewardsFragment[],
) => {
  // Find the first unclaimed level up reward for the current seasonId
  const firstReward = rewards?.find(
    (reward) =>
      reward.reason.reason?.__typename === 'ReasonReasonLevelUp' &&
      reward.reason.reason.seasonId === progression.seasonId,
  );

  // If a unclaimed reward was found then set the initialIndex to be the one before that
  if (firstReward && firstReward.reason.reason?.__typename === 'ReasonReasonLevelUp') {
    const rewardLevel = firstReward.reason.reason.level;

    return rewardLevel > 1 ? rewardLevel - 2 : 0;
  }

  // Otherwise set the initial index to one before your current level
  return progression.level > 1 ? progression.level - 1 : 0;
};
