import styles from './BlockedUsers.module.css';
import { BlockedUsersListItem } from './BlockedUsersListItem';

import { BlockedUsersFriendUserFragment } from '@gen';

interface Props {
  blockedUsers: BlockedUsersFriendUserFragment[];
}

export function BlockedUsersList({ blockedUsers }: Props) {
  return (
    <ul className={styles.usersBlockedList}>
      {blockedUsers.map(({ profile, lastStatusChange }) => (
        <BlockedUsersListItem
          key={profile.userId}
          lastStatusChange={lastStatusChange}
          profile={profile}
        ></BlockedUsersListItem>
      ))}
    </ul>
  );
}
