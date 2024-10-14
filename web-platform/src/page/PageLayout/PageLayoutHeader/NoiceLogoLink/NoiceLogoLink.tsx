import { NoiceLogo } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import styles from './NoiceLogoLink.module.css';

import { Routes } from '@common/route';

export function NoiceLogoLink() {
  return (
    <Link
      aria-label="Go to home"
      className={styles.betaLogo}
      to={Routes.Home}
    >
      <NoiceLogo
        height={32}
        theme="spectrum"
        variant="mark"
        width={32}
      />

      <span className={styles.betaSub}>Beta</span>
    </Link>
  );
}
