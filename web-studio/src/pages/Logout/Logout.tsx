import { useAsyncEffect, useLogout } from '@noice-com/common-ui';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './Logout.module.css';

import { Routes } from '@common/route';

export function Logout() {
  const logOut = useLogout();

  const handleLogout = useCallback(async () => {
    const success = await logOut();

    if (success) {
      window.location.pathname = Routes.LogIn;
    }
  }, [logOut]);

  useAsyncEffect(handleLogout);

  return (
    <>
      <Helmet>
        <title>Log out</title>
      </Helmet>
      <div className={styles.signOutWrapper}>
        <span className={styles.text}>Logging out. Redirecting...</span>
      </div>
    </>
  );
}
