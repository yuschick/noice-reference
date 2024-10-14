import { gql } from '@apollo/client';
import { CommonUtils, ProfileImage } from '@noice-com/common-ui';
import { MiniProfilePortal } from '@noice-com/social';
import classNames from 'classnames';
import { useRef, useState } from 'react';

import { showToastOnMiniProfileModerationAction } from '../utils';

import styles from './ModerationUser.module.css';

import { useChannelContext } from '@common/channel';
import { ModerationUserFragment } from '@gen';

interface Props {
  isModerator?: boolean;
  profile: ModerationUserFragment;
}

export function ModerationUser({ isModerator, profile }: Props) {
  const { preferredColor, userId, userTag } = profile;

  const [showUserCard, setShowUserCard] = useState(false);

  const { channelId } = useChannelContext();

  const colorStyle = {
    color: isModerator
      ? 'var(--noi-color-status-error-main)'
      : CommonUtils.getUserIdColor({
          preferredColor,
          userId,
        }),
  };

  const playerRef = useRef<HTMLButtonElement>(null);

  if (isModerator) {
    return (
      <div className={styles.user}>
        <div
          className={styles.avatarWrapper}
          style={colorStyle}
        >
          <ProfileImage
            profile={profile}
            size="xs"
          />
        </div>
        <span
          className={styles.name}
          style={colorStyle}
        >
          {userTag}
        </span>
      </div>
    );
  }

  return (
    <>
      <button
        className={classNames(styles.user, styles.button)}
        ref={playerRef}
        onClick={() => setShowUserCard(true)}
      >
        <div
          className={styles.avatarWrapper}
          style={colorStyle}
        >
          <ProfileImage
            profile={profile}
            size="xs"
          />
        </div>
        <span
          className={styles.name}
          style={colorStyle}
        >
          {userTag}
        </span>
      </button>

      <MiniProfilePortal
        anchor={playerRef}
        channelId={channelId}
        showMiniProfile={showUserCard}
        userId={userId}
        onClose={() => setShowUserCard(false)}
        onModerationAction={showToastOnMiniProfileModerationAction}
      />
    </>
  );
}

ModerationUser.fragments = {
  entry: gql`
    fragment ModerationUser on ProfileProfile {
      preferredColor
      userId
      userTag
      ...ProfileImageProfile
    }
  `,
};
