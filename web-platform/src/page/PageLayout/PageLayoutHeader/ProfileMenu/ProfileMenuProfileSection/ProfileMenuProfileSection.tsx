import { gql } from '@apollo/client';
import { LoadingSkeleton, ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './ProfileMenuProfileSection.module.css';

import {
  ProfileMenuImplicitAccountProfileSectionProfileFragment,
  ProfileMenuProfileSectionProfileFragment,
} from '@gen';

gql`
  fragment ProfileMenuProfileSectionProfile on ProfileProfile {
    userTag
    settings {
      privacy {
        hideOnlineStatus
      }
    }
    ...ProfileImageShowOnlineStatusProfile
  }

  fragment ProfileMenuImplicitAccountProfileSectionProfile on ProfileProfile {
    userTag
    ...ProfileImageProfile
  }
`;

type Props =
  | {
      profile: ProfileMenuProfileSectionProfileFragment;
      isImplicitAccount?: false;
    }
  | {
      profile: ProfileMenuImplicitAccountProfileSectionProfileFragment;
      isImplicitAccount: true;
    };

export function ProfileMenuProfileSection({ profile, isImplicitAccount }: Props) {
  const { userTag } = profile;

  if (isImplicitAccount) {
    return (
      <section className={styles.profileMenuProfileWrapper}>
        <ProfileImage profile={profile} />

        <span className={styles.name}>{userTag}</span>
      </section>
    );
  }

  const { settings } = profile;
  const onlineStatus = settings?.privacy.hideOnlineStatus ? 'Offline' : 'Online';

  return (
    <section className={styles.profileMenuProfileWrapper}>
      <ProfileImage
        profile={profile}
        showOnlineStatus={!isImplicitAccount}
      />

      <div>
        <span className={styles.name}>{userTag}</span>

        {!isImplicitAccount && (
          <span
            className={classNames(styles.onlineStatus, {
              [styles.offline]: onlineStatus === 'Offline',
            })}
          >
            {profile.settings?.privacy.hideOnlineStatus ? 'Offline' : 'Online'}
          </span>
        )}
      </div>
    </section>
  );
}

ProfileMenuProfileSection.Loading = () => {
  return (
    <section className={styles.profileMenuProfileWrapper}>
      <ProfileImage.Loading />

      <LoadingSkeleton />
    </section>
  );
};
