import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useState } from 'react';
import { useParams } from 'react-router';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { Pill } from '@common/text';
import {
  SubscriptionChannelSubscriptionState,
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
  useUserSubscriptionsQuery,
} from '@gen';

gql`
  query UserSubscriptions(
    $userId: ID!
    $cursor: APICursorInput
    $filters: [SubscriptionListUserChannelSubscriptionsRequestFilterInput!]
  ) {
    userChannelSubscriptions(userId: $userId, cursor: $cursor, filters: $filters) {
      subscriptions {
        cancelledAt
        channel {
          id
          name
        }
        createdAt
        expiresAt
        id
        paymentFailedAt
        renewedAt
        state
        tier
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
`;

function getStateLabel(state: SubscriptionChannelSubscriptionState) {
  switch (state) {
    case SubscriptionChannelSubscriptionState.StateActive:
      return (
        <Pill
          text="Active"
          type="positive"
        />
      );
    case SubscriptionChannelSubscriptionState.StateCancelled:
      return (
        <Pill
          text="Cancelled"
          type="warning"
        />
      );
    case SubscriptionChannelSubscriptionState.StateExpired:
    case SubscriptionChannelSubscriptionState.StateTerminated:
      return (
        <Pill
          text="Expired"
          type="warning"
        />
      );
    case SubscriptionChannelSubscriptionState.StatePending:
      return (
        <Pill
          text="Pending"
          type="info"
        />
      );
    default:
      return '-';
  }
}

export function UserSubscriptions() {
  const [showPaymentFailed, setShowPaymentFailed] = useState<boolean>(false);

  const { userId } = useParams();
  const userSubscriptionsQueryVariables = {
    filters: [{ paymentFailed: showPaymentFailed }],
  };
  const dataTransform = (data: UserSubscriptionsQuery) => {
    return (
      data?.userChannelSubscriptions?.subscriptions.map((subscription) =>
        ((subscription) => {
          const fields = {
            channel: subscription.channel.name,
            tier: subscription.tier,
            state: getStateLabel(subscription.state),
            createdAt: `${DateAndTimeUtils.getShortDate(subscription.createdAt)}`,
            expiresAt: subscription.expiresAt
              ? `${DateAndTimeUtils.getShortDate(subscription.expiresAt)}`
              : '-',
            renewedAt: subscription.renewedAt
              ? `${DateAndTimeUtils.getShortDate(subscription.renewedAt)}`
              : '-',
            cancelledAt: subscription.cancelledAt
              ? `${DateAndTimeUtils.getShortDate(subscription.cancelledAt)}`
              : '-',
            paymentFailedAt: subscription.paymentFailedAt
              ? `${DateAndTimeUtils.getShortDate(subscription.paymentFailedAt)}`
              : '-',
          };

          return fields;
        })(subscription),
      ) ?? []
    );
  };

  const getPageInfo = (data: UserSubscriptionsQuery) =>
    data.userChannelSubscriptions?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<
      UserSubscriptionsQuery,
      UserSubscriptionsQueryVariables
    >
      actions={[
        {
          onChange: () => setShowPaymentFailed(!showPaymentFailed),
          type: 'toggle',
          label: 'Show failed payments',
          value: showPaymentFailed,
        },
      ]}
      caption="Subscriptions"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useUserSubscriptionsQuery}
      idField="channel"
      minifyCells={['tier']}
      skip={!userId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ userId: userId!, ...userSubscriptionsQueryVariables }}
      includeIdField
    />
  );
}
