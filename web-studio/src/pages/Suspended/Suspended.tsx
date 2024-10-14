import { gql } from '@apollo/client';
import {
  ButtonLink,
  CommonUtils,
  FullscreenSpinner,
  NoiceLogo,
  ProfileImage,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router';

import styles from './Suspended.module.css';

import { Routes } from '@common/route';
import { useStudioSuspendedQuery } from '@gen';

gql`
  query StudioSuspended($userId: ID) {
    platformBan(userId: $userId) {
      banId
      expiresAt
      violation
      description
    }

    profile(userId: $userId) {
      userId
      userTag
      ...ProfileImageProfile
    }
  }
`;

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

export function Suspended() {
  const { userId } = useAuthenticatedUser();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading } = useStudioSuspendedQuery({ variables: { userId } });

  if (loading) {
    return <FullscreenSpinner />;
  }

  if (!data?.profile) {
    navigate(Routes.LogOut);
    return null;
  }

  if (!data?.platformBan && !location?.state?.forceBan) {
    navigate(Routes.StreamManager, { replace: true });
    return null;
  }

  const { profile, platformBan } = data;
  const { userTag } = profile;
  const { expiresAt, violation, description } = platformBan ?? {};

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.logo}>
        <NoiceLogo
          height={38}
          theme="spectrum"
          variant="mark"
        />
        Studio
      </div>

      <h1 className={styles.banHeading}>
        Your account has been suspended <SuspensionDuration value={expiresAt ?? null} />
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
          <ProfileImage profile={profile} />
        </div>

        <div className={styles.banSectionInnerWrapper}>
          <div>
            <span className={styles.banSectionHeading}>Username</span>
            <div className={styles.banSectionValue}>{userTag}</div>
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
          {violation && (
            <span className={styles.banSectionHeading}>
              {CommonUtils.getPlatformViolationText(violation)}
            </span>
          )}

          {!!description && (
            <div>
              <span className={styles.banSectionHeading}>Moderator note</span>
              <div className={styles.banSectionValue}>{description}</div>
            </div>
          )}

          <p className={styles.banDescription}>
            If you believe this is an error, you may appeal this suspension by logging
            into{' '}
            <a
              className={styles.link}
              href={NOICE.PLATFORM_URL}
            >
              Noice Platform
            </a>
          </p>
        </div>
      </section>

      <div className={styles.logoutButtonWrapper}>
        <ButtonLink
          fit="content"
          level="secondary"
          size="sm"
          to={Routes.LogOut}
        >
          Log out
        </ButtonLink>
      </div>
    </main>
  );
}
