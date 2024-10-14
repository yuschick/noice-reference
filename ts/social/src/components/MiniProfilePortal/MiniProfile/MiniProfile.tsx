import { gql } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import { FriendshipStatusStatus } from '@noice-com/schemas/friends/friends.pb';
import { useEffect } from 'react';

import styles from './MiniProfile.module.css';
import { MiniProfileAvatar } from './MiniProfileAvatar';
import { MiniProfileDetails } from './MiniProfileDetails/MiniProfileDetails';
import { MiniProfileFooter } from './MiniProfileFooter';
import { MiniProfileFriendStatus } from './MiniProfileFriendStatus';
import { MiniProfileGameRank } from './MiniProfileGameRank';
import { MiniProfileHeader } from './MiniProfileHeader';

import { MiniProfileFragment } from '@social-gen';

gql`
  fragment MiniProfile on ProfileProfile {
    userId
    ...MiniProfileAvatarProfile
    ...MiniProfileHeaderProfile
    ...MiniProfileDetailsProfile
    ...MiniProfileGameRankProfile
    ...MiniProfileFriendStatusProfile
    ...MiniProfileFooterProfile
  }

  fragment MiniProfileChatStatus on ChatGetChatUserStatusResponse {
    ...MiniProfileModerationStateChatStatus
    ...MiniProfilePopoverMenuChatStatus
  }

  fragment MiniProfileChannelBan on ChannelUserBanStatus {
    ...MiniProfilePopoverMenuChannelBan
    ...MiniProfileModerationStateChannelBan
  }
`;

export interface MiniProfileProps {
  profile: MiniProfileFragment;
}

export function MiniProfile({ profile }: MiniProfileProps) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent({
      clientOpenMiniProfile: {
        friendshipStatus:
          (profile?.friendshipStatus.status as unknown as FriendshipStatusStatus) ??
          undefined,
      },
    });
  }, [profile, trackEvent]);

  return (
    <div
      aria-label={`${profile.userTag}'s mini profile`}
      className={styles.miniProfileWrapper}
      role="dialog"
    >
      <MiniProfileAvatar profile={profile} />

      <div className={styles.miniProfileContent}>
        <MiniProfileHeader profile={profile} />

        <MiniProfileDetails profile={profile} />

        <MiniProfileGameRank profile={profile} />

        <MiniProfileFriendStatus profile={profile} />

        <MiniProfileFooter profile={profile} />
      </div>
    </div>
  );
}
