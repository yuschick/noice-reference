import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import { ProfilePageHeader } from '../ProfilePageHeader';
import { ProfilePageLayout } from '../ProfilePageLayout';

import styles from './PrivateProfile.module.css';

import { usePrivateProfilePageQuery } from '@gen';
import { NotFound } from '@pages/NotFound';

gql`
  query PrivateProfilePage($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ProfilePageHeaderProfile
    }
  }
`;

interface Props {
  profileUserId: string;
}

export function PrivateProfile({ profileUserId }: Props) {
  const { data, loading } = usePrivateProfilePageQuery({
    variables: { userId: profileUserId },
  });

  const profile = data?.profile;

  if (loading) {
    return (
      <ProfilePageLayout>
        <ProfilePageHeader.Loading />
      </ProfilePageLayout>
    );
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <ProfilePageLayout>
      <ProfilePageHeader profile={profile} />

      <div className={styles.content}>
        <Icon icon={CoreAssets.Icons.Lock} />
        <span>This profile is private</span>
      </div>
    </ProfilePageLayout>
  );
}
