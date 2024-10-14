import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';

import { FriendsSidebarFriendList } from '../FriendsSidebarFriendList/FriendsSidebarFriendList';

import styles from './FriendsSidebarPendingView.module.css';

import { useFriendsSidebarPendingViewDataQuery } from '@social-gen';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
} from '@social-hooks';

gql`
  query FriendsSidebarPendingViewData($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        userId
        ...FriendsSidebarFriendListFriend
      }
    }

    sentFriendRequests(userId: $userId) {
      users {
        userId
        ...FriendsSidebarFriendListFriend
      }
    }
  }
`;

interface Props {
  className?: string;
  onAddFriendClick(): void;
  onBackButtonClick(): void;
}

export function FriendsSidebarPendingView({
  className,
  onAddFriendClick,
  onBackButtonClick,
}: Props) {
  const { userId } = useAuthenticatedUser();
  const { data, loading } = useFriendsSidebarPendingViewDataQuery({
    variables: { userId },
    fetchPolicy: 'cache-first',
  });

  const noRequest =
    !loading &&
    !data?.receivedFriendRequests?.users.length &&
    !data?.sentFriendRequests?.users.length;

  const [acceptFriendRequest] = useAcceptFriendRequestMutation({});
  const [removeReceivedFriendRequest] = useRemoveReceivedFriendRequestMutation({});

  const acceptAllClick = () => {
    if (!data?.receivedFriendRequests?.users.length) {
      return;
    }

    data.receivedFriendRequests.users.forEach((user) =>
      acceptFriendRequest({ variables: { friendId: user.userId, userId } }),
    );
  };

  const declineAllClick = () => {
    if (!data?.receivedFriendRequests?.users.length) {
      return;
    }

    data.receivedFriendRequests.users.forEach((user) =>
      removeReceivedFriendRequest({ variables: { friendId: user.userId, userId } }),
    );
  };

  return (
    <div
      aria-busy={loading ? 'true' : 'false'}
      className={classNames(styles.wrapper, className)}
    >
      <div className={styles.content}>
        <div className={styles.backButtonWrapper}>
          <Button
            level="secondary"
            size="sm"
            onClick={onBackButtonClick}
          >
            Back to friends list
          </Button>
        </div>

        <hr className={styles.divider} />

        {loading && <FriendsSidebarFriendList.Loading />}

        {!!data?.sentFriendRequests?.users.length && (
          <FriendsSidebarFriendList friends={data.sentFriendRequests.users} />
        )}

        {!!data?.receivedFriendRequests?.users.length && (
          <>
            <FriendsSidebarFriendList friends={data.receivedFriendRequests.users} />

            <div className={styles.allButtons}>
              <Button
                level="secondary"
                size="sm"
                onClick={acceptAllClick}
              >
                Accept All
              </Button>
              <Button
                level="secondary"
                size="sm"
                onClick={declineAllClick}
              >
                Decline All
              </Button>
            </div>
          </>
        )}

        {noRequest && <div className={styles.emptyResult}>No pending requests</div>}
      </div>

      <div className={styles.footer}>
        <Button
          iconStart={CoreAssets.Icons.AddFriend}
          level="secondary"
          size="sm"
          onClick={onAddFriendClick}
        >
          Add friend
        </Button>
      </div>
    </div>
  );
}
