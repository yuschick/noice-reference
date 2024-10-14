import { Icon, SvgComponent, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps } from 'react';

import styles from './MenuControlButton.module.css';

interface Props extends Omit<ComponentProps<'button'>, 'ref' | 'color'> {
  active?: boolean;
  className?: string;
  icon: SvgComponent;
  iconClassName?: string;
  label: string;
  showLabel?: boolean;
}

export function MenuControlButton({
  className,
  showLabel,
  icon,
  label,
  active,
  ...props
}: Props) {
  return (
    <button
      className={classNames(styles.menuControl, className, {
        [styles.active]: active,
      })}
      {...props}
    >
      {showLabel ? <span>{label}</span> : <VisuallyHidden>{label}</VisuallyHidden>}

      <Icon
        className={styles.icon}
        icon={icon}
      />
    </button>
  );
}
