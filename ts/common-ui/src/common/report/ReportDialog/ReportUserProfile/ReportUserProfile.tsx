import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import styles from './ReportUserProfile.module.css';

import { ProfileImage } from '@common-components';
import { ReportedUserProfileFragment } from '@common-gen';

gql`
  fragment ReportedUserProfile on ProfileProfile {
    userTag
    ...ProfileImageProfile
  }
`;

interface Props {
  user: Nullable<ReportedUserProfileFragment>;
}

export const ReportUserProfile = ({ user }: Props) => {
  if (!user) {
    return null;
  }

  return (
    <div className={styles.user}>
      <ProfileImage profile={user} />

      <span>{user.userTag}</span>
    </div>
  );
};
