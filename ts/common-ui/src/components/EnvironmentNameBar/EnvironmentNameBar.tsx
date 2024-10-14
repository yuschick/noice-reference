import classNames from 'classnames';
import { useEffect } from 'react';

import styles from './EnvironmentNameBar.module.css';

enum Environment {
  Local = 'local',
  Development = 'dev',
  Staging = 'stg',
}

const getEnv = (host: string) => {
  if (host.includes('localhost')) {
    return Environment.Local;
  }

  if (host.includes('.dev')) {
    return Environment.Development;
  }

  if (host.includes('.stg')) {
    return Environment.Staging;
  }
};

export function EnvironmentNameBar() {
  const env = getEnv(window.location.host);

  useEffect(() => {
    if (!env) {
      return;
    }

    document.documentElement.style.setProperty('--environment-bar-height', '24px');
  }, [env]);

  if (!env) {
    return null;
  }

  return (
    <div
      className={classNames(styles.envTopBar, {
        [styles.local]: env === Environment.Local,
        [styles.dev]: env === Environment.Development,
        [styles.stg]: env === Environment.Staging,
      })}
    />
  );
}
