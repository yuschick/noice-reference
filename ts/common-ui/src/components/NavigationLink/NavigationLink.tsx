import { flip } from '@floating-ui/dom';
import classNames from 'classnames';
import { useCallback, useMemo, MouseEvent, useRef } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';

import { Icon } from '../Icon';
import { TooltipPortal } from '../TooltipPortal';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './NavigationLink.module.css';
import { NavigationLinkModel } from './types';

import { useAnalytics } from '@common-context';
import { useMouseClickWithSound, useMouseEnterWithSound } from '@common-hooks';

export interface Props extends NavigationLinkModel, LinkProps {
  minimized?: boolean;
  disabled?: boolean;
  analyticsEvent?: string;
  showTooltip?: boolean;
  customTooltip?: JSX.Element;
  customTooltipClassName?: string;
}

export function NavigationLink({
  analyticsEvent,
  className,
  customTooltip,
  customTooltipClassName,
  dataAttributeId,
  disabled,
  highlight,
  highlightReason,
  icon,
  label,
  minimized,
  showTooltip,
  to,
  ...props
}: Props) {
  const onMouseEnter = useMouseEnterWithSound(props.onMouseEnter);
  const onClick = useMouseClickWithSound(props.onClick);
  const onDisabledClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
    [],
  );
  const { trackEvent } = useAnalytics();

  const anchorRef = useRef(null);

  const clickFunction = useMemo(
    () => (disabled ? onDisabledClick : onClick),
    [disabled, onDisabledClick, onClick],
  );

  const onClickLink = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (analyticsEvent) {
        trackEvent({
          clientButtonClick: { action: analyticsEvent },
        });
      }

      clickFunction(e);
    },
    [clickFunction, analyticsEvent, trackEvent],
  );

  return (
    <NavLink
      {...props}
      {...(minimized ? { 'aria-label': label } : {})}
      className={classNames(styles.link, className, {
        [styles.minimized]: minimized,
        [styles.hasIcon]: icon,
        [styles.disabled]: disabled,
      })}
      data-navigation-link-id={dataAttributeId}
      ref={anchorRef}
      to={to}
      onClick={onClickLink}
      onMouseEnter={onMouseEnter}
    >
      {icon && (
        <span className={styles.iconWrapper}>
          {icon && (
            <Icon
              className={styles.icon}
              icon={icon}
              title={label}
            />
          )}
          {highlight && !disabled && (
            <span className={styles.highlightDot}>
              {!!highlightReason && (
                <span
                  aria-live="polite"
                  role="status"
                >
                  <VisuallyHidden>{highlightReason}</VisuallyHidden>
                </span>
              )}
            </span>
          )}
        </span>
      )}

      {!minimized && <span className={styles.label}>{label}</span>}

      <TooltipPortal
        anchorRef={anchorRef}
        className={customTooltip ? customTooltipClassName : undefined}
        disabled={!showTooltip || (!minimized && !customTooltip)}
        distance={8}
        middleWare={[flip({ fallbackAxisSideDirection: 'end' })]}
        placement={customTooltip ? 'right-start' : 'right'}
      >
        {customTooltip ?? <span className={styles.tooltip}>{label}</span>}
      </TooltipPortal>
    </NavLink>
  );
}
