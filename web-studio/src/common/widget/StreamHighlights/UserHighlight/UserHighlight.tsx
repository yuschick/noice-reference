import { gql } from '@apollo/client';
import { Icon, Image } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import classNames from 'classnames';
import { FaHeart } from 'react-icons/fa';

import { StreamHighlightEventType } from '../types';

import { UserStreamHighlightModel } from './types';
import styles from './UserHighlight.module.css';
import { UserHighlightContent } from './UserHighlightContent/UserHighlightContent';

gql`
  fragment UserHighlightProfile on ProfileProfile {
    preferredColor
    userId
    userTag
    avatars {
      avatar2D
    }
  }
`;

const getIcon = (event: UserStreamHighlightModel['event']) => {
  if (event.type === StreamHighlightEventType.NewFollower) {
    return (
      <Icon
        className={styles.eventIcon}
        color="teal-main"
        icon={FaHeart}
        size={16}
      />
    );
  }

  if (event.type === StreamHighlightEventType.NewSubscriber) {
    return (
      <UserBadge
        badge={event.badge}
        badgeSize={20}
      />
    );
  }
};

export function UserHighlight({ user, event }: UserStreamHighlightModel) {
  return (
    <section
      className={classNames(styles.eventExpandedViewWrapper, {
        [styles.followerEvent]: event.type === StreamHighlightEventType.NewFollower,
        [styles.subscriberEvent]: event.type === StreamHighlightEventType.NewSubscriber,
        [styles.giftSubscriptionEvent]:
          event.type === StreamHighlightEventType.NewGiftSubscription,
      })}
    >
      <div className={styles.eventType}>
        {getIcon(event)}
        <h3 className={styles.eventHeading}>{event.type}</h3>
      </div>

      <UserHighlightContent
        event={event}
        user={user}
      />

      <div className={styles.eventUserAvatarWrapper}>
        {!!user?.userTag && (
          <Image
            alt={user.userTag}
            className={styles.eventUserAvatar}
            height="auto"
            src={user.avatars?.avatar2D}
            width={128}
          />
        )}

        {event.type === StreamHighlightEventType.NewGiftSubscription &&
          event.recipient.user && (
            <Image
              alt={event.recipient.user.userTag}
              className={styles.eventUserAvatar}
              height="auto"
              src={event.recipient.user.avatars?.avatar2D}
              width={128}
            />
          )}
      </div>
    </section>
  );
}
