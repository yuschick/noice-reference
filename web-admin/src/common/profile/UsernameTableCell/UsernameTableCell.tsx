import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';

import styles from './UsernameTableCell.module.css';

import { UsernameTableCellProfileFragment } from '@gen';

interface Props {
  profile: UsernameTableCellProfileFragment;
}

export function UsernameTableCell({ profile }: Props) {
  const { userTag } = profile;

  return (
    <div className={styles.wrapper}>
      <ProfileImage
        profile={profile}
        size="xs"
      />
      <span>{userTag}</span>
    </div>
  );
}

UsernameTableCell.fragment = {
  entry: gql`
    fragment UsernameTableCellProfile on ProfileProfile {
      userTag
      ...ProfileImageProfile
    }
  `,
};
