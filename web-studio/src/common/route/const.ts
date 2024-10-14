import { ChannelRole } from '../profile/types';

import { ProtectedRoutes, Routes } from './types';

/**
 * admin and streamer roles are allowed for all pages,
 * but other roles needs to be added manually
 */
export const customRoutePermissions: Record<
  ProtectedRoutes,
  Exclude<ChannelRole, ChannelRole.Admin | ChannelRole.Streamer>[]
> = {
  [Routes.GettingStarted]: [],
  [Routes.StreamManager]: [ChannelRole.Moderator],
  [Routes.Settings]: [ChannelRole.PxAgent],
  [Routes.SettingsChannelDetails]: [ChannelRole.PxAgent],
  [Routes.SettingsChannelBranding]: [ChannelRole.PxAgent],
  [Routes.SettingsStream]: [],
  [Routes.SettingsSimulcasting]: [],
  [Routes.SettingsModeration]: [],
  [Routes.SettingsAutoMod]: [],
  [Routes.SettingsBanned]: [],
  [Routes.CreatorCards]: [ChannelRole.PxAgent],
  [Routes.Monetization]: [],
  [Routes.MonetizationCreatorCards]: [ChannelRole.PxAgent],
  [Routes.MonetizationSubscriptions]: [ChannelRole.PxAgent],
  [Routes.Analytics]: [],
  [Routes.AnalyticsLatestStream]: [],
  [Routes.AnalyticsChannel]: [],
  [Routes.Popout]: [],
  [Routes.BrowserSource]: [],
  [Routes.PopoutWaitForLogin]: [],
  [Routes.PopoutSignin]: [],
  [Routes.StaticStreamSettings]: [],
  [Routes.Alerts]: [],
  [Routes.StreamAlerts]: [],
  [Routes.Challenges]: [],
};

export const routePermissions = Object.entries(customRoutePermissions).reduce<
  Record<ProtectedRoutes, ChannelRole[]>
>((acc, [route, roles]) => {
  return {
    ...acc,
    [route]: [...roles, ChannelRole.Streamer, ChannelRole.Admin],
  };
}, customRoutePermissions);
