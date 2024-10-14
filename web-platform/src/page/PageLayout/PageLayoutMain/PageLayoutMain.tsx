import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useLocation } from 'react-router';

import { MAIN_ID } from '../utils';

import styles from './PageLayoutMain.module.css';

interface Props {
  isFullScreenPage?: boolean;
  hasBrowserWarning?: boolean;
}

export function PageLayoutMain({
  children,
  isFullScreenPage,
  hasBrowserWarning,
}: WithChildren<Props>) {
  const { pathname } = useLocation();

  return (
    <main
      className={classNames(styles.layoutMain, {
        [styles.fullScreenPage]: isFullScreenPage,
        [styles.hasBrowserWarning]: hasBrowserWarning,
      })}
      data-path={pathname.substring(1).replaceAll('/', '-')}
      id={MAIN_ID}
      tabIndex={-1}
    >
      <section className={styles.mainContentWrapper}>{children}</section>
    </main>
  );
}
