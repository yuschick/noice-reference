import { CoreAssets } from '@noice-com/assets-core';
import { FTUEActionType, useAuthentication } from '@noice-com/common-ui';
import { useMemo } from 'react';

import styles from './PlatformNavigation.module.css';
import { PlatformNavigationItem } from './PlatformNavigationItem/PlatformNavigationItem';
import { PlatformNavigationLinkModel } from './types';

import { Routes, excludedFromImplicitAccount } from '@common/route';

export const navigationLinks: PlatformNavigationLinkModel[] = [
  {
    dataAttributeId: 'play',
    icon: CoreAssets.Icons.Play,
    label: 'Play',
    to: Routes.Home,
  },
  {
    dataAttributeId: 'collection',
    icon: CoreAssets.Icons.Collection,
    label: 'Collection',
    to: Routes.Collection,
  },
  {
    dataAttributeId: 'store',
    highlightReason: 'There are new updates in the store.',
    icon: CoreAssets.Icons.Store,
    label: 'Store',
    to: Routes.Store,
  },
  {
    dataAttributeId: 'seasons',
    highlightReason: 'You have unclaimed rewards for this season.',
    icon: CoreAssets.Icons.Seasons,
    label: 'Seasons',
    to: Routes.Seasons,
  },
  {
    dataAttributeId: 'daily-goals',
    highlightReason: 'There are updates to your daily goals.',
    icon: CoreAssets.Icons.DailyGoals,
    label: 'Daily Goals',
    to: Routes.DailyGoals,
    ftueAction: FTUEActionType.DailyGoalsNavigationClicked,
  },
];

interface Props {
  mode?: 'collapsed' | 'expanded';
}

export function PlatformNavigation({ mode = 'collapsed' }: Props) {
  const { isFullAccount } = useAuthentication();

  const links = useMemo(() => {
    if (isFullAccount) {
      return navigationLinks;
    }

    return navigationLinks.filter(
      (link) => !excludedFromImplicitAccount.includes(link.to),
    );
  }, [isFullAccount]);

  return (
    <nav aria-label="Main Noice Navigation">
      <ul className={styles.list}>
        {links.map((link) => (
          <PlatformNavigationItem
            key={link.to}
            mode={mode}
            navigationLink={link}
          />
        ))}
      </ul>
    </nav>
  );
}
