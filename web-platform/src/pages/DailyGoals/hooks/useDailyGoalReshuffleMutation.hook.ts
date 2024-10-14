import { MutationTuple, gql } from '@apollo/client';

import {
  DailyGoalReshuffleHookMutation,
  DailyGoalReshuffleHookMutationVariables,
  useDailyGoalReshuffleHookMutation,
} from '@gen';

gql`
  mutation DailyGoalReshuffleHook($slotId: ID!) {
    reshuffleGoalCardSlot(slotId: $slotId) {
      cardOptions {
        id
      }
    }
  }
`;

interface Props {
  slotId?: string;
  onCompleted?: () => void;
}

export function useDailyGoalReshuffleMutation({
  slotId,
  onCompleted,
}: Props): MutationTuple<
  DailyGoalReshuffleHookMutation,
  DailyGoalReshuffleHookMutationVariables
> {
  return useDailyGoalReshuffleHookMutation({
    variables: slotId ? { slotId } : undefined,
    onCompleted,
    update(cache, { data }, { variables }) {
      const slotId = variables?.slotId;

      if (!slotId) {
        return;
      }

      cache.modify({
        fields: {
          goalCardSlotOptions(existing, { storeFieldName, toReference }) {
            if (!storeFieldName.includes(slotId)) {
              return existing;
            }

            return {
              ...existing,
              cardOptions: data?.reshuffleGoalCardSlot?.cardOptions.map((card) =>
                toReference({
                  ...card,
                  __typename: 'GoalCardGoalCard',
                }),
              ),
            };
          },
        },
      });
    },
  });
}
