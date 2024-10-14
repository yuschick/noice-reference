import { gql } from '@apollo/client';
import { CommonUtils, ProfileImage, useAuthenticatedUser } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router';

import styles from './PlatformSuspension.module.css';
import { PlatformSuspensionAppealForm } from './PlatformSuspensionAppealForm/PlatformSuspensionAppealForm';

import { Routes } from '@common/route';
import { usePlatformSuspensionQuery } from '@gen';
import { NoAccessPage } from '@pages/common/NoAccessPage';

const SuspensionDuration = ({ value }: { value: Nullable<string> }) => {
  if (!value) {
    return <>indefinitely</>;
  }

  return (
    <>
      until{' '}
      <time dateTime={DateAndTimeUtils.getHTMLAttributeTime(value)}>
        {DateAndTimeUtils.ShortDates.format(new Date(value))}
      </time>
    </>
  );
};

export function PlatformSuspension() {
  const { userId } = useAuthenticatedUser();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading } = usePlatformSuspensionQuery({
    variables: { userId },
    onCompleted(data) {
      // User is not suspended from platform thus redirect to home, unless it is force banned
      if (!location?.state?.forceBan && !data.platformBan) {
        navigate(Routes.Home, { replace: true });
      }
    },
    // Fetch the data from the network to ensure the latest data
    fetchPolicy: 'cache-and-network',
  });

  const title = 'Your account has been suspended';

  return (
    <NoAccessPage
      loading={loading}
      title={title}
    >
      <h1 className={styles.banHeading}>
        Your account has been suspended{' '}
        <SuspensionDuration value={data?.platformBan?.expiresAt || null} />
      </h1>
      <p className={styles.banDescription}>
        You are not permitted to access Noice services via this or any other accounts as
        long as this suspension is in effect.
      </p>
      <section className={classNames(styles.banSectionWrapper, styles.horizontal)}>
        <div
          className={classNames(
            styles.banSectionContentWrapper,
            styles.banSectionHighlight,
          )}
        >
          {data?.profile && <ProfileImage profile={data.profile} />}
        </div>
        <div className={styles.banSectionInnerWrapper}>
          <div>
            <span className={styles.banSectionHeading}>Username</span>
            <div className={styles.banSectionValue}>{data?.profile?.userTag}</div>
          </div>
        </div>
      </section>

      <section className={classNames(styles.banSectionWrapper, styles.vertical)}>
        <div
          className={classNames(
            styles.banSectionContentWrapper,
            styles.banSectionHighlight,
          )}
        >
          Reason for suspension
        </div>

        <div className={styles.banSectionContentWrapper}>
          {!!data?.platformBan?.violation && (
            <span className={styles.banSectionHeading}>
              {CommonUtils.getPlatformViolationText(data.platformBan.violation)}
            </span>
          )}
          {!!data?.platformBan?.description && (
            <div>
              <span className={styles.banSectionHeading}>Moderator note</span>
              <div className={styles.banSectionValue}>{data.platformBan.description}</div>
            </div>
          )}
        </div>
      </section>

      <section className={classNames(styles.banSectionWrapper, styles.vertical)}>
        <div
          className={classNames(
            styles.banSectionContentWrapper,
            styles.banSectionHighlight,
          )}
        >
          If you believe this is an error, please tell us why we should reverse this
          suspension
        </div>

        <div className={styles.banSectionContentWrapper}>
          <PlatformSuspensionAppealForm appeal={data?.platformBan?.appeal || null} />
        </div>
      </section>
    </NoAccessPage>
  );
}

PlatformSuspension.fragments = {
  status: gql`
    fragment PlatformSuspensionStatus on ModerationPlatformBan {
      appeal {
        banId
        ...PlatformSuspensionAppeal
      }
      bannedAt
      description
      expiresAt
      status
      violation
    }
  `,
  profile: gql`
    fragment PlatformSuspensionProfile on ProfileProfile {
      avatars {
        avatar2D
      }
      userId
      userTag
      ...ProfileImageProfile
    }
  `,
};

gql`
  query PlatformSuspension($userId: ID) {
    platformBan(userId: $userId) {
      ...PlatformSuspensionStatus
      banId
    }

    profile(userId: $userId) {
      userId
      ...PlatformSuspensionProfile
    }
  }
  ${PlatformSuspension.fragments.status}
  ${PlatformSuspension.fragments.profile}
`;
