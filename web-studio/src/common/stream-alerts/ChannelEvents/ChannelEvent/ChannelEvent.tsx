import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { Icon, NoiceLogo, useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';
import { SyntheticEvent, useRef } from 'react';

import styles from './ChannelEvent.module.css';

import { AlertComponentBaseProps, AlertProps } from '@common/alerts';

function getAlertUser(alert: AlertProps) {
  if (alert.data.__typename !== 'StreamerChannelActivityEvent') {
    return;
  }

  if (!alert.data.content?.__typename) {
    return;
  }

  if (alert.data.content?.__typename === 'StreamerChannelFollowed') {
    return alert.data.content?.follower;
  }

  if (
    alert.data.content?.__typename === 'StreamerChannelSubscribed' ||
    alert.data.content?.__typename === 'StreamerSubscriptionGifted' ||
    alert.data.content?.__typename === 'StreamerSubscriptionRenewed' ||
    alert.data.content?.__typename === 'StreamerBundlePurchased' ||
    alert.data.content?.__typename === 'StreamerStreamerCardPurchased'
  ) {
    return alert.data.content?.user;
  }
}

function getAvatarFullBody(alert: AlertProps) {
  const user = getAlertUser(alert);

  if (!user) {
    return;
  }

  return user.avatars?.avatarFullbody;
}

function getUserTag(alert: AlertProps) {
  const user = getAlertUser(alert);

  if (!user) {
    return;
  }

  return user.userTag;
}

function getAction(alert: AlertProps) {
  if (alert.data.__typename !== 'StreamerChannelActivityEvent') {
    return;
  }

  if (alert.data.content?.__typename === 'StreamerChannelFollowed') {
    return 'followed';
  }

  if (
    alert.data.content?.__typename === 'StreamerStreamerCardPurchased' ||
    alert.data.content?.__typename === 'StreamerBundlePurchased'
  ) {
    return 'purchased';
  }

  if (alert.data.content?.__typename === 'StreamerSubscriptionGifted') {
    return 'gifted';
  }

  if (alert.data.content?.__typename === 'StreamerSubscriptionRenewed') {
    return 'resubscribed';
  }

  if (alert.data.content?.__typename === 'StreamerChannelSubscribed') {
    return 'subscribed';
  }
}

function getActionTarget(alert: AlertProps) {
  if (alert.data.__typename !== 'StreamerChannelActivityEvent') {
    return;
  }

  if (alert.data.content?.__typename === 'StreamerStreamerCardPurchased') {
    return 'a creator card';
  }

  if (alert.data.content?.__typename === 'StreamerBundlePurchased') {
    return 'a premium bundle';
  }

  if (alert.data.content?.__typename === 'StreamerSubscriptionGifted') {
    if (
      !alert.data.content.recipientUserIds ||
      alert.data.content.recipientUserIds.length < 2
    ) {
      return 'a subscription';
    }

    return `${alert.data.content.recipientUserIds.length} subscriptions`;
  }
}

interface Props extends AlertComponentBaseProps {
  alert: AlertProps;
  onDisappeared?(): void;
}

export function ChannelEvent({ alert, onDisappeared, ...baseProps }: Props) {
  const { trackEvent } = useAnalytics();

  const userTag = getUserTag(alert) ?? 'Anonymous';
  const avatarFullBody = getAvatarFullBody(alert);
  const action = getAction(alert);
  const actionTarget = getActionTarget(alert);
  const isAnonymous = !getAlertUser(alert);

  const containerRef = useRef(null);

  const handleAnimationEnd = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.target !== containerRef.current) {
      return;
    }

    onDisappeared?.();
  };

  useMountEffect(() => {
    if (alert.data.__typename !== 'StreamerChannelActivityEvent') {
      return;
    }

    trackEvent({
      streamAlertItemShown: {
        ...baseProps,
        alertItemId: alert.id,
        channelEvent: alert.data,
      },
    });
  });

  return (
    <div
      className={styles.channelEventContainer}
      key={alert.id}
      ref={containerRef}
      onAnimationEnd={handleAnimationEnd}
    >
      {isAnonymous ? (
        <Icon
          className={styles.avatarPlaceholderIcon}
          color="black-main-transparent-40"
          icon={CoreAssets.Icons.AvatarPlaceholder}
          size={110}
        />
      ) : (
        <div className={classNames(styles.avatarWrapper)}>
          <div
            className={styles.avatarImageContainer}
            style={{
              backgroundImage: `url(${avatarFullBody})`,
            }}
          />
        </div>
      )}

      <div className={styles.eventContentContainer}>
        <NoiceLogo
          className={styles.noiceLogo}
          theme="spectrum"
          variant="mark"
        />

        <div className={styles.textContainer}>
          <div
            className={classNames(styles.textBase, styles.nameText, {
              [styles.anonymous]: isAnonymous,
            })}
          >
            {userTag}
          </div>
          <div
            className={classNames(styles.textBase, styles.actionText, styles.small, {
              [styles.indented]: !!actionTarget,
            })}
          >
            {action}
          </div>
          {!!actionTarget && (
            <div className={classNames(styles.textBase, styles.actionTargetText)}>
              {actionTarget}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
