import { CoreAssets } from '@noice-com/assets-core';
import { ChannelEventModel } from '@noice-com/chat-react-core';
import { Icon } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { Fragment } from 'react';

import { ChannelEventMessageUser } from '../ChannelEventMessageUser';

import styles from './ChannelEventMessage.module.css';

import { ChatEventMessageWrapper } from '@chat-common/event-message';
import { BadgeBadgeType } from '@chat-gen';

interface Props {
  message: ChannelEventModel;
  onModerationAction?: (message: string, username: string) => void;
}

const getBadge = (message: ChannelEventModel) => {
  if (message.type === 'subscription') {
    return (
      message.user?.badges?.find(
        (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
      ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
    );
  }

  if (message.type === 'gift-subscription-v2') {
    if (message.recipients?.length === 1) {
      return (
        message.recipients[0].badges?.find(
          (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
        ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
      );
    }

    return { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 };
  }
};

export function ChannelEventMessage({ message, onModerationAction }: Props) {
  const badge = getBadge(message);

  return (
    <div id={message.id}>
      <ChatEventMessageWrapper>
        <div className={styles.messageTitleWrapper}>
          {message.type === 'subscription' && (
            <>
              {badge && (
                <UserBadge
                  badge={badge}
                  badgeSize={20}
                />
              )}
              <span>New Subscriber</span>
            </>
          )}

          {message.type === 'gift-subscription-v2' && (
            <>
              {badge && (
                <UserBadge
                  badge={badge}
                  badgeSize={20}
                />
              )}
              <span>
                {message.recipients?.length && message.recipients.length > 1
                  ? 'Gifted Subscriptions'
                  : 'Gifted Subscription'}
              </span>
            </>
          )}

          {message.type === 'bundle' && (
            <>
              <Icon
                icon={CoreAssets.Icons.Card}
                size={20}
              />
              <span>Premium bundle purchase</span>
            </>
          )}

          {message.type === 'creator-card' && (
            <>
              <Icon
                icon={CoreAssets.Icons.Card}
                size={20}
              />
              <span>Creator Card purchase</span>
            </>
          )}

          {message.type === 'avatar-item-purchase' && (
            <>
              <Icon
                icon={CoreAssets.Icons.Outfit}
                size={20}
              />
              <span>Avatar cosmetic purchase</span>
            </>
          )}
        </div>

        <div className={styles.messageContent}>
          <ChannelEventMessageUser
            channelId={message.channelId}
            profile={message.user}
            onModerationAction={onModerationAction}
          />

          {message.type === 'bundle' &&
            (!message.creatorCardNames?.length ? (
              <> purchased the Premium bundle.</>
            ) : (
              !!message.creatorCardNames?.length && (
                <>
                  {' '}
                  purchased the Premium bundle and acquired{' '}
                  {message.creatorCardNames.length > 1
                    ? 'the Creator Cards '
                    : 'the Creator Card '}
                  <span className={styles.creatorCardName}>
                    {message.creatorCardNames.join(', ')}!
                  </span>
                </>
              )
            ))}

          {message.type === 'creator-card' && (
            <>
              {' '}
              purchased the Creator Card{' '}
              <span className={styles.creatorCardName}>{message.creatorCardName}</span>.
            </>
          )}

          {message.type === 'subscription' && <> subscribed to the channel!</>}

          {message.type === 'gift-subscription-v2' &&
            message.recipients?.length === 1 && (
              <>
                {' '}
                gifted a subscription to{' '}
                <ChannelEventMessageUser
                  channelId={message.channelId}
                  profile={message.recipients[0]}
                  onModerationAction={onModerationAction}
                />
                !
              </>
            )}

          {message.type === 'gift-subscription-v2' &&
            !!message.recipients?.length &&
            message.recipients.length > 1 && (
              <>
                {' '}
                gifted {message.recipients.length} subscriptions to{' '}
                {message.recipients.map((recipient, i, arr) => (
                  <Fragment key={recipient.userId}>
                    <ChannelEventMessageUser
                      channelId={message.channelId}
                      profile={recipient}
                      onModerationAction={onModerationAction}
                    />
                    {i !== arr.length - 1 && ' '}
                  </Fragment>
                ))}
              </>
            )}

          {message.type === 'avatar-item-purchase' && (
            <>
              {' '}
              purchased a cosmetic{' '}
              <span className={styles.creatorCardName}>{message.item.name}</span> for
              their avatar.
            </>
          )}
        </div>
      </ChatEventMessageWrapper>
    </div>
  );
}
