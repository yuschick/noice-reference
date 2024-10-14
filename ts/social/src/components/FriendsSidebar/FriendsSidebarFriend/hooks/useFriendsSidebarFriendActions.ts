import { gql } from '@apollo/client';
import {
  UseConfirmDialogResult,
  useAuthenticatedUser,
  useConfirmDialog,
} from '@noice-com/common-ui';

import { MAX_PARTY_MEMBER_AMOUNT } from '../../consts';
import { useLeavePartyDialog } from '../../hooks/useLeavePartyDialog.hook';
import { FriendsSidebarFriendPanelAction } from '../../types';

import { useParty, useSocialPackageInternal } from '@social-context';
import {
  FriendsFriendshipStatusStatus,
  FriendsSidebarFriendActionsFriendsUserFragment,
} from '@social-gen';
import { useRemoveFriendMutation, useSendFriendRequestMutation } from '@social-hooks';

interface HookResult {
  primaryActions: FriendsSidebarFriendPanelAction[];
  secondaryActions: FriendsSidebarFriendPanelAction[];
  leavePartyDialog: UseConfirmDialogResult;
  inviteToPartyDialog: UseConfirmDialogResult;
  removeFriendDialog: UseConfirmDialogResult;
}

interface Props {
  friend: FriendsSidebarFriendActionsFriendsUserFragment;
  isInStream: boolean;
  partyMember?: boolean;
  onBlockUser(): void;
}

gql`
  fragment FriendsSidebarFriendActionsFriendsUser on FriendsUser {
    userId
    activity {
      isOnline
      channel {
        id
        name
      }
    }
    profile {
      userId
      userTag
      friendshipStatus {
        status
      }
    }
  }
`;

const getPrimaryActions = (
  isOwnUser: boolean,
  partyMember: boolean,
  friend: FriendsSidebarFriendActionsFriendsUserFragment,
  partyMemberAmount: number,
  inviteParty: () => void,
  sendFriendRequest: () => void,
  profileRoutePath: string,
): FriendsSidebarFriendPanelAction[] => {
  const actions: FriendsSidebarFriendPanelAction[] = [];

  if (friend.activity?.isOnline && friend.activity.channel) {
    actions.push({
      type: 'buttonLink',
      text: 'View same channel',
      to: `/${friend.activity.channel.name.toLowerCase()}`,
    });
  }

  if (
    !partyMember &&
    friend.profile.friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend
  ) {
    actions.push({
      type: 'button',
      text: 'Invite to party',
      onClick: inviteParty,
      disabled: partyMemberAmount >= MAX_PARTY_MEMBER_AMOUNT,
    });
  }

  if (
    !isOwnUser &&
    friend.profile.friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusUnspecified
  ) {
    actions.push({
      type: 'button',
      text: 'Send friend request',
      onClick: sendFriendRequest,
    });
  }

  return [...actions, { type: 'buttonLink', text: 'View Profile', to: profileRoutePath }];
};

const getSecondaryActions = (
  isOwnUser: boolean,
  friend: FriendsSidebarFriendActionsFriendsUserFragment,
  isInParty: boolean,
  removeFriend: () => void,
  leaveParty: () => void,
  blockUser: () => void,
): FriendsSidebarFriendPanelAction[] => {
  const actions: FriendsSidebarFriendPanelAction[] = [];

  if (isOwnUser) {
    if (isInParty) {
      actions.push({
        type: 'button',
        text: 'Leave party',
        onClick: leaveParty,
      });
    }

    return actions;
  }

  if (
    friend.profile.friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend
  ) {
    actions.push({
      type: 'button',
      text: 'Remove friend',
      onClick: removeFriend,
    });
  }

  return [...actions, { type: 'button', text: 'Block', onClick: blockUser }];
};

export function useFriendsSidebarFriendActions({
  friend,
  isInStream,
  onBlockUser,
}: Props): HookResult {
  const { partyId, inviteToParty, partyMemberAmount, partyMemberIds } = useParty();
  const { createProfileRoutePath } = useSocialPackageInternal();
  const { userId: ownUserId } = useAuthenticatedUser();
  const [removeFriend] = useRemoveFriendMutation({
    profileUserId: friend.userId,
  });
  const [sendFriendRequest] = useSendFriendRequestMutation({
    profileUserId: friend.userId,
  });

  const leavePartyDialog = useLeavePartyDialog(isInStream);

  const inviteToPartyDialog = useConfirmDialog({
    description:
      'You will be removed from your current team and placed in the party team.',
    onCancel: () => true,
    onConfirm: () => inviteToParty(friend.userId),
    title: 'Are you sure you want to create a party?',
  });

  const removeFriendDialog = useConfirmDialog({
    title: 'Remove friend',
    description: `Are you sure you want to remove ${friend.profile.userTag} as a friend?`,
    onCancel: () => true,
    onConfirm: async () => await removeFriend(),
  });

  const primaryActions = getPrimaryActions(
    ownUserId === friend.userId,
    partyMemberIds.includes(friend.userId),
    friend,
    partyMemberAmount,
    partyId || !isInStream
      ? () => inviteToParty(friend.userId)
      : inviteToPartyDialog.actions.open,
    sendFriendRequest,
    createProfileRoutePath(friend.profile.userTag),
  );

  const secondaryActions = getSecondaryActions(
    ownUserId === friend.userId,
    friend,
    !!partyId,
    removeFriendDialog.actions.open,
    leavePartyDialog.actions.open,
    onBlockUser,
  );

  return {
    primaryActions,
    secondaryActions,
    leavePartyDialog,
    inviteToPartyDialog,
    removeFriendDialog,
  };
}
