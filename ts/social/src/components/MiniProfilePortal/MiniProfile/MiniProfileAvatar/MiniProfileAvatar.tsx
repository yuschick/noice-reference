import { gql } from '@apollo/client';
import { CommonUtils, useMediaQuery, Image } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

import styles from './MiniProfileAvatar.module.css';

import BackgroundImage from '@social-assets/images/mini-profile-avatar-bg.webp';
import { MiniProfileAvatarProfileFragment } from '@social-gen';

gql`
  fragment MiniProfileAvatarProfile on ProfileProfile {
    avatars {
      avatarFullbody
    }
    userTag
  }
`;

interface Props {
  profile: MiniProfileAvatarProfileFragment;
}

export function MiniProfileAvatar({ profile }: Props) {
  const { avatars, userTag } = profile;

  const isSmallScreen = useMediaQuery(`(max-width: ${CommonUtils.getRem(599)})`);

  if (isSmallScreen || !avatars?.avatarFullbody) {
    return null;
  }

  return (
    <div
      className={styles.miniProfileAvatarWrapper}
      style={
        {
          '--_mini-profile-avatar-background-image': `url(${BackgroundImage})`,
        } as CSSProperties
      }
    >
      <Image
        alt={`${userTag}'s avatar`}
        className={styles.miniProfileAvatar}
        src={avatars?.avatarFullbody}
        width={160}
      />
    </div>
  );
}
