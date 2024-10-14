import { CommonUtils, ProfileImage } from '@noice-com/common-ui';
import { MiniProfilePortal, UserBadge } from '@noice-com/social';
import { useRef, useState } from 'react';

import { StreamHighlightEventType } from '../../types';
import { EventListItemModel } from '../types';

import styles from './EventListItemContent.module.css';

import { useChannelContext } from '@common/channel';
import { showToastOnMiniProfileModerationAction } from '@common/profile';

export function EventListItemContent({
  event,
  user,
}: Omit<EventListItemModel, 'timestamp'>) {
  const { channelId } = useChannelContext();
  const [showUserMiniProfile, setShowUserMiniProfile] = useState(false);
  const [showRecipientMiniProfile, setShowRecipientMiniProfile] = useState(false);

  const userMiniProfileButtonRef = useRef<HTMLButtonElement>(null);
  const recipientMiniProfileRef = useRef<HTMLButtonElement>(null);

  if (typeof user === 'undefined') {
    return null;
  }

  return (
    <div className={styles.eventContentWrapper}>
      {user ? (
        <>
          <button
            className={styles.eventUserAvatarButton}
            ref={userMiniProfileButtonRef}
            style={{
              color: CommonUtils.getUserIdColor({
                preferredColor: user.preferredColor,
                userId: user.userId,
              }),
            }}
            type="button"
            onClick={() => setShowUserMiniProfile(true)}
          >
            <ProfileImage
              aria-hidden="true"
              profile={user}
              size="xs"
            />

            {event.type === StreamHighlightEventType.NewGiftSubscription && (
              <UserBadge badge={event.badge} />
            )}

            <span className={styles.eventUserName}>{user.userTag}</span>
          </button>

          <MiniProfilePortal
            anchor={userMiniProfileButtonRef}
            channelId={channelId}
            showMiniProfile={showUserMiniProfile}
            userId={user.userId}
            onClose={() => setShowUserMiniProfile(false)}
            onModerationAction={showToastOnMiniProfileModerationAction}
          />
        </>
      ) : (
        <div className={styles.eventUserAvatarButton}>
          {event.type === StreamHighlightEventType.NewGiftSubscription && (
            <UserBadge badge={event.badge} />
          )}

          <span className={styles.eventUserName}>Mysterious Stranger</span>
        </div>
      )}

      {event.type === StreamHighlightEventType.NewGiftSubscription &&
        event.recipient.user && (
          <>
            <button
              className={styles.eventUserAvatarButton}
              ref={recipientMiniProfileRef}
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: event.recipient.user.preferredColor,
                  userId: event.recipient.user.userId,
                }),
              }}
              type="button"
              onClick={() => setShowRecipientMiniProfile(true)}
            >
              <ProfileImage
                aria-hidden="true"
                profile={event.recipient.user}
                size="xs"
              />

              {event.type === StreamHighlightEventType.NewGiftSubscription && (
                <UserBadge badge={event.recipient.badge} />
              )}

              <span className={styles.eventUserName}>{event.recipient.user.userTag}</span>
            </button>

            <MiniProfilePortal
              anchor={recipientMiniProfileRef}
              channelId={channelId}
              showMiniProfile={showRecipientMiniProfile}
              userId={event.recipient.user.userId}
              onClose={() => setShowRecipientMiniProfile(false)}
              onModerationAction={showToastOnMiniProfileModerationAction}
            />
          </>
        )}
    </div>
  );
}
