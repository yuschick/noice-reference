import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';
import { ImgHTMLAttributes } from 'react';

import { Icon } from '../Icon';
import { Image } from '../Image';

import styles from './ProfileImage.module.css';

import {
  ProfileImageProfileFragment,
  ProfileImageShowOnlineStatusProfileFragment,
  ProfilePresenceStatus,
} from '@common-gen';

export const profileImageSizes = ['xs', 'sm', 'md', 'lg'] as const;
export const profileImageStatuses = ['offline', 'online'] as const;

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
};

interface ShowOnlineProps {
  showOnlineStatus: true;
  profile: ProfileImageShowOnlineStatusProfileFragment;
}

type Props = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'className' | 'onError' | 'src' | 'style' | 'onLoad'
> &
  (
    | ShowOnlineProps
    | { profile: ProfileImageProfileFragment; showOnlineStatus?: false }
  ) & {
    /**
     * Override the default (md) size of the profile image.
     */
    size?: (typeof profileImageSizes)[number];
  };

export function ProfileImage({
  profile,
  showOnlineStatus,
  size = 'md',
  ...htmlAttributes
}: Props) {
  const showAsOffline =
    (showOnlineStatus && profile.settings?.privacy?.hideOnlineStatus) ||
    (showOnlineStatus &&
      profile.onlineStatus !== ProfilePresenceStatus.PresenceStatusOnline);
  const showAsOnline =
    showOnlineStatus &&
    !profile.settings?.privacy?.hideOnlineStatus &&
    profile.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline;

  return (
    <div
      className={classNames(styles.profileImageStatusWrapper, styles[size], {
        [styles.showAsOffline]: showAsOffline,
        [styles.showAsOnline]: showAsOnline,
      })}
    >
      <div className={styles.profileImageWrapper}>
        {profile.avatars?.avatar2D ? (
          <Image
            alt={profile.userTag}
            className={styles.profileImage}
            fit="cover"
            src={profile.avatars?.avatar2D}
            width={sizeMap[size]}
            {...htmlAttributes}
          />
        ) : (
          <Icon
            className={styles.profileImagePlaceholder}
            icon={CoreAssets.Icons.AvatarPlaceholder}
          />
        )}
      </div>

      {showOnlineStatus && (
        <div
          aria-live="polite"
          className={styles.profileStatusWrapper}
        >
          {showAsOnline && (
            <div
              aria-label={`${profile.userTag} is online`}
              className={styles.profileStatusIndicator}
              role="status"
            />
          )}
        </div>
      )}
    </div>
  );
}

ProfileImage.Loading = ({ size = 'md' }: Pick<Props, 'size'>) => (
  <span className={classNames(styles.profileImageStatusWrapper, styles[size])}>
    <span className={classNames(styles.profileImageWrapper, styles.loading)} />
  </span>
);

ProfileImage.Empty = ({ size = 'md' }: Pick<Props, 'size'>) => (
  <div className={classNames(styles.profileImageStatusWrapper, styles[size])}>
    <div className={styles.profileImageWrapper}>
      <Icon
        className={styles.profileImagePlaceholder}
        icon={CoreAssets.Icons.AvatarPlaceholder}
      />
    </div>
  </div>
);

ProfileImage.fragments = {
  entry: gql`
    fragment ProfileImageProfile on ProfileProfile {
      avatars {
        avatar2D
      }
      userTag
    }

    fragment ProfileImageShowOnlineStatusProfile on ProfileProfile {
      ...ProfileImageProfile
      onlineStatus
      settings {
        privacy {
          hideOnlineStatus
        }
      }
    }
  `,
};
