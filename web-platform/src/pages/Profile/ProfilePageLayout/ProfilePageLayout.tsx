import { gql } from '@apollo/client';
import { Image, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './ProfilePageLayout.module.css';

import { ProfilePageLayoutProfileFragment } from '@gen';

interface Props extends WithChildren {
  isPrivatePage?: boolean;
  profile?: ProfilePageLayoutProfileFragment;
}

export function ProfilePageLayout({ children, isPrivatePage, profile }: Props) {
  return (
    <article
      className={classNames(styles.profileContainer, {
        [styles.privatePage]: isPrivatePage,
      })}
    >
      <div className={styles.content}>{children}</div>

      {!!profile?.avatars?.avatarFullbody && (
        <Image
          alt={`Avatar for user ${profile.userTag}`}
          className={styles.avatar}
          height={1006}
          loadingType="none"
          src={profile.avatars.avatarFullbody}
          width={530}
        />
      )}
    </article>
  );
}

ProfilePageLayout.fragments = {
  entry: gql`
    fragment ProfilePageLayoutProfile on ProfileProfile {
      avatars {
        avatarFullbody
      }
      userTag
    }
  `,
};
