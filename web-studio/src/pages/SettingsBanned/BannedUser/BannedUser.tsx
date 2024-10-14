import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, ProfileImage } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './BannedUser.module.css';

import { BannedUserBannedUserFragment, ChannelAppealStatus } from '@gen';

interface Props extends BannedUserBannedUserFragment {
  isActive: boolean;
  onBannedUserClick(userId: string): void;
}

export function BannedUser({
  user,
  bannedAt,
  userId,
  isActive,
  appeal,
  onBannedUserClick,
}: Props) {
  return (
    <button
      className={classNames(styles.wrapper, { [styles.active]: isActive })}
      onClick={() => onBannedUserClick(userId)}
    >
      <div className={styles.userWrapper}>
        <div className={styles.profileImageWrapper}>
          <ProfileImage
            profile={user}
            size="xs"
          />
        </div>

        <div>
          <span className={styles.name}>{user.userTag}</span>
          <span className={styles.bannedAt}>
            Banned since {DateAndTimeUtils.getShortDate(bannedAt)}
          </span>
        </div>
      </div>

      <div className={styles.rightSide}>
        {appeal?.status === ChannelAppealStatus.AppealStatusPending && (
          <div className={styles.openAppeal}>Open Appeal</div>
        )}

        {appeal?.status === ChannelAppealStatus.AppealStatusDeclined && (
          <div className={styles.rejectedAppeal}>Appeal rejected</div>
        )}

        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.ChevronRight}
        />
      </div>
    </button>
  );
}

BannedUser.fragments = {
  entry: gql`
    fragment BannedUserBannedUser on ChannelBannedUser {
      userId
      bannedAt
      user {
        userId
        userTag
        avatars {
          avatar2D
        }
        ...ProfileImageProfile
      }
      appeal {
        status
      }
    }
  `,
};
