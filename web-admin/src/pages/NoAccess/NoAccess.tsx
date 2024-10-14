import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { SetTimeoutId, useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router';

import styles from './NoAccess.module.css';

import { Button, ButtonLink } from '@common/button';
import { LoginRoutes, allowedRoles } from '@common/route';
import { showSnackbar } from '@common/snackbar';
import { useNoAccessPermissionQuery } from '@gen';

gql`
  query NoAccessPermission($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      account {
        uid
        roles
      }
    }
  }
`;

const RETRY_COOLDOWN = 5 * 100 * 60;

export function NoAccess() {
  const { userId } = useAuthenticatedUser();
  const navigate = useNavigate();
  const location = useLocation();
  const timer = useRef<Nullable<SetTimeoutId>>(null);
  const [retryDisabled, setRetryDisabled] = useState(true);

  useMountEffect(() => {
    timer.current = setTimeout(() => setRetryDisabled(false), RETRY_COOLDOWN);

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  });

  const { data, refetch } = useNoAccessPermissionQuery({
    variables: {
      userId: userId,
    },
    onCompleted(data) {
      if (data?.profile?.account?.roles.some((role) => allowedRoles.includes(role))) {
        navigate(location.state?.prevPath ?? '/', { replace: true });
        return;
      }
    },
  });

  const onRetryClick = async () => {
    const { data } = await refetch();

    // Do nothing if there were access, on completed will take care of it
    if (data?.profile?.account?.roles.some((role) => allowedRoles.includes(role))) {
      return;
    }

    setRetryDisabled(true);
    timer.current = setTimeout(() => setRetryDisabled(false), RETRY_COOLDOWN);

    showSnackbar('error', 'Sorry, still no rights to admin');
  };

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>No Access</title>
      </Helmet>

      <div className={styles.content}>
        <h1>Noice Admin</h1>

        <p>Your account ({data?.profile?.userTag}) does not have access for this site.</p>

        <p>
          To join a live stream, go to <a href={NOICE.PLATFORM_URL}>Noice platform</a>
        </p>

        <div className={styles.buttons}>
          <ButtonLink
            text="Logout"
            to={LoginRoutes.LogOut}
          />

          <Button
            disabled={retryDisabled}
            text="Retry"
            onClick={onRetryClick}
          />
        </div>
      </div>
    </div>
  );
}
