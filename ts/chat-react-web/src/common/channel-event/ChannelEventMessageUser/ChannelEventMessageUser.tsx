import { CommonUtils, useAuthenticatedUser } from '@noice-com/common-ui';
import { MiniProfilePortal } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import { useRef, useState } from 'react';

import styles from './ChannelEventMessageUser.module.css';

import { ChannelEventContentProfileFragment } from '@chat-gen';

interface Props {
  channelId: Nullable<string>;
  profile: Nullable<ChannelEventContentProfileFragment>;
  onModerationAction?: (message: string, username: string) => void;
}

export function ChannelEventMessageUser({
  channelId,
  profile,
  onModerationAction,
}: Props) {
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const usernameButtonRef = useRef<HTMLButtonElement>(null);

  const { userId: localUserId } = useAuthenticatedUser();

  if (!profile) {
    return <span className={styles.anonymousUsername}>Mysterious Stranger</span>;
  }

  const { preferredColor, userId, userTag } = profile;

  if (userId === localUserId) {
    return (
      <span
        className={styles.username}
        style={{ color: CommonUtils.getUserIdColor({ preferredColor, userId }) }}
      >
        {userTag}
      </span>
    );
  }
  return (
    <>
      <button
        aria-expanded={showMiniProfile ? 'true' : 'false'}
        aria-haspopup="dialog"
        className={styles.usernameButton}
        ref={usernameButtonRef}
        style={{
          color: CommonUtils.getUserIdColor({ preferredColor, userId }),
        }}
        type="button"
        onClick={() => setShowMiniProfile(!showMiniProfile)}
      >
        {userTag}
      </button>

      <MiniProfilePortal
        anchor={usernameButtonRef}
        channelId={channelId ?? undefined}
        placement="top"
        showMiniProfile={showMiniProfile}
        userId={userId}
        onClose={() => setShowMiniProfile(false)}
        onModerationAction={onModerationAction}
      />
    </>
  );
}
