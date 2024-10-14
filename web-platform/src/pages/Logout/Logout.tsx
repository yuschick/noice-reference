import { useAuthentication, useLogout } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';

import styles from './Logout.module.css';

import { Routes } from '@common/route';

const { logError } = makeLoggers('LOGOUT');

export function Logout() {
  const navigate = useNavigate();
  const logOut = useLogout();
  const { initialized, isAuthenticated, hasRole } = useAuthentication();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const isImplicitAccountUser = !hasRole('full_user') && hasRole('user');

    if (isAuthenticated() && !isImplicitAccountUser) {
      const tryLogout = async () => {
        try {
          await logOut();
        } catch (e) {
          logError('Logout error', e);
        }

        navigate(Routes.Signup, { replace: true });
      };

      tryLogout();
      return;
    }

    navigate(Routes.Signup, { replace: true });
  }, [logOut, initialized, isAuthenticated, hasRole, navigate]);

  return (
    <>
      <Helmet>
        <title>Log out</title>
      </Helmet>
      <div className={styles.logoutWrapper}>
        <span className={styles.text}>Logging out. Redirecting...</span>
      </div>
    </>
  );
}
