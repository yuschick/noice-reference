import { Button, ProfileImage } from '@noice-com/common-ui';
import { useUnblockUserMutation } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';

import styles from './BlockedUsers.module.css';

import { BlockedUsersFriendUserFragment } from '@gen';

export function BlockedUserRow({
  profile,
  lastStatusChange,
}: BlockedUsersFriendUserFragment) {
  const [onUnblockUser] = useUnblockUserMutation({
    profileUserId: profile.userId,
  });

  return (
    <tr>
      <td className={styles.td}>
        <ProfileImage profile={profile} />
      </td>
      <td className={styles.td}>
        <div className={styles.profileInfo}>
          <span className={styles.displayName}>{profile.userTag}</span>
        </div>
      </td>
      <td className={styles.td}>{DateAndTimeUtils.getShortDate(lastStatusChange)}</td>
      <td className={styles.td}>
        <Button
          level="secondary"
          size="sm"
          onClick={() => onUnblockUser()}
        >
          Unblock
        </Button>
      </td>
    </tr>
  );
}
