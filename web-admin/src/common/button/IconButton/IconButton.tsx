import { Icon, SvgComponent, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';

import styles from './IconButton.module.css';

interface Props extends Omit<ComponentProps<'button'>, 'ref'> {
  text: string;
  icon: SvgComponent;
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon, text, className, ...props }, ref) => {
    return (
      <button
        className={classNames(className, styles.button)}
        ref={ref}
        {...props}
      >
        {
          <Icon
            className={styles.icon}
            icon={icon}
          />
        }
        <VisuallyHidden>{text}</VisuallyHidden>
      </button>
    );
  },
);
