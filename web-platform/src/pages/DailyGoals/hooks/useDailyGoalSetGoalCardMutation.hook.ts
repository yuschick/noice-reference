import { MutationTuple, gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  DailyGoalSetGoalCardHookMutation,
  DailyGoalSetGoalCardHookMutationVariables,
  GoalCardGoalCardSlot,
  useDailyGoalSetGoalCardHookMutation,
} from '@gen';

gql`
  mutation DailyGoalSetGoalCardHook($slotId: ID!, $cardId: ID!) {
    setGoalCardSlot(goalCardSlotId: $slotId, goalCardId: $cardId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useDailyGoalSetGoalCardMutation({
  onCompleted,
}: Props): MutationTuple<
  DailyGoalSetGoalCardHookMutation,
  DailyGoalSetGoalCardHookMutationVariables
> {
  return useDailyGoalSetGoalCardHookMutation({
    onCompleted,
    update(cache, _, { variables }) {
      const slotId = variables?.slotId;
      const cardId = variables?.cardId;

      if (!slotId || !cardId) {
        return;
      }

      cache.updateFragment<DeepPartial<GoalCardGoalCardSlot>>(
        {
          id: cache.identify({ id: slotId, __typename: 'GoalCardGoalCardSlot' }),
          fragment: gql`
            fragment SetCard on GoalCardGoalCardSlot {
              id
              goalCard {
                id
              }
              progress {
                value
              }
              cardOptions {
                id
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          goalCard: { id: cardId, __typename: 'GoalCardGoalCard' },
          progress: { value: 0, __typename: 'GoalCardGoalCardSlotProgress' },
          cardOptions: null,
        }),
      );
    },
  });
}
