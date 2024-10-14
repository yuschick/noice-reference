import { VisuallyHidden } from '@noice-com/common-ui';

import { BlockedUserRow } from './BlockedUserRow';
import styles from './BlockedUsers.module.css';

import { BlockedUsersFriendUserFragment } from '@gen';

interface Props {
  blockedUsers: BlockedUsersFriendUserFragment[];
}

export function BlockedUsersTable({ blockedUsers }: Props) {
  return (
    <table className={styles.table}>
      <caption>
        <VisuallyHidden>Blocker users</VisuallyHidden>
      </caption>
      <thead>
        <tr>
          <th className={styles.th}>
            <VisuallyHidden>Avatar</VisuallyHidden>
          </th>
          <th className={styles.th}>User</th>
          <th className={styles.th}>Date Blocked</th>
          <th className={styles.th}>
            <VisuallyHidden>Unblock action</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {blockedUsers.map(({ profile, lastStatusChange }) => (
          <BlockedUserRow
            key={profile.userId}
            lastStatusChange={lastStatusChange}
            profile={profile}
          />
        ))}
      </tbody>
    </table>
  );
}
