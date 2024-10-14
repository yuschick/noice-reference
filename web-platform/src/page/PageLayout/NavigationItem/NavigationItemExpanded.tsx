import {
  Icon,
  useAnalytics,
  useMergeRefs,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { AnchorHTMLAttributes, MouseEvent, forwardRef, useCallback, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavigationItemExpanded.module.css';

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

export const NavigationItemExpanded = forwardRef<HTMLAnchorElement, Props>(
  function NavigationItemExpanded(
    {
      analyticsEvent,
      highlight,
      navigationItem,
      onClick,
      onMouseEnter,
      ...htmlAttributes
    },
    externalRef,
  ) {
    const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);
    const handleOnClickWithSound = useMouseClickWithSound(onClick);

    const { trackEvent } = useAnalytics();
    const internalRef = useRef<HTMLAnchorElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);

    const handleLinkClick = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        if (analyticsEvent) {
          trackEvent({
            clientButtonClick: { action: analyticsEvent },
          });
        }

        handleOnClickWithSound?.(event);
      },
      [analyticsEvent, handleOnClickWithSound, trackEvent],
    );

    return (
      <NavLink
        {...htmlAttributes}
        aria-label={navigationItem.label}
        className={styles.navigationItem}
        data-ftue-anchor={`${navigationItem.dataAttributeId}-navigation-link`}
        data-navigation-link-id={navigationItem.dataAttributeId}
        ref={ref}
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
          />
        )}

        <span className={styles.navigationItemLabel}>{navigationItem.label}</span>
      </NavLink>
    );
  },
);
