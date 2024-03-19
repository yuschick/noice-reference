import classNames from 'classnames';

import styles from './PopoverMenu.module.css';

import { WithChildren } from '@common-types';

interface Props {
  className?: string;
}

export function PopoverMenuSection({ children, className }: WithChildren<Props>) {
  return (
    <div className={classNames(styles.popoverMenuSection, className)}>{children}</div>
  );
}
