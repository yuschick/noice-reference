import { gql } from '@apollo/client';
import { ProfileImage, WithChildren } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';

import styles from './ModeratorActionData.module.css';

import { ModeratorProfileFragment } from '@gen';

interface Props extends WithChildren {
  moderator: Nullable<ModeratorProfileFragment>;
  actionTimestamp: string;
  violation?: string;
  note: string;
}

export function ModeratorActionData({
  moderator,
  actionTimestamp,
  violation,
  children,
  note,
}: Props) {
  return (
    <>
      <div className={styles.suspensionInfo}>
        {moderator && (
          <div className={styles.suspensionInfoColumn}>
            <span className={styles.suspensionInfoTitle}>Moderator</span>

            <div className={styles.moderatorWrapper}>
              <ProfileImage
                profile={moderator}
                size="xs"
              />
              <span>{moderator.userTag}</span>
            </div>
          </div>
        )}

        <div className={styles.suspensionInfoColumn}>
          <span className={styles.suspensionInfoTitle}>Date</span>
          <div className={styles.dateWrapper}>
            <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(actionTimestamp)}>
              {DateAndTimeUtils.getShortDate(actionTimestamp)} at{' '}
              {DateAndTimeUtils.getTime(actionTimestamp)}
            </time>
          </div>
        </div>
      </div>

      {!!violation && (
        <div className={styles.content}>
          <h3 className={styles.title}>Reason</h3>

          <span className={styles.violation}>{violation}</span>
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>Enforcement note</h3>

        <p className={styles.description}>{note || '-'}</p>
      </div>

      {children}
    </>
  );
}

ModeratorActionData.fragments = {
  entry: gql`
    fragment ModeratorProfile on ProfileProfile {
      userId
      userTag
      ...ProfileImageProfile
    }
  `,
};
