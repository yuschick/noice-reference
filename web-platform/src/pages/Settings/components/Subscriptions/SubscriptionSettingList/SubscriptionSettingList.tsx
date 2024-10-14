import { gql } from '@apollo/client';
import {
  Button,
  LoadingSpinner,
  Tabs,
  useAnalytics,
  useAuthenticatedUser,
  useTabs,
} from '@noice-com/common-ui';
import { MouseEvent, useCallback } from 'react';

import { SettingsGroup } from '../../SettingsGroup';

import styles from './SubscriptionSettingList.module.css';
import { SubscriptionsList } from './SubscriptionsList/SubscriptionsList';

import { useSubscriptionPaymentMethodDialog } from '@common/subscription';
import {
  useSubscriptionsSettingInactiveListQuery,
  useSubscriptionsSettingListQuery,
} from '@gen';

gql`
  query SubscriptionsSettingList($userId: ID!, $cursor: String) {
    userChannelSubscriptions(
      userId: $userId
      filters: [{ state: STATE_ACTIVE }, { state: STATE_CANCELLED }]
      cursor: { first: 5, after: $cursor }
    ) {
      subscriptions {
        id
        ...SubscriptionSettingItemSubscription
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

gql`
  query SubscriptionsSettingInactiveList($userId: ID!, $cursor: String) {
    userChannelSubscriptions(
      userId: $userId
      filters: [{ state: STATE_EXPIRED }]
      cursor: { first: 5, after: $cursor }
    ) {
      subscriptions {
        id
        ...SubscriptionSettingItemSubscription
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export function SubscriptionSettingList() {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const { userId } = useAuthenticatedUser();

  const { showModal: showPaymentMethodDialog } = useSubscriptionPaymentMethodDialog({});

  const onManagePaymentMethodClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      trackButtonClickEventOnMouseClick(event, 'subscription-setting-payment-methods');
      showPaymentMethodDialog();
    },
    [showPaymentMethodDialog, trackButtonClickEventOnMouseClick],
  );

  const {
    data: activeSubscriptionData,
    loading: loadingActiveSubscriptions,
    fetchMore: fetchMoreActiveSubscriptions,
  } = useSubscriptionsSettingListQuery({
    variables: { userId },
  });

  const { data: inactiveSubscriptionData, fetchMore: fetchMoreInactiveSubscriptions } =
    useSubscriptionsSettingInactiveListQuery({
      variables: { userId },
    });

  const tabs = useTabs({ variant: 'page', loading: loadingActiveSubscriptions });

  if (!activeSubscriptionData && loadingActiveSubscriptions) {
    return <LoadingSpinner />;
  }

  const activeSubscriptions =
    activeSubscriptionData?.userChannelSubscriptions?.subscriptions ?? [];
  const hasNextPageOfActiveSubscriptions =
    activeSubscriptionData?.userChannelSubscriptions?.pageInfo?.hasNextPage ?? false;

  const inactiveSubscriptions =
    inactiveSubscriptionData?.userChannelSubscriptions?.subscriptions ?? [];
  const hasNextPageOfInactiveSubscriptions =
    inactiveSubscriptionData?.userChannelSubscriptions?.pageInfo.hasNextPage ?? false;

  const onLoadMoreActiveSubscriptions = () => {
    const cursor = activeSubscriptionData?.userChannelSubscriptions?.pageInfo.endCursor;

    fetchMoreActiveSubscriptions({
      variables: {
        userId,
        cursor,
      },
    });
  };

  const onLoadMoreInactiveSubscriptions = () => {
    const cursor = activeSubscriptionData?.userChannelSubscriptions?.pageInfo.endCursor;

    fetchMoreInactiveSubscriptions({
      variables: {
        userId,
        cursor,
      },
    });
  };

  return (
    <div className={styles.content}>
      {!!activeSubscriptions.length && (
        <SettingsGroup
          description="Manage your subscription payment method"
          title="Payment method"
        >
          <SettingsGroup.Action>
            <Button
              level="secondary"
              size="sm"
              onClick={onManagePaymentMethodClick}
            >
              Manage payment method
            </Button>
          </SettingsGroup.Action>
        </SettingsGroup>
      )}

      <Tabs
        store={tabs}
        title="Subscriptions settings tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Active</Tabs.TabButton>
          <Tabs.TabButton>Inactive</Tabs.TabButton>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel lazyBehavior="keepMounted">
            {!!activeSubscriptions.length && (
              <div className={styles.info}>
                Here you can see a list of channels that you have an active subscription.
              </div>
            )}
            <SubscriptionsList
              hasNextPage={hasNextPageOfActiveSubscriptions}
              noSubscriptionsMessage={{
                title: 'You have no active channel subscriptions',
                description:
                  'By subscribing to a channel you support and help the channel owner keep doing what they’re doing on Noice.',
              }}
              subscriptions={activeSubscriptions}
              onLoadMoreSubscriptions={onLoadMoreActiveSubscriptions}
            ></SubscriptionsList>
          </Tabs.Panel>
          <Tabs.Panel lazyBehavior="keepMounted">
            {!!inactiveSubscriptions.length && (
              <div className={styles.info}>Channel subscriptions that have ended.</div>
            )}
            <SubscriptionsList
              hasNextPage={hasNextPageOfInactiveSubscriptions}
              noSubscriptionsMessage={{
                description: 'You have no expired subscriptions.',
              }}
              subscriptions={inactiveSubscriptions}
              onLoadMoreSubscriptions={onLoadMoreInactiveSubscriptions}
            ></SubscriptionsList>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}
