import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  useAuthenticatedUser,
  ProfileImage,
  ButtonLink,
  LoadingSkeleton,
  usePopoverMenu,
  IconButton,
  PopoverMenu,
  Icon,
  ReportUserDialog,
} from '@noice-com/common-ui';
import {
  FriendRequestButton,
  BlockUserModal,
  useUnblockUserMutation,
} from '@noice-com/social';
import { useState } from 'react';

import styles from './ProfilePageHeader.module.css';

import { Routes } from '@common/route';
import {
  FriendsFriendshipStatusStatus,
  ProfilePageHeaderProfileFragment,
  ProfileProfileVisibility,
} from '@gen';

gql`
  fragment ProfilePageHeaderProfile on ProfileProfile {
    userId
    userTag
    discordUsername
    visibility
    isNewUsername
    avatars {
      avatar2D
    }
    ...FriendRequestButtonProfile
    ...ProfileImageProfile
  }
`;

interface Props {
  profile: ProfilePageHeaderProfileFragment;
}

export function ProfilePageHeader({ profile }: Props) {
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const popover = usePopoverMenu({ placement: 'bottom' });
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { userId: ownUserId, isImplicitAccount } = useAuthenticatedUser();
  const {
    userTag,
    userId: profileUserId,
    visibility,
    friendshipStatus,
    isNewUsername,
  } = profile;

  const ownProfile = ownUserId === profileUserId;

  const hideFriendRequestButton =
    visibility === ProfileProfileVisibility.ProfileVisibilityPrivate ||
    friendshipStatus.status === FriendsFriendshipStatusStatus.StatusBlocked;

  const [onUnblockUser, { loading: unblockIsLoading }] = useUnblockUserMutation({
    profileUserId,
  });

  const handleUnblockClick = async () => {
    await onUnblockUser();
  };

  return (
    <header className={styles.profileHeaderContainer}>
      <div className={styles.headerContentContainer}>
        <div className={styles.headerUsernameContainer}>
          <ProfileImage
            profile={profile}
            size="lg"
          />

          <div>
            <h2
              className={styles.title}
              translate="no"
            >
              {userTag}
            </h2>

            {isNewUsername && (
              <span className={styles.newUsernameIndicator}>
                Username changed recently
              </span>
            )}
          </div>
        </div>

        {!isImplicitAccount && (
          <div className={styles.buttons}>
            {!ownProfile ? (
              <>
                {!hideFriendRequestButton && <FriendRequestButton profile={profile} />}

                <IconButton
                  icon={CoreAssets.Icons.Menu}
                  label="Open menu"
                  level="secondary"
                  ref={popover.state.popoverMenuTriggerRef}
                  size="sm"
                  onClick={popover.actions.toggle}
                />

                <PopoverMenu store={popover}>
                  <PopoverMenu.Section>
                    {friendshipStatus.status ===
                    FriendsFriendshipStatusStatus.StatusBlocked ? (
                      <PopoverMenu.Button
                        isLoading={unblockIsLoading}
                        onClick={handleUnblockClick}
                      >
                        Unblock user
                      </PopoverMenu.Button>
                    ) : (
                      <PopoverMenu.Button onClick={() => setShowBlockConfirmation(true)}>
                        Block user
                      </PopoverMenu.Button>
                    )}

                    <PopoverMenu.Button onClick={() => setShowReportDialog(true)}>
                      Report user
                    </PopoverMenu.Button>
                  </PopoverMenu.Section>
                </PopoverMenu>
              </>
            ) : (
              <>
                <ButtonLink
                  level="secondary"
                  size="sm"
                  to={Routes.Settings}
                >
                  Edit Profile
                </ButtonLink>

                <ButtonLink
                  level="secondary"
                  size="sm"
                  to={Routes.Avatar}
                >
                  Customize avatar
                </ButtonLink>
              </>
            )}
          </div>
        )}
      </div>

      {!!profile.discordUsername && (
        <div className={styles.externalAccounts}>
          <div className={styles.externalAccount}>
            <Icon
              icon={CoreAssets.Icons.Discord}
              title="Discord"
            />
            <span>{profile.discordUsername}</span>
          </div>
        </div>
      )}

      {showBlockConfirmation && (
        <BlockUserModal
          blockedUserId={profileUserId}
          onDismiss={() => setShowBlockConfirmation(false)}
        />
      )}

      <hr className={styles.divider} />

      {showReportDialog && (
        <ReportUserDialog
          reportedUserId={profileUserId}
          onDismiss={() => setShowReportDialog(false)}
        />
      )}
    </header>
  );
}

ProfilePageHeader.Loading = () => {
  return (
    <div className={styles.header}>
      <div className={styles.profileWrapper}>
        <ProfileImage.Loading size="lg" />

        <LoadingSkeleton className={styles.loadingTitle} />
      </div>
    </div>
  );
};
