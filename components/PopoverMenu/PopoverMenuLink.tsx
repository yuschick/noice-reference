import classNames from 'classnames';
import { useContext } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { ButtonIconPositions } from '../Button/Button.types';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './PopoverMenu.module.css';
import { PopoverMenuContext } from './PopoverMenuProvider';

import { WithChildren } from '@common-types';

type Props = Omit<LinkProps, 'className' | 'color' | 'style' | 'tabIndex'> &
  ButtonIconPositions & {
    isDisabled?: boolean;
    theme?: 'dark' | 'light';
  };

export function PopoverMenuLink({
  children,
  iconEnd,
  iconStart,
  isDisabled,
  theme = 'dark',
  to,
  ...htmlAttributes
}: WithChildren<Props>) {
  const context = useContext(PopoverMenuContext);

  if (!context) {
    throw new Error('PopoverMenu.Link can only be used within a PopoverMenu.');
  }

  const isExternalLink = String(to)?.startsWith('http');
  const Content = (
    <div className={styles.itemContent}>
      {iconStart && (
        <Icon
          className={styles.itemIcon}
          data-icon="start"
          icon={iconStart}
        />
      )}

      <div className={styles.itemChildContentWrapper}>{children}</div>

      {iconEnd && (
        <Icon
          className={styles.itemIcon}
          data-icon="end"
          icon={iconEnd}
        />
      )}
    </div>
  );

  return isDisabled ? (
    <div
      aria-disabled="true"
      className={classNames(styles.popoverMenuItem, styles[theme])}
      role="menuitem"
      tabIndex={-1}
    >
      {Content}
    </div>
  ) : isExternalLink ? (
    <a
      {...htmlAttributes}
      className={classNames(styles.popoverMenuItem, styles[theme])}
      href={String(to)}
      rel="noopener noreferrer"
      target={htmlAttributes.reloadDocument ? undefined : '_blank'}
      onClick={context.actions.toggle}
    >
      {Content}
      <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
    </a>
  ) : (
    <Link
      {...htmlAttributes}
      className={classNames(styles.popoverMenuItem, styles[theme])}
      role="menuitem"
      tabIndex={-1}
      to={to}
      onClick={context.actions.toggle}
    >
      {Content}
    </Link>
  );
}
