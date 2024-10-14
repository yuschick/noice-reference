import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  IconButton,
  useAuthenticatedUser,
  usePopoverMenu,
} from '@noice-com/common-ui';
import classNames from 'classnames';

import { useMiniProfileContext } from '../../context';

import styles from './MiniProfileFooter.module.css';
import { MiniProfilePopoverMenu } from './MiniProfilePopoverMenu';
import { shouldShowAddFriendButton } from './utils';

import { MiniProfileFooterProfileFragment } from '@social-gen';
import { useGiveGiftButton, useSendFriendRequestMutation } from '@social-hooks';
import { GiftTarget } from '@social-types';

gql`
  fragment MiniProfileFooterProfile on ProfileProfile {
    userId
    friendshipStatus {
      status
    }
    temporary
    ...MiniProfilePopoverMenuProfile
  }
`;

interface Props {
  profile: MiniProfileFooterProfileFragment;
}

export function MiniProfileFooter({ profile }: Props) {
  const { userId, friendshipStatus, temporary } = profile;
  const { userId: ownUserId, isImplicitAccount } = useAuthenticatedUser();
  const {
    channelBan,
    chatStatus,
    onChannelBanUser,
    onChannelMuteUser,
    onChannelUnbanUser,
    onChannelUnmuteUser,
    showModerationButtons,
    showChatModerationButtons,
  } = useMiniProfileContext();
  const showAddFriendButton = shouldShowAddFriendButton(
    friendshipStatus.status,
    !!temporary,
  );
  const { channelId } = useMiniProfileContext();
  const { showGiftButton, onGiftButtonClick } = useGiveGiftButton({
    target: GiftTarget.User,
    userId,
    channelId,
  });

  const [onAddFriend, { loading: sendingFriendRequest }] = useSendFriendRequestMutation({
    profileUserId: userId,
  });

  const popover = usePopoverMenu({
    placement: 'bottom-end',
  });

  const onMuteButtonClick = () => {
    if (chatStatus?.muted) {
      onChannelUnmuteUser();
      return;
    }
    onChannelMuteUser();
  };

  const onBanButtonClick = () => {
    if (channelBan?.banned) {
      onChannelUnbanUser();
      return;
    }
    onChannelBanUser();
  };

  if (userId === ownUserId || isImplicitAccount) {
    return null;
  }

  return (
    <>
      <div
        className={classNames(styles.miniProfileFooter, {
          [styles.withModerationButtons]: showModerationButtons,
        })}
      >
        {showModerationButtons ? (
          <>
            {showChatModerationButtons && (
              <Button
                level="secondary"
                size="sm"
                onClick={onMuteButtonClick}
              >
                {chatStatus?.muted ? 'Unmute' : 'Mute'}
              </Button>
            )}

            <Button
              level="secondary"
              size="sm"
              onClick={onBanButtonClick}
            >
              {channelBan?.banned ? 'Unban' : 'Ban'}
            </Button>
          </>
        ) : (
          <>
            {showAddFriendButton && (
              <div className={styles.friendButtonWrapper}>
                <Button
                  isLoading={sendingFriendRequest}
                  size="sm"
                  onClick={() => onAddFriend()}
                >
                  Add friend
                </Button>
              </div>
            )}

            {showGiftButton && (
              <Button
                level="secondary"
                size="sm"
                onClick={onGiftButtonClick}
              >
                Gift sub
              </Button>
            )}
          </>
        )}

        <div className={styles.menuButtonWrapper}>
          <IconButton
            icon={CoreAssets.Icons.Menu}
            label="User Actions"
            level="secondary"
            ref={popover.state.popoverMenuTriggerRef}
            size="sm"
            onClick={popover.actions.toggle}
          />
        </div>
      </div>

      <MiniProfilePopoverMenu
        profile={profile}
        store={popover}
      />
    </>
  );
}
