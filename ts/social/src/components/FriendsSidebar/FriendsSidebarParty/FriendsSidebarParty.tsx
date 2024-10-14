import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, ConfirmDialog, Icon, IconButton, Tooltip } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useId, useState } from 'react';

import { BlockUserModal } from '../../BlockUserModal';
import { MAX_PARTY_MEMBER_AMOUNT } from '../consts';
import { FriendsSidebarFriend } from '../FriendsSidebarFriend/FriendsSidebarFriend';
import { useLeavePartyDialog } from '../hooks/useLeavePartyDialog.hook';

import styles from './FriendsSidebarParty.module.css';

import { FriendsSidebarPartyFriendFragment } from '@social-gen';

gql`
  fragment FriendsSidebarPartyFriend on FriendsUser {
    ...FriendsSidebarFriend
  }
  fragment FriendsSidebarPartyProfile on ProfileProfile {
    ...FriendsSidebarFriendProfile
  }
`;

interface Props {
  partyMembers: FriendsSidebarPartyFriendFragment[];
  minimized?: boolean;
  isInStream?: boolean;
  partyLeaderId?: string;
}

export function FriendsSidebarParty({
  partyMembers,
  minimized,
  isInStream,
  partyLeaderId,
}: Props) {
  const [confirmBlockedUserId, setConfirmBlockedUserId] =
    useState<Nullable<string>>(null);
  const id = useId();

  const leavePartyDialog = useLeavePartyDialog(isInStream);

  const emptySlots = MAX_PARTY_MEMBER_AMOUNT - partyMembers.length;

  return (
    <div
      className={classNames(styles.friendsSidebarPartyRoot, {
        [styles.minimized]: minimized,
      })}
    >
      <h3
        className={styles.friendsSidebarPartyTitle}
        id={id}
      >
        <strong className={styles.friendsSidebarPartyTitleHighlighted}>
          Your Party{' '}
        </strong>
        {minimized
          ? `${partyMembers.length}/${MAX_PARTY_MEMBER_AMOUNT}`
          : `${partyMembers.length}/${MAX_PARTY_MEMBER_AMOUNT} people`}
      </h3>

      <ul
        aria-labelledby={id}
        className={styles.friendsSidebarPartyList}
      >
        {partyMembers.map((member) => (
          <li key={member.profile.userId}>
            <FriendsSidebarFriend
              friend={member}
              isInStream={!!isInStream}
              isPartyLeader={member.profile.userId === partyLeaderId}
              minimized={minimized}
              onBlockUser={() => setConfirmBlockedUserId(member.profile.userId)}
            />
          </li>
        ))}
        {new Array(emptySlots).fill(null).map((_, index) => (
          <li
            className={styles.friendsSidebarPartyEmptySlot}
            key={index}
          >
            <div className={styles.friendsSidebarPartyEmptySlotIconWrapper}>
              <Icon
                className={styles.friendsSidebarPartyEmptySlotIcon}
                icon={CoreAssets.Icons.Person}
              />
            </div>
            <span className={styles.friendsSidebarPartyEmptySlotLabel}>Empty</span>
          </li>
        ))}
      </ul>

      {minimized ? (
        <Tooltip
          content="Leave party"
          placement="left"
        >
          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Leave party"
            level="secondary"
            size="sm"
            onClick={leavePartyDialog.actions.open}
          />
        </Tooltip>
      ) : (
        <Button
          level="secondary"
          size="sm"
          onClick={leavePartyDialog.actions.open}
        >
          Leave party
        </Button>
      )}

      <ConfirmDialog store={leavePartyDialog} />

      {!!confirmBlockedUserId && (
        <BlockUserModal
          blockedUserId={confirmBlockedUserId}
          onDismiss={() => setConfirmBlockedUserId(null)}
        />
      )}
    </div>
  );
}
