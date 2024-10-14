import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';

import styles from './PlatformSuspendedUser.module.css';

import { Button } from '@common/button';
import {
  SuspendedUserPlatformSuspensionFragment,
  ModerationAppealStatus,
  useUnsuspendPlatformUserMutation,
} from '@gen';

gql`
  mutation UnsuspendPlatformUser($userId: ID!) {
    unbanPlatformUser(userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  platformSuspension: SuspendedUserPlatformSuspensionFragment;
  onOpenReviewModal(): void;
  onUnsuspend(): void;
}

export function PlatformSuspendedUser({
  platformSuspension,
  onOpenReviewModal,
  onUnsuspend,
}: Props) {
  const [unbanUser] = useUnsuspendPlatformUserMutation({
    onCompleted() {
      onUnsuspend();
    },
  });

  const handleUnbanUser = () => {
    unbanUser({ variables: { userId: platformSuspension.userId } });
  };

  const hasAppeal =
    platformSuspension.appeal?.status === ModerationAppealStatus.AppealStatusPending;

  return (
    <>
      <div className={styles.actions}>
        <span className={styles.warn}>User is suspended from the platform.</span>
        {!hasAppeal && (
          <Button
            buttonType="success"
            size="medium"
            text="Lift suspension"
            onClick={handleUnbanUser}
          />
        )}
      </div>
      {hasAppeal && (
        <div className={styles.actions}>
          <span className={styles.success}>
            Pending suspension appeal submitted by the user
          </span>
          <Button
            buttonType="success"
            size="medium"
            text="Review appeal"
            onClick={onOpenReviewModal}
          />
        </div>
      )}

      <>
        <div className={styles.suspendedBy}>
          <div className={styles.suspendColumn}>
            <span className={styles.label}>Suspended by</span>
            <span className={styles.avatarWrapper}>
              <ProfileImage
                profile={platformSuspension.moderator}
                size="xs"
              />
              <span>{platformSuspension.moderator.userTag}</span>
            </span>
          </div>
          <div className={styles.suspendColumn}>
            <span className={styles.label}>Date</span>
            <time dateTime={platformSuspension.bannedAt}>
              {DateAndTimeUtils.ShortDates.format(new Date(platformSuspension.bannedAt))}
            </time>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Suspension reason</h3>
          <p className={styles.description}>{platformSuspension.violation}</p>
        </div>

        <div>
          <h3 className={styles.title}>Moderator note</h3>
          <p className={styles.description}>{platformSuspension.description}</p>
        </div>
      </>
    </>
  );
}

PlatformSuspendedUser.fragments = {
  entry: gql`
    fragment SuspendedUserPlatformSuspension on ModerationPlatformBan {
      appeal {
        status
        banId
      }
      bannedAt
      banId
      userId
      description
      moderator {
        userId
        userTag
        ...ProfileImageProfile
      }
      violation
    }
  `,
};
