import { gql } from '@apollo/client';
import { Image, useAuthenticatedUser, CommonUtils } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useId } from 'react';

import styles from './ChargebeeSubscriptionCancellationModalContent.module.css';

import {
  useActiveSubscriptionMenuUserBadgeQuery,
  BadgeBadgeType,
  ChargebeeSubscriptionCancellationModalContentChannelFragment,
  ChargebeeSubscriptionCancellationModalContentSubscriptionFragment,
} from '@gen';

gql`
  query ActiveSubscriptionMenuUserBadge($userId: ID!, $channelId: ID!) {
    profile(userId: $userId) {
      userId
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }

  fragment ChargebeeSubscriptionCancellationModalContentChannel on ChannelChannel {
    id
    ...SubscriptionGetChannelEmojisChannel
  }

  fragment ChargebeeSubscriptionCancellationModalContentSubscription on SubscriptionChannelSubscription {
    expiresAt
  }
`;

interface Props {
  channel: ChargebeeSubscriptionCancellationModalContentChannelFragment;
  subscription: ChargebeeSubscriptionCancellationModalContentSubscriptionFragment;
}

export function ChargebeeSubscriptionCancellationModalContent({
  channel,
  subscription,
}: Props) {
  const { userId } = useAuthenticatedUser();
  const id = useId();

  const { id: channelId } = channel;
  const { expiresAt } = subscription;

  const emojis = CommonUtils.getChannelEmojis(channel);

  const { data } = useActiveSubscriptionMenuUserBadgeQuery({
    variables: {
      channelId,
      userId,
    },
    fetchPolicy: 'cache-first',
  });

  const subscriberBadge = data?.profile?.badges?.find(
    (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
  );

  return (
    <section className={styles.perkSection}>
      <p className={styles.descriptionSection}>
        By canceling the subscription you will lose the following perks at the end of your
        current subscription on{' '}
        {!!expiresAt && (
          <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(expiresAt)}>
            {DateAndTimeUtils.getShortDate(expiresAt)}
          </time>
        )}
      </p>

      <div className={styles.perkWrapper}>
        {!!emojis.length && (
          <div>
            <span
              className={styles.perkListTitle}
              id={`emoji-title-${id}`}
            >
              {emojis.length} Custom channel emote{emojis.length === 1 ? '' : 's'}
            </span>

            <ul
              aria-labelledby={`emoji-title-${id}`}
              className={styles.perkList}
            >
              {emojis.map(({ id, name, image }) => (
                <li key={id}>
                  <Image
                    alt={name}
                    height={28}
                    src={image}
                    width={28}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {subscriberBadge && (
          <div>
            <span className={styles.perkListTitle}>Subscribes badge</span>

            <div className={styles.badge}>
              <UserBadge badge={subscriberBadge} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
