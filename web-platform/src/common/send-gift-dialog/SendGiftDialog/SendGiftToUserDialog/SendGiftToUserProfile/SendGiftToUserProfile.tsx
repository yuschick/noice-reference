import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';

import styles from './SendGiftToUserProfile.module.css';

import { SendGiftToUserProfileFragment } from '@gen';

gql`
  fragment SendGiftToUserProfile on ProfileProfile {
    userTag
    ...ProfileImageProfile
  }
`;

interface Props {
  title: string;
  profile: SendGiftToUserProfileFragment;
}

export function SendGiftToUserProfile({ title, profile }: Props) {
  const { userTag } = profile;

  return (
    <div className={styles.giftProfileWrapper}>
      <span className={styles.giftProfileTitle}>{title}</span>

      <div className={styles.giftProfileContent}>
        <ProfileImage profile={profile} />

        <span>{userTag}</span>
      </div>
    </div>
  );
}
