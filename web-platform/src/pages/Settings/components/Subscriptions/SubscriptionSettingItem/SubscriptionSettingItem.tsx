import { gql } from '@apollo/client';
import {
  Button,
  ChannelLogo,
  CommonUtils,
  Image,
  useAnalytics,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';

import { SubscriptionButton } from './SubscriptionButton/SubscriptionButton';
import styles from './SubscriptionSettingItem.module.css';

import { useSubscriptionPaymentMethodDialog } from '@common/subscription';
import {
  BadgeBadgeType,
  SubscriptionChannelSubscriptionProvider,
  SubscriptionChannelSubscriptionState,
  SubscriptionSettingItemSubscriptionFragment,
  useSubscriptionItemBadgeQuery,
} from '@gen';

gql`
  query SubscriptionItemBadge($channelId: ID!, $userId: ID!) {
    profile(userId: $userId) {
      userId
      badges(channel_id: $channelId) {
        level
        ...UserBadge
      }
    }
  }
`;

const getSubscriptionProviderName = (
  provider: SubscriptionChannelSubscriptionProvider,
) => {
  switch (provider) {
    case SubscriptionChannelSubscriptionProvider.ProviderApple:
      return 'iOS Device';
    case SubscriptionChannelSubscriptionProvider.ProviderChargebee:
      return 'noice.com';
    default:
      return undefined;
  }
};

interface Props {
  subscription: SubscriptionSettingItemSubscriptionFragment;
}

export function SubscriptionSettingItem({ subscription }: Props) {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const { userId } = useAuthenticatedUser();

  const { showModal: onUpdatePaymentClick } = useSubscriptionPaymentMethodDialog({});

  const {
    channel,
    activatedAt,
    expiresAt,
    state,
    cancelledAt,
    paymentFailedAt,
    provider,
  } = subscription;
  const { id: channelId, name, offlineBanner } = channel;

  const { data } = useSubscriptionItemBadgeQuery({
    variables: {
      channelId,
      userId,
    },
  });

  const badge = data?.profile?.badges.find(
    (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
  );

  const providerName = getSubscriptionProviderName(provider);

  return (
    <>
      <div
        className={classNames(styles.wrapper, {
          [styles.expired]: state === SubscriptionChannelSubscriptionState.StateExpired,
        })}
      >
        {state !== SubscriptionChannelSubscriptionState.StateExpired && (
          <Image
            alt={`Banner image for channel ${name}`}
            fit="cover"
            height={128}
            sizes={`
              (max-width: ${CommonUtils.getRem(634)}) 90vw,
              ${CommonUtils.getRem(634)}`}
            src={offlineBanner}
            width="100%"
          />
        )}

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.channelDetails}>
              <ChannelLogo channel={channel} />

              <span className={styles.channelName}>{name}</span>
            </div>

            {badge && (
              <div className={styles.badgeWrapper}>
                <UserBadge
                  badge={badge}
                  badgeSize={24}
                />
                <div className={styles.badgeMonthsWrapper}>
                  <span>Months subscribed</span>
                  <span className={styles.badgeMonths}>
                    {badge.level} Month{badge.level <= 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.subscribeButtonContainer}>
              <SubscriptionButton
                subscription={subscription}
                onButtonClick={(event) =>
                  trackButtonClickEventOnMouseClick(event, 'subscription-setting')
                }
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.subscriptionDetails}>
            <div className={styles.subscriptionDetail}>
              <span className={styles.label}>Subscription started</span>{' '}
              {!!activatedAt && (
                <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(activatedAt)}>
                  {DateAndTimeUtils.getShortDate(activatedAt)}
                </time>
              )}
            </div>

            {state === SubscriptionChannelSubscriptionState.StateActive && (
              <div className={styles.subscriptionDetail}>
                <span className={styles.label}>Next renewal</span>{' '}
                {!!expiresAt && (
                  <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(expiresAt)}>
                    {DateAndTimeUtils.getShortDate(expiresAt)}
                  </time>
                )}
              </div>
            )}

            {state === SubscriptionChannelSubscriptionState.StateCancelled && (
              <div className={styles.subscriptionDetail}>
                <span className={styles.label}>Subscription ends</span>{' '}
                {!!expiresAt && (
                  <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(expiresAt)}>
                    {DateAndTimeUtils.getShortDate(expiresAt)}
                  </time>
                )}
              </div>
            )}

            {state === SubscriptionChannelSubscriptionState.StateExpired && (
              <div className={styles.subscriptionDetail}>
                <span className={styles.label}>Subscription ended</span>{' '}
                {!!cancelledAt && (
                  <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(cancelledAt)}>
                    {DateAndTimeUtils.getShortDate(cancelledAt)}
                  </time>
                )}
              </div>
            )}
          </div>

          {!!paymentFailedAt && (
            <div className={styles.paymentFailWarning}>
              <span>
                {state === SubscriptionChannelSubscriptionState.StateExpired
                  ? 'Your subscription has ended due to payment failure.'
                  : 'Subscription payment failed.'}
              </span>

              {state !== SubscriptionChannelSubscriptionState.StateExpired && (
                <>
                  <div>
                    <Button
                      level="secondary"
                      size="sm"
                      onClick={(event) => {
                        trackButtonClickEventOnMouseClick(event, 'subscription-setting');
                        onUpdatePaymentClick();
                      }}
                    >
                      Update payment method
                    </Button>
                  </div>

                  <span className={styles.paymentFailWarningDescription}>
                    We were unable to charge you for the subscription. To keep your
                    subscription active, please update your payment method. We will retry
                    to collect the payment again in the next few days.
                  </span>
                </>
              )}
            </div>
          )}

          {providerName && state === SubscriptionChannelSubscriptionState.StateActive && (
            <>
              <div className={styles.divider} />
              <div className={styles.providerInfo}>Subscribed via {providerName}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

SubscriptionSettingItem.fragments = {
  entry: gql`
    fragment SubscriptionSettingItemSubscription on SubscriptionChannelSubscription {
      activatedAt
      expiresAt
      cancelledAt
      state
      paymentFailedAt
      provider
      channel {
        id
        name
        offlineBanner
        ...ChannelLogoChannel
      }
      ...SubscriptionButtonSubscription
    }
  `,
};
