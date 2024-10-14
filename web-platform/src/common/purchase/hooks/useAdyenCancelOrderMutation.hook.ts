import { MutationHookOptions, gql } from '@apollo/client';

import {
  CancelAdyenOrderMutation,
  CancelAdyenOrderMutationVariables,
  useCancelAdyenOrderMutation,
} from '@gen';

gql`
  mutation CancelAdyenOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      emptyTypeWorkaround
    }
  }
`;

export function useAdyenCancelOrderMutation(
  baseOptions?: Omit<
    MutationHookOptions<CancelAdyenOrderMutation, CancelAdyenOrderMutationVariables>,
    'update'
  >,
) {
  return useCancelAdyenOrderMutation({
    ...baseOptions,
  });
}
