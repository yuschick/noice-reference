import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import styles from './NotFound.module.css';

import { Routes } from '@common/route';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <div className={styles.wrapper}>
        <Icon
          className={styles.bugIcon}
          icon={CoreAssets.Icons.Bug}
        />
        <h1 className={styles.heading}>Page Not Found</h1>

        <span>Sorry, but we can`t find that page. Please try again.</span>

        <Link to={Routes.Home}>Return to home</Link>
      </div>
    </>
  );
}
