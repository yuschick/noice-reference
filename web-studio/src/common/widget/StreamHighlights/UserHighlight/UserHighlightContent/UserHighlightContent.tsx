import { CommonUtils } from '@noice-com/common-ui';
import { MiniProfilePortal, UserBadge } from '@noice-com/social';
import { useRef, useState } from 'react';

import { StreamHighlightEventType } from '../../types';
import { UserStreamHighlightModel } from '../types';

import styles from './UserHighlightContent.module.css';

import { useChannelContext } from '@common/channel';
import { showToastOnMiniProfileModerationAction } from '@common/profile';

export function UserHighlightContent({ user, event }: UserStreamHighlightModel) {
  const { channelId } = useChannelContext();
  const [showUserMiniProfile, setShowUserMiniProfile] = useState(false);
  const [showRecipientMiniProfile, setShowRecipientMiniProfile] = useState(false);

  const userMiniProfileButtonRef = useRef<HTMLButtonElement>(null);
  const recipientMiniProfileRef = useRef<HTMLButtonElement>(null);

  if (event.type === StreamHighlightEventType.NewGiftSubscription) {
    return (
      <div className={styles.giftEventContent}>
        <button
          className={styles.giftEventUsername}
          ref={userMiniProfileButtonRef}
          style={
            user?.userId
              ? {
                  color: CommonUtils.getUserIdColor({
                    preferredColor: user.preferredColor,
                    userId: user.userId,
                  }),
                }
              : undefined
          }
          type="button"
          onClick={() => setShowUserMiniProfile(true)}
        >
          <UserBadge
            badge={event.badge}
            badgeSize={20}
          />

          {user?.userTag ? user.userTag : 'Mysterious Stranger'}
        </button>

        {user && (
          <MiniProfilePortal
            anchor={userMiniProfileButtonRef}
            channelId={channelId}
            showMiniProfile={showUserMiniProfile}
            userId={user.userId}
            onClose={() => setShowUserMiniProfile(false)}
            onModerationAction={showToastOnMiniProfileModerationAction}
          />
        )}

        {event.recipient.user && (
          <>
            <button
              className={styles.giftEventUsername}
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
              <UserBadge
                badge={event.recipient.badge}
                badgeSize={20}
              />

              {event.recipient.user?.userTag
                ? event.recipient.user.userTag
                : 'Mysterious Stranger'}
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

  return (
    <>
      <button
        className={styles.eventUsername}
        ref={userMiniProfileButtonRef}
        style={
          user?.userId
            ? {
                color: CommonUtils.getUserIdColor({
                  preferredColor: user.preferredColor,
                  userId: user.userId,
                }),
              }
            : undefined
        }
        type="button"
        onClick={() => setShowUserMiniProfile(true)}
      >
        {user?.userTag ? user.userTag : 'Mysterious Stranger'}
      </button>

      {user && (
        <MiniProfilePortal
          anchor={userMiniProfileButtonRef}
          channelId={channelId}
          showMiniProfile={showUserMiniProfile}
          userId={user.userId}
          onClose={() => setShowUserMiniProfile(false)}
          onModerationAction={showToastOnMiniProfileModerationAction}
        />
      )}
    </>
  );
}
