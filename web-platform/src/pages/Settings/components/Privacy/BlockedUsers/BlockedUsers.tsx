import { gql } from '@apollo/client';
import { Button } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import styles from './BlockedUsers.module.css';
import { BlockedUsersList } from './BlockedUsersList';
import { BlockedUsersTable } from './BlockedUsersTable';

import { BlockedUsersFriendUserFragment } from '@gen';

interface Props {
  blockedUsers: BlockedUsersFriendUserFragment[];
}

export function BlockedUsers({ blockedUsers }: Props) {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!blockedUsers.length) {
      setShowList(false);
    }
  }, [blockedUsers.length]);

  return (
    <div className={classNames(styles.wrapper, { [styles.showList]: showList })}>
      <div
        className={classNames(styles.top, {
          [styles.noBlockedUsers]: !blockedUsers.length,
        })}
      >
        <span className={styles.label}>
          <span className={styles.blockedUserAmount}>{blockedUsers.length}</span>
          {blockedUsers.length === 1 ? ' user ' : ' users '}
          currently blocked
        </span>

        {!!blockedUsers.length && (
          <Button
            size="sm"
            theme="dark"
            onClick={() => {
              setShowList((prev) => !prev);
            }}
          >
            {showList ? 'Hide' : 'Show'} blocked users
          </Button>
        )}
      </div>

      <div className={styles.bottom}>
        <BlockedUsersTable blockedUsers={blockedUsers} />
        <BlockedUsersList blockedUsers={blockedUsers} />
      </div>
    </div>
  );
}

BlockedUsers.fragments = {
  entry: gql`
    fragment BlockedUsersFriendUser on FriendsUser {
      lastStatusChange
      profile {
        userId
        userTag
        avatars {
          avatar2D
        }
        ...ProfileImageProfile
      }
    }
  `,
};
