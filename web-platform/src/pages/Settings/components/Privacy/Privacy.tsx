import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';

import { OnlineStatusSetting } from '../OnlineStatusSetting/OnlineStatusSetting';

import { BlockedUsers } from './BlockedUsers/BlockedUsers';
import { ContentWarningsSetting } from './ContentWarningsSetting/ContentWarningsSetting';
import { CookiesConsent } from './CookiesConsent/CookiesConsent';
import { DiscordUsernameSettings } from './DiscordUsernameSettings/DiscordUsernameSettings';
import { FriendRequestSetting } from './FriendRequestSetting/FriendRequestSetting';
import styles from './Privacy.module.css';
import { ProfilePageSettings } from './ProfilePageSettings/ProfilePageSettings';
import { PurchaseVisibilitySetting } from './PurchaseVisibilitySetting/PurchaseVisibilitySetting';
import { RequestMyDataButton } from './RequestMyDataButton/RequestMyDataButton';

import { useScrollToElementByAnchorHash } from '@common/navigation';
import { usePrivacyConnectionsDataQuery } from '@gen';

interface Props {
  profilePagePath: string;
}

gql`
  query PrivacyConnectionsData($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ContentWarningSettingProfile
      ...PurchaseVisibilitySettingProfile
      ...DiscordUsernameSettingsProfile
      ...ProfilePageSettingsProfile
      ...FriendRequestSettingProfile
      ...OnlineStatusSettingProfile
    }

    blockedUsers(userId: $userId) {
      users {
        userId
        ...BlockedUsersFriendUser
      }
    }
  }
`;

export function Privacy({ profilePagePath }: Props) {
  useScrollToElementByAnchorHash();
  const { userId } = useAuthenticatedUser();
  const { data } = usePrivacyConnectionsDataQuery({ variables: { userId } });

  if (!data?.profile) {
    return null;
  }

  const profile = data.profile;

  return (
    <>
      <OnlineStatusSetting profile={profile} />

      <FriendRequestSetting profile={profile} />

      <ProfilePageSettings
        profile={profile}
        profilePagePath={profilePagePath}
      />

      <DiscordUsernameSettings profile={profile} />

      <PurchaseVisibilitySetting profile={profile} />

      <ContentWarningsSetting profile={profile} />

      <CookiesConsent />

      <div className={styles.blockedUserWrapper}>
        <div>
          <h2 className={styles.title}>Blocked Users</h2>

          <p className={classNames(styles.description, styles.withoutMargin)}>
            Blocking a user will:
          </p>

          <ul className={classNames(styles.description, styles.list)}>
            <li>Prevent them from seeing your profile</li>
            <li> Prevent both of you from seeing each other in chat or leaderboard</li>
            <li>Prevent them from being in the same team or party as you</li>
          </ul>
        </div>

        <BlockedUsers blockedUsers={data.blockedUsers?.users ?? []} />
      </div>

      <RequestMyDataButton />
    </>
  );
}
