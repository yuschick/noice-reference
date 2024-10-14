import { Button } from '@noice-com/common-ui';

import { BanDetails } from './BanDetails/BanDetails';
import { BannedUser } from './BannedUser/BannedUser';
import { useBannedUsers } from './hooks/useBannedUsers.hook';
import { SettingsBanForm } from './SettingsBanForm';
import styles from './SettingsBanned.module.css';

import { PageHeading, LayoutBox } from '@common/layout';

export function SettingsBanned() {
  const {
    bannedUsers,
    hasNextPage,
    fetchMoreUsers,
    activeBannedUser,
    setActiveBannedUserId,
  } = useBannedUsers();

  return (
    <>
      <PageHeading
        description="Banned users cannot access your channel or make purchases in your channel store."
        title="Banned users"
      />

      <SettingsBanForm />

      <LayoutBox>
        {bannedUsers?.length ? (
          <ul className={styles.userList}>
            {bannedUsers?.map((user) => (
              <li key={user.userId}>
                <BannedUser
                  appeal={user.appeal}
                  bannedAt={user.bannedAt}
                  isActive={activeBannedUser?.userId === user.userId}
                  user={user.user}
                  userId={user.userId}
                  onBannedUserClick={setActiveBannedUserId}
                />
              </li>
            ))}
          </ul>
        ) : (
          <span className={styles.emptyList}>No banned users</span>
        )}

        {!!hasNextPage && (
          <Button
            fit="content"
            level="secondary"
            size="xs"
            onClick={fetchMoreUsers}
          >
            Show more
          </Button>
        )}
      </LayoutBox>

      {activeBannedUser && <BanDetails {...activeBannedUser} />}
    </>
  );
}
