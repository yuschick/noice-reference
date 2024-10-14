import { MutationTuple, gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  DailyGoalClaimRewardHookMutation,
  DailyGoalClaimRewardHookMutationVariables,
  GoalCardGoalCardSlot,
  useDailyGoalClaimRewardHookMutation,
} from '@gen';

gql`
  mutation DailyGoalClaimRewardHook($rewardId: ID) {
    claimReward(rewardId: $rewardId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  slotId: string;
  rewardId?: string;
  onCompleted?: () => void;
}

export function useDailyGoalClaimRewardMutation({
  slotId,
  rewardId,
  onCompleted,
}: Props): MutationTuple<
  DailyGoalClaimRewardHookMutation,
  DailyGoalClaimRewardHookMutationVariables
> {
  return useDailyGoalClaimRewardHookMutation({
    variables: rewardId ? { rewardId } : undefined,
    onCompleted,
    update(cache) {
      cache.updateFragment<DeepPartial<GoalCardGoalCardSlot>>(
        {
          id: cache.identify({
            id: slotId,
            __typename: 'GoalCardGoalCardSlot',
          }),
          fragment: gql`
            fragment RewardUpdateGoalCardSlot on GoalCardGoalCardSlot {
              id
              reward {
                id
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          reward: null,
        }),
      );
    },
  });
}
