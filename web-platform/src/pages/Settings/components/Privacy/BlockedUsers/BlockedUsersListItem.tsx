import { Button, ProfileImage, VisuallyHidden } from '@noice-com/common-ui';
import { useUnblockUserMutation } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';

import styles from './BlockedUsers.module.css';

import { BlockedUsersFriendUserFragment } from '@gen';

export function BlockedUsersListItem({
  profile,
  lastStatusChange,
}: BlockedUsersFriendUserFragment) {
  const [onUnblockUser] = useUnblockUserMutation({
    profileUserId: profile.userId,
  });

  return (
    <li
      className={styles.blockedListItem}
      key={profile.userId}
    >
      <div className={styles.itemProfileDetails}>
        <ProfileImage profile={profile} />
        <span className={styles.displayName}>{profile.userTag}</span>
      </div>
      <span className={styles.dateBlocked}>
        Date blocked:{' '}
        <time className={styles.date}>
          {DateAndTimeUtils.getShortDate(lastStatusChange)}
        </time>
      </span>
      <Button
        level="secondary"
        size="sm"
        onClick={() => onUnblockUser()}
      >
        Unblock <VisuallyHidden>{profile.userTag}</VisuallyHidden>
      </Button>
    </li>
  );
}
