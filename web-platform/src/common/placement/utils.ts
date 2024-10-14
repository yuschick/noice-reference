import { gql } from '@apollo/client';

import { AvailableRewardsRewardFragment } from '@gen';

gql`
  fragment AvailableRewardsReward on AdsRewardDescription {
    readyAt
  }
`;

export const filterAvailableRewards = (rewards: AvailableRewardsRewardFragment[]) =>
  rewards.filter((reward) => new Date(reward.readyAt).getTime() < Date.now());
