import { CoreAssets } from '@noice-com/assets-core';
import { IFeatureFlags } from '@noice-com/platform-client';
import { BiRocket, BiStore } from 'react-icons/bi';

import { NavigationLinkModel } from './NavigationSidebarTop/types';

import { ChannelRole } from '@common/profile';
import { Routes, routePermissions } from '@common/route';
import { ProtectedRoutes } from '@common/route/types';

export interface DisabledInfo {
  title: string;
  content: string;
}

export type NavigationLinkOptions = NavigationLinkModel & {
  disabledInfo?: DisabledInfo;
  subNavigationLinks?: Omit<NavigationLinkOptions, 'icon'>[];
};

export const navigationLinks: NavigationLinkOptions[] = [
  {
    dataAttributeId: 'getting-started',
    icon: BiRocket,
    label: 'Getting Started',
    to: Routes.GettingStarted,
  },
  {
    label: 'Stream Manager',
    to: Routes.StreamManager,
    icon: CoreAssets.Icons.StreamerManager,
    dataAttributeId: 'streamer-manager',
  },
  {
    label: 'Alerts',
    to: Routes.Alerts,
    icon: CoreAssets.Icons.Alert,
    dataAttributeId: 'alerts',
  },
  {
    label: 'Challenges',
    to: Routes.Challenges,
    icon: CoreAssets.Icons.Crown,
    dataAttributeId: 'challenges',
    visibleWithFeatureFlag: 'universalMatchChallenges',
  },
  {
    dataAttributeId: 'settings',
    icon: CoreAssets.Icons.SettingsStudio,
    label: 'Settings',
    subNavigationLinks: [
      {
        dataAttributeId: 'settings-channel',
        label: 'Channel',
        to: Routes.SettingsChannelDetails,
      },
      {
        dataAttributeId: 'settings-stream',
        label: 'Stream',
        to: Routes.SettingsStream,
      },
      {
        dataAttributeId: 'settings-simulcasting',
        label: 'Simulcasting',
        to: Routes.SettingsSimulcasting,
        visibleWithFeatureFlag: 'streaming_showStudioSettingsSimulcastRestreamer',
      },
      {
        dataAttributeId: 'settings-moderation',
        label: 'Moderation',
        to: Routes.SettingsModeration,
      },
    ],
    to: Routes.Settings,
  },
  {
    dataAttributeId: 'monetization',
    icon: BiStore,
    label: 'Monetization',
    to: Routes.Monetization,
  },
  {
    dataAttributeId: 'analytics',
    icon: CoreAssets.Icons.Analytics,
    label: 'Analytics',
    to: Routes.Analytics,
    subNavigationLinks: [
      {
        dataAttributeId: 'analytics-latest-stream',
        label: 'Latest stream',
        to: Routes.AnalyticsLatestStream,
      },
      {
        dataAttributeId: 'analytics-channel',
        label: 'Channel',
        to: Routes.AnalyticsChannel,
      },
    ],
  },
];

export const getNavigationLinks = ({
  userRoles,
  featureFlags,
}: {
  userRoles: ChannelRole[];
  featureFlags: IFeatureFlags;
}): NavigationLinkOptions[] => {
  const links = getNavigationLinksByRole(userRoles);

  return filterNavigationLinksByFeatureFlag(links, featureFlags);
};

const filterNavigationLinksByFeatureFlag = (
  links: NavigationLinkOptions[],
  featureFlags: IFeatureFlags,
): NavigationLinkOptions[] =>
  links
    .filter(
      (link) =>
        !link.visibleWithFeatureFlag ||
        featureFlags.get(link.visibleWithFeatureFlag) === 'true',
    )
    .map((link) => ({
      ...link,
      ...(link.subNavigationLinks
        ? {
            subNavigationLinks: link.subNavigationLinks.filter(
              (subLink) =>
                !subLink.visibleWithFeatureFlag ||
                featureFlags.get(subLink.visibleWithFeatureFlag) === 'true',
            ),
          }
        : {}),
    }));

const getNavigationLinksByRole = (userRoles: ChannelRole[]): NavigationLinkOptions[] => {
  if (!userRoles.length) {
    return [];
  }

  const links = navigationLinks.filter((link) => {
    const allowedRoles = routePermissions?.[link.to as ProtectedRoutes] ?? [];

    return allowedRoles.some((role) => userRoles.includes(role));
  });

  return links.map((link) => {
    if (!link.subNavigationLinks?.length) {
      return link;
    }

    link.subNavigationLinks = link.subNavigationLinks.filter((subLink) => {
      const allowedRoles = routePermissions?.[subLink.to as ProtectedRoutes] ?? [];

      return allowedRoles.some((role) => userRoles.includes(role));
    });

    return link;
  });
};
