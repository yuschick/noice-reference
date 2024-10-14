import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './LayoutBox.module.css';

interface Props extends WithChildren {
  variant?: 'dark' | 'bright'; // 'bright' is default
}

export function LayoutBox({ children, variant = 'bright' }: Props) {
  return <div className={classNames(styles.layoutBox, styles[variant])}>{children}</div>;
}
