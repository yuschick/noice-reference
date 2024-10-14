import { gql } from '@apollo/client';
import { CommonUtils, ProfileImage, Button } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './BanDetails.module.css';

import { LayoutBox } from '@common/layout';
import { BanDetailsUserFragment, ChannelAppealStatus } from '@gen';

interface Props extends BanDetailsUserFragment {
  onUnBanClick(userId: string): void;
  onRejectAppeal(userId: string): void;
  onAcceptAppeal(userId: string): void;
}

export function BanDetails({
  userId,
  user,
  moderator,
  bannedAt,
  violation,
  description,
  appeal,
  onUnBanClick,
  onRejectAppeal,
  onAcceptAppeal,
}: Props) {
  return (
    <LayoutBox>
      <div
        className={classNames(styles.wrapper, {
          [styles.rejectedAppeal]:
            appeal?.status === ChannelAppealStatus.AppealStatusDeclined,
        })}
      >
        <div className={styles.top}>
          <span className={styles.title}>Ban</span>
          <span className={styles.date}>{DateAndTimeUtils.getShortDate(bannedAt)}</span>
        </div>

        <div className={styles.users}>
          <div className={styles.user}>
            <div className={styles.profileImageWrapper}>
              <ProfileImage
                profile={user}
                size="lg"
              />
            </div>

            <div className={styles.nameWrapper}>
              <span className={styles.label}>{user.userTag}</span>
            </div>
          </div>

          <div className={styles.nameWrapper}>
            <span className={styles.label}>Ban given by</span>
            <span className={styles.value}>{moderator.userTag}</span>
          </div>
        </div>

        <div className={styles.banDetail}>
          <span className={styles.label}>Reason for ban</span>
          <span className={styles.value}>
            {CommonUtils.getChannelViolationText(violation)}
          </span>
        </div>

        <div className={styles.banDetail}>
          <span className={styles.label}>Moderator note</span>
          <div className={styles.value}>{description || '–'}</div>
        </div>

        {appeal ? (
          <div className={styles.appealWrapper}>
            <div className={styles.top}>
              <span className={styles.appealTitle}>Appeal</span>
              <span className={styles.date}>
                {DateAndTimeUtils.getShortDate(appeal.createdAt)}
              </span>
            </div>

            <div className={styles.value}>{appeal.appealText}</div>

            <div className={styles.buttons}>
              {appeal.status === ChannelAppealStatus.AppealStatusDeclined ? (
                <>
                  <span className={styles.rejectedLabel}>Appeal rejected</span>

                  <Button
                    level="secondary"
                    size="sm"
                    onClick={() => onUnBanClick(userId)}
                  >
                    Unban user
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="cta"
                    onClick={() => onAcceptAppeal(userId)}
                  >
                    Accept appeal & Unban user
                  </Button>
                  <Button
                    level="secondary"
                    size="sm"
                    onClick={() => onRejectAppeal(userId)}
                  >
                    Reject appeal
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Button
              size="sm"
              variant="cta"
              onClick={() => onUnBanClick(userId)}
            >{`Unban ${user.userTag}`}</Button>
          </div>
        )}
      </div>
    </LayoutBox>
  );
}

BanDetails.fragments = {
  entry: gql`
    fragment BanDetailsUser on ChannelBannedUser {
      user {
        userId
        avatars {
          avatar2D
        }
        userTag
        ...ProfileImageProfile
      }
      userId
      bannedAt
      violation
      description
      moderator {
        userId
        userTag
      }
      appeal {
        status
        appealText
        createdAt
      }
    }
  `,
};
