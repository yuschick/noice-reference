import { CoreAssets } from '@noice-com/assets-core';
import { Icon, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { NavigationLinkModel } from '../types';

import styles from './NavigationLink.module.css';

import { useChannelRouteContext } from '@common/channel';

export interface Props extends NavigationLinkModel {
  minimized?: boolean;
  active?: boolean;
  disabled?: boolean;
  onShowSubLinks?: () => void;
}

export function NavigationLink({
  minimized,
  active,
  disabled,
  label,
  onShowSubLinks,
  icon,
  highlight,
  externalLink,
  to,
  ...props
}: Props) {
  const { transformPathToChannelPath } = useChannelRouteContext();

  const Item = (
    <>
      {icon && (
        <div className={classNames(styles.icon, { [styles.highlightDot]: highlight })}>
          <Icon
            className={styles.icon}
            icon={icon}
          />
        </div>
      )}

      {minimized ? (
        <VisuallyHidden>{label}</VisuallyHidden>
      ) : (
        <span className={styles.label}>{label}</span>
      )}

      {onShowSubLinks && !minimized && (
        <span className={classNames(styles.caretWrapper, { [styles.open]: !!active })}>
          <Icon
            icon={CoreAssets.Icons.Caret}
            size={16}
          />
        </span>
      )}

      {externalLink && !minimized && (
        <span className={styles.linkWrapper}>
          <Icon icon={CoreAssets.Icons.LinkExternal} />
        </span>
      )}

      {minimized && (
        <span
          aria-hidden="true"
          className={styles.tooltip}
          data-tooltip-content={label + (externalLink ? ' (opens to new window)' : '')}
        />
      )}
    </>
  );

  const className = classNames(styles.link, {
    [styles.active]: active && !onShowSubLinks,
    [styles.clickable]: !!onShowSubLinks,
    [styles.hasIcon]: icon,
    [styles.minimized]: minimized,
  });

  return (
    <>
      {disabled || onShowSubLinks ? (
        <button
          className={className}
          disabled={disabled}
          type="button"
          onClick={onShowSubLinks}
        >
          {Item}
        </button>
      ) : externalLink ? (
        <a
          className={className}
          href={to as string}
          rel="noreferrer"
          target="_blank"
        >
          {Item}
          <VisuallyHidden>Link opens in a new window</VisuallyHidden>
        </a>
      ) : (
        <Link
          {...(active ? { 'aria-current': 'page' } : {})}
          className={className}
          to={transformPathToChannelPath(to)}
          {...props}
        >
          {Item}
        </Link>
      )}
    </>
  );
}
