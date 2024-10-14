import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SpotlightContainer.module.css';

interface Props extends WithChildren {
  scrollable?: boolean;
  className?: string;
}

export function SpotlightContainer({ children, scrollable, className }: Props) {
  return (
    <div
      className={classNames(styles.container, className, {
        [styles.scrollable]: scrollable,
      })}
    >
      {children}
    </div>
  );
}
