import classNames from 'classnames';

import styles from './PopoverMenu.module.css';

interface Props {
  className?: string;
}

export function PopoverMenuDivider({ className }: Props) {
  return <hr className={classNames(styles.popoverMenuDivider, className)} />;
}
