import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  LoadingSpinner,
  ProfileImage,
  SetTimeoutId,
  useAuthenticatedUser,
  Button,
  NoiceLogo,
  ButtonLink,
  CommonUtils,
  Anchor,
  VisuallyHidden,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';

import styles from './NoAccess.module.css';

import { Routes } from '@common/route';
import { ToastNotifications } from '@common/toast';
import { useNoAccessUserDataQuery } from '@gen';

const RETRY_COOLDOWN = 5 * 1000;

gql`
  query NoAccessUserData($userId: ID) {
    profile(userId: $userId) {
      preferredColor
      userId
      userTag
      ...ProfileImageProfile
    }

    userPrivilegedChannels(userId: $userId) {
      channels {
        channelId
      }
    }
  }
`;

const getPathToRedirect = (prevPath?: string) => {
  if (!prevPath || prevPath === Routes.NoAccess) {
    return '/';
  }

  return prevPath;
};

export function NoAccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, hasRole } = useAuthenticatedUser();

  const isNoiceStaff = hasRole('admin') || hasRole('px_agent');

  const timer = useRef<Nullable<SetTimeoutId>>(null);
  const [retryDisabled, setRetryDisabled] = useState(false);

  const { data, loading, refetch, previousData } = useNoAccessUserDataQuery({
    variables: {
      userId,
    },
    // Load profile always so this is not cache problem
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      // If there is no profile, log user out
      if (!data.profile) {
        navigate(Routes.LogOut, { replace: true });
        return;
      }

      // If user has access to any channel, redirect to the channel
      if (data.userPrivilegedChannels?.channels.length) {
        navigate(getPathToRedirect(location.state?.prevPath), { replace: true });
        return;
      }
    },
    skip: isNoiceStaff,
  });

  const profile = data?.profile ?? previousData?.profile;

  const loadingProfile = loading && !previousData?.profile;

  useMountEffect(() => {
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  });

  // Redirect noice staff to the studio
  useEffect(() => {
    if (isNoiceStaff) {
      navigate(getPathToRedirect(location.state?.prevPath), { replace: true });
    }
  }, [isNoiceStaff, location.state?.prevPath, navigate]);

  const handleRetry = async () => {
    const result = await refetch();

    if (!result.data.userPrivilegedChannels?.channels.length) {
      timer.current = setTimeout(() => setRetryDisabled(false), RETRY_COOLDOWN);
      setRetryDisabled(true);
      toast.error('Sorry, still no rights to any channel');
      return;
    }

    navigate(getPathToRedirect(location.state?.prevPath), { replace: true });
  };

  return (
    <div className={styles.noAccessWrapper}>
      <Helmet>
        <title>Noice Studio | No Access</title>
      </Helmet>

      <section className={styles.noAccessContentWrapper}>
        <div className={styles.studioLogoWrapper}>
          <NoiceLogo
            className={styles.logo}
            theme="light"
            variant="horizontal"
            width={198}
          />
          <h1>
            <VisuallyHidden>Noice</VisuallyHidden>
            Studio
          </h1>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.title}>You need creator or moderator rights</div>
          <p>
            Noice Studio is only available to creators or users who are moderators of a
            creator&apos;s channel. To join a live stream, go to the{' '}
            <Anchor href={NOICE.PLATFORM_URL}>Noice platform</Anchor>.
          </p>
        </div>

        <section className={styles.profileWrapper}>
          {loadingProfile ? (
            <LoadingSpinner />
          ) : (
            profile && (
              <>
                <ProfileImage
                  profile={profile}
                  size="lg"
                />

                <span
                  className={styles.username}
                  style={{
                    color: CommonUtils.getUserIdColor({
                      preferredColor: profile.preferredColor,
                      userId: profile.userId,
                    }),
                  }}
                >
                  {profile.userTag}
                </span>
              </>
            )
          )}

          <ButtonLink
            fit="content"
            level="secondary"
            size="xs"
            to={Routes.LogOut}
          >
            Log out
          </ButtonLink>
        </section>

        <div className={styles.actionsWrapper}>
          <ButtonLink
            size="sm"
            to={NOICE.PLATFORM_URL}
          >
            Go to Noice platform
          </ButtonLink>

          <Button
            isDisabled={retryDisabled}
            level="secondary"
            size="sm"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </section>

      <ToastNotifications />
    </div>
  );
}
