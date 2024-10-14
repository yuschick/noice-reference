import { gql } from '@apollo/client';
import { Button } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';

import { useSubscriptionsLinks } from '../../hooks/useSubscriptionsLinks.hook';
import { MonetizationSubscriptionsHeader } from '../../MonetizationSubscriptionsHeader/MonetizationSubscriptionsHeader';

import styles from './Subscribers.module.css';

import { useChannelContext } from '@common/channel';
import { LayoutBox } from '@common/layout';
import {
  BadgeBadgeType,
  MonetizationSubscribersQuery,
  useMonetizationSubscribersCountQuery,
  useMonetizationSubscribersQuery,
} from '@gen';

gql`
  query MonetizationSubscribers($channelId: ID!, $cursor: String) {
    channelSubscriptions(
      channelId: $channelId
      cursor: { first: 16, after: $cursor }
      filters: [{ state: STATE_ACTIVE }, { state: STATE_CANCELLED }]
    ) {
      subscriptions {
        id
        activatedAt
        user {
          userId
          userTag
          badges(channel_id: $channelId) {
            ...UserBadge
          }
        }
      }

      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query MonetizationSubscribersCount($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscriberCount
    }
  }
`;

const getSubscriptionBadge = (
  user: NonNullable<
    MonetizationSubscribersQuery['channelSubscriptions']
  >['subscriptions'][0]['user'],
) => {
  return user.badges.find((badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber);
};

export function Subscribers() {
  const { channelId } = useChannelContext();
  const { toSubscriptionsSettings } = useSubscriptionsLinks();

  const { data, fetchMore } = useMonetizationSubscribersQuery({
    variables: {
      channelId,
    },
  });

  const { data: channelData } = useMonetizationSubscribersCountQuery({
    variables: {
      channelId,
    },
  });
  const subscriptionCount = channelData?.channel?.subscriberCount;

  return (
    <>
      <MonetizationSubscriptionsHeader
        description="List of your channel's active subscribers."
        title="Subscribers"
        to={toSubscriptionsSettings}
      />

      <LayoutBox>
        <div className={styles.subscribersCount}>
          {subscriptionCount} subscriber{subscriptionCount === 1 ? '' : 's'}
        </div>

        <div className={styles.subscribers}>
          <div className={classNames(styles.subscriberRow, styles.header)}>
            <span
              className={classNames(
                styles.subscribersLabel,
                styles.subscribersSubscriber,
              )}
            >
              Subscriber
            </span>
            <span className={classNames(styles.subscribersLabel, styles.subscribersDate)}>
              Subscribed since
            </span>
          </div>

          {data?.channelSubscriptions?.subscriptions.map(({ id, user, activatedAt }) => {
            const badge = getSubscriptionBadge(user);

            return (
              <div
                className={classNames(styles.subscriberRow, styles.content)}
                key={id}
              >
                <span className={styles.subscribersBadge}>
                  {badge && (
                    <UserBadge
                      badge={badge}
                      badgeSize={20}
                    />
                  )}
                </span>

                <span className={styles.subscribersSubscriber}>{user.userTag}</span>

                {!!activatedAt && (
                  <time
                    className={styles.subscribersDate}
                    dateTime={DateAndTimeUtils.getHTMLAttributeTime(activatedAt)}
                  >
                    {DateAndTimeUtils.getShortDate(activatedAt)}
                  </time>
                )}
              </div>
            );
          })}
        </div>

        {data?.channelSubscriptions?.pageInfo.hasNextPage && (
          <div className={styles.pageInfo}>
            <Button
              fit="content"
              level="secondary"
              size="xs"
              onClick={() =>
                fetchMore({
                  variables: { cursor: data?.channelSubscriptions?.pageInfo.endCursor },
                })
              }
            >
              Show more
            </Button>
          </div>
        )}
      </LayoutBox>
    </>
  );
}
