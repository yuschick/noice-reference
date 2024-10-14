import { gql } from '@apollo/client';
import { CommonUtils, Image, LoadingSpinner } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';

import { useSubscriptionsLinks } from '../../hooks/useSubscriptionsLinks.hook';
import { MonetizationSubscriptionsHeader } from '../../MonetizationSubscriptionsHeader/MonetizationSubscriptionsHeader';
import {
  SubscriptionSection,
  SubscriptionSectionLink,
} from '../../SubscriptionSection/SubscriptionSection';

import styles from './MonetizationSubscriptions.module.css';
import { SubscriptionConfig } from './SubscriptionConfig/SubscriptionConfig';

import { useChannelContext } from '@common/channel';
import {
  BadgeBadgeType,
  SubscriptionGetChannelEmojisChannelEmojiFragment,
  useSubscriptionsMonetizationDataQuery,
} from '@gen';

gql`
  query SubscriptionsMonetizationData($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscriberCount
      subscriptionConfig {
        channelId
        subscriptionsEnabled
      }
      monetizationSettings {
        enabled
      }
      ...SubscriptionGetChannelEmojisChannel
    }
  }
`;

const EmojiList = ({
  emojis,
}: {
  emojis: SubscriptionGetChannelEmojisChannelEmojiFragment[];
}) =>
  !!emojis.length && (
    <ul className={styles.perkList}>
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
  );

export function MonetizationSubscriptions() {
  const { toEmojis, toSubscribers } = useSubscriptionsLinks();
  const { channelId } = useChannelContext();

  const { data, loading } = useSubscriptionsMonetizationDataQuery({
    variables: { channelId },
  });

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!data?.channel) {
    return null;
  }

  const emojis = CommonUtils.getChannelEmojis(data.channel);

  return (
    <>
      <MonetizationSubscriptionsHeader title="Subscriptions" />

      <div className={styles.sectionGroup}>
        <SubscriptionConfig
          subscriptionsEnabled={!!data.channel.subscriptionConfig?.subscriptionsEnabled}
        />

        <SubscriptionSectionLink
          description="Total amount of active subscribers on your channel"
          label="Subscribers"
          to={toSubscribers}
        >
          <div className={styles.count}>{data.channel.subscriberCount}</div>
        </SubscriptionSectionLink>
      </div>

      <div className={styles.perksSectionGroup}>
        <div className={styles.sectionGroupHeader}>Subscriber perks</div>
        {data.channel.monetizationSettings.enabled ? (
          <div className={styles.sectionGroup}>
            <SubscriptionSectionLink
              contentPreview={<EmojiList emojis={emojis} />}
              description="View and manage your channel emojis"
              label="Emojis"
              to={toEmojis}
            />
            <SubscriptionSection
              contentPreview={
                <ul className={styles.badgesList}>
                  {Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <li key={`badge-${i}`}>
                        <UserBadge
                          badge={{
                            type: BadgeBadgeType.TypeChannelSubscriber,
                            level: i + 1,
                          }}
                          badgeSize={20}
                        />
                      </li>
                    ))}
                </ul>
              }
              description="View your subscription badges"
              label="Badges"
            />
          </div>
        ) : (
          <div className={styles.disabledStateContainer}>
            <p>Subscription perks are not available when the monetization is disabled.</p>
          </div>
        )}
      </div>
    </>
  );
}
