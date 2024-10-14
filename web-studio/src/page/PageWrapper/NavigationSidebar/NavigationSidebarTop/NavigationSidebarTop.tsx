import { CoreAssets } from '@noice-com/assets-core';
import { NoiceSupportLinks } from '@noice-com/common-ui';
import { IFeatureFlags } from '@noice-com/platform-client';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import { getNavigationLinks, NavigationLinkOptions } from '../const';

import { DisabledTooltip } from './DisabledTooltip/DisabledTooltip';
import { useHighlightedNavigationLinks } from './hooks/useHighlightedNavigationLink';
import { NavigationLink } from './NavigationLink/NavigationLink';
import styles from './NavigationSidebarTop.module.css';

import { useChannelContext } from '@common/channel';
import { useSidebarStates, NavigationSidebarMode } from '@common/sidebar';

interface Props {
  activePath: string;
  minimized: boolean;
  mode: NavigationSidebarMode;
  featureFlags: IFeatureFlags;
}

type NavigationLinkItemProps = Omit<Props, 'featureFlags'> & {
  link: NavigationLinkOptions;
};

function NavigationLinkItem({
  activePath,
  link,
  minimized,
  mode,
}: NavigationLinkItemProps) {
  const [showSubLinks, setShowSubLinks] = useState(false);
  const { onChangeNavigationSidebarMode } = useSidebarStates();

  useEffect(() => {
    // When one of the sub links is active path, show sub links
    if (link.subNavigationLinks?.some((subLink) => subLink.to === activePath)) {
      setShowSubLinks(true);
    }
  }, [activePath, link.subNavigationLinks]);

  const handleShowSubLinks = useCallback(() => {
    setShowSubLinks(minimized || !showSubLinks);

    if (minimized) {
      onChangeNavigationSidebarMode(NavigationSidebarMode.Expanded);
    }
  }, [minimized, onChangeNavigationSidebarMode, showSubLinks]);

  return (
    <li
      className={classNames(styles.listItem, {
        [styles.disabled]: link.disabledInfo,
        [styles.open]: showSubLinks || !link.icon,
      })}
    >
      <NavigationLink
        active={showSubLinks || activePath.includes(link.to)}
        disabled={!!link.disabledInfo}
        highlight={link.highlight}
        icon={link.icon}
        label={link.label}
        minimized={minimized}
        to={link.to}
        onShowSubLinks={link.subNavigationLinks && handleShowSubLinks}
      />

      {link.disabledInfo && (
        <DisabledTooltip
          className={styles.customTooltip}
          content={link.disabledInfo.content}
          title={link.disabledInfo.title}
        />
      )}

      {showSubLinks && !minimized && (
        <ul className={styles.list}>
          {link.subNavigationLinks?.map((subLink) => (
            <NavigationLinkItem
              activePath={activePath}
              key={subLink.label}
              link={subLink}
              minimized={minimized}
              mode={mode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function NavigationSidebarTop({
  activePath,
  minimized,
  mode,
  featureFlags,
}: Props) {
  const { userChannelRoles } = useChannelContext();

  let navigationLinks = getNavigationLinks({
    userRoles: userChannelRoles,
    featureFlags,
  });

  navigationLinks = useHighlightedNavigationLinks(navigationLinks);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.showTooltips]: mode === NavigationSidebarMode.Minimized,
      })}
    >
      <nav className={styles.navWrapper}>
        <ul className={styles.list}>
          {navigationLinks.map((link) => (
            <NavigationLinkItem
              activePath={activePath}
              key={link.label}
              link={link}
              minimized={minimized}
              mode={mode}
            />
          ))}
        </ul>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            <NavigationLink
              icon={CoreAssets.Icons.Globe}
              label="Creator Hub"
              minimized={minimized}
              to={NoiceSupportLinks.CreatorHub}
              externalLink
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}
