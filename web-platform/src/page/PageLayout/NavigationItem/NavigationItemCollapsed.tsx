import {
  Icon,
  StatusIndicator,
  Tooltip,
  useAnalytics,
  useMouseClickWithSound,
  useMouseEnterWithSound,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { AnchorHTMLAttributes, MouseEvent, forwardRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavigationItemCollapsed.module.css';

import { PlatformNavigationLinkModel } from '@page/PageLayout/PlatformNavigation/types';

export interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  analyticsEvent?: string;
  highlight?: string;
  navigationItem: PlatformNavigationLinkModel;
  tooltip?: {
    className?: string;
    component: JSX.Element;
  };
}

export const NavigationItemCollapsed = forwardRef<HTMLAnchorElement, Props>(
  function NavigationItemCollapsed(
    {
      analyticsEvent,
      highlight,
      navigationItem,
      onClick,
      onMouseEnter,
      tooltip,
      ...htmlAttributes
    },
    externalRef,
  ) {
    const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);
    const handleOnClickWithSound = useMouseClickWithSound(onClick);

    const { trackEvent } = useAnalytics();
    const triggerFTUEAction = useTriggerFTUEAction();

    const handleLinkClick = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        if (analyticsEvent) {
          trackEvent({
            clientButtonClick: { action: analyticsEvent },
          });
        }

        if (navigationItem.ftueAction) {
          triggerFTUEAction(navigationItem.ftueAction);
        }

        handleOnClickWithSound?.(event);
      },
      [
        analyticsEvent,
        navigationItem,
        handleOnClickWithSound,
        trackEvent,
        triggerFTUEAction,
      ],
    );

    return (
      <Tooltip
        content={
          tooltip ? (
            <div className={tooltip?.className}>{tooltip?.component}</div>
          ) : (
            <span className={styles.navigationTooltip}>{navigationItem.label}</span>
          )
        }
        placement={tooltip ? 'right-start' : 'right'}
      >
        <NavLink
          {...htmlAttributes}
          aria-label={navigationItem.label}
          className={styles.navigationItem}
          data-ftue-anchor={`${navigationItem.dataAttributeId}-navigation-link`}
          data-navigation-link-id={navigationItem.dataAttributeId}
          ref={externalRef}
          to={navigationItem.to}
          onClick={handleLinkClick}
          onMouseEnter={handleMouseEnterWithSound}
        >
          {navigationItem.icon && (
            <Icon
              className={classNames(styles.navigationItemIcon, {
                [styles.withStatusIndicator]: !!highlight,
              })}
              icon={navigationItem.icon}
              title={navigationItem.label}
            />
          )}

          {!!highlight && (
            <div className={styles.statusIndicatorWrapper}>
              <StatusIndicator
                color="magenta"
                message={highlight}
              />
            </div>
          )}
        </NavLink>
      </Tooltip>
    );
  },
);
