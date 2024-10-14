import { gql } from '@apollo/client';
import { ProfileImage, CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';

import styles from './SuspensionStatus.module.css';

import { Button } from '@common/button';
import { ModeratorActionData } from '@common/moderation/ModeratorActionData';
import { ContentModulePage } from '@common/page-components';
import { Pill } from '@common/text';
import { ModerationAppealStatus, SuspensionStatusPlatformSuspensionFragment } from '@gen';

export interface Props {
  platformSuspension: Nullable<SuspensionStatusPlatformSuspensionFragment>;
  onSuspendButtonClick(): void;
  onUnsuspendButtonClick(): void;
  onReviewAppealClick(): void;
}

const getStatusButton = (
  isSuspended: boolean,
  appealStatus: Nullable<ModerationAppealStatus>,
  onSuspendButtonClick: () => void,
  onUnsuspendButtonClick: () => void,
) => {
  if (!isSuspended) {
    return (
      <Button
        buttonType="danger"
        text="Suspend user from Noice"
        onClick={onSuspendButtonClick}
      />
    );
  }

  if (!appealStatus || appealStatus === ModerationAppealStatus.AppealStatusDeclined) {
    return (
      <Button
        buttonType="success"
        text="Lift suspension"
        onClick={onUnsuspendButtonClick}
      />
    );
  }

  return null;
};

export function SuspensionStatus({
  platformSuspension,
  onSuspendButtonClick,
  onUnsuspendButtonClick,
  onReviewAppealClick,
}: Props) {
  const appealStatus = platformSuspension?.appeal?.status ?? null;

  return (
    <ContentModulePage.Content title="Platform Suspension">
      <h3 className={styles.title}>Suspension status</h3>

      <div className={styles.suspensionStatus}>
        {!platformSuspension ? (
          'User is currently not suspended from the platform.'
        ) : (
          <div className={styles.suspendedWrapper}>
            <Pill
              size="medium"
              text="Suspended"
              type="error"
            />

            <span className={styles.expireDate}>
              {platformSuspension.expiresAt ? (
                <>
                  Expires on{' '}
                  <time
                    dateTime={DateAndTimeUtils.getHTMLAttributeTime(
                      platformSuspension.expiresAt,
                    )}
                  >
                    {DateAndTimeUtils.getShortDate(platformSuspension.expiresAt)} at{' '}
                    {DateAndTimeUtils.getTime(platformSuspension.expiresAt)}
                  </time>
                </>
              ) : (
                'Indefinitely'
              )}
            </span>
          </div>
        )}

        {getStatusButton(
          !!platformSuspension,
          appealStatus,
          onSuspendButtonClick,
          onUnsuspendButtonClick,
        )}
      </div>

      {platformSuspension && (
        <ModeratorActionData
          actionTimestamp={platformSuspension.bannedAt}
          moderator={platformSuspension.moderator}
          note={platformSuspension.description}
          violation={CommonUtils.getPlatformViolationText(platformSuspension.violation)}
        >
          {platformSuspension.appeal && (
            <>
              <div className={styles.content}>
                <h3 className={styles.title}>Appeal</h3>

                <div className={styles.suspensionStatus}>
                  <Pill
                    size="medium"
                    text={
                      platformSuspension.appeal.status ===
                      ModerationAppealStatus.AppealStatusDeclined
                        ? 'Rejected'
                        : 'Pending'
                    }
                    type={
                      platformSuspension.appeal.status ===
                      ModerationAppealStatus.AppealStatusDeclined
                        ? 'error'
                        : 'warning'
                    }
                  />

                  {platformSuspension.appeal.status !==
                    ModerationAppealStatus.AppealStatusDeclined && (
                    <Button
                      buttonType="primary"
                      text="Review appeal"
                      onClick={onReviewAppealClick}
                    />
                  )}
                </div>
              </div>

              {platformSuspension.appeal.reviewer && (
                <div className={styles.suspensionInfo}>
                  <div className={styles.suspensionInfoColumn}>
                    <span className={styles.suspensionInfoTitle}>Appeal reviewed by</span>
                    <div className={styles.moderatorWrapper}>
                      <ProfileImage
                        profile={platformSuspension.appeal.reviewer}
                        size="xs"
                      />
                      <span>{platformSuspension.appeal.reviewer.userTag}</span>
                    </div>
                  </div>

                  {!!platformSuspension.appeal.closedAt && (
                    <div className={styles.suspensionInfoColumn}>
                      <span className={styles.suspensionInfoTitle}>Review date</span>
                      <div className={styles.dateWrapper}>
                        <time
                          dateTime={DateAndTimeUtils.getHTMLAttributeTime(
                            platformSuspension.appeal.closedAt,
                          )}
                        >
                          {DateAndTimeUtils.getShortDate(
                            platformSuspension.appeal.closedAt,
                          )}{' '}
                          at{' '}
                          {DateAndTimeUtils.getTime(platformSuspension.appeal.closedAt)}
                        </time>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!!platformSuspension.appeal.reviewerComment && (
                <div className={styles.content}>
                  <h3 className={styles.title}>Reviewer comment</h3>

                  <p className={styles.description}>
                    {platformSuspension.appeal.reviewerComment || '-'}
                  </p>
                </div>
              )}
            </>
          )}
        </ModeratorActionData>
      )}
    </ContentModulePage.Content>
  );
}

SuspensionStatus.fragments = {
  entry: gql`
    fragment SuspensionStatusPlatformSuspension on ModerationPlatformBan {
      appeal {
        banId
        status
        reviewer {
          userId
          userTag
          ...ProfileImageProfile
        }
        closedAt
        reviewerComment
      }
      moderator {
        userId
        ...ModeratorProfile
      }
      bannedAt
      violation
      description
      expiresAt
    }
  `,
};
