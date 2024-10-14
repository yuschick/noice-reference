import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GridItem.module.css';

interface Props {
  hasActiveStreamerCards?: boolean;
}

export function GridItem({ hasActiveStreamerCards, children }: WithChildren<Props>) {
  return (
    <div
      className={classNames(styles.gridItem, {
        [styles.hasActiveStreamerCards]: !!hasActiveStreamerCards,
      })}
    >
      {children}
    </div>
  );
}
