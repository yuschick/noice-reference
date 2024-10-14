import {
  BiChalkboard,
  BiFlag,
  BiKey,
  BiListUl,
  BiShield,
  BiSlider,
  BiSmile,
  BiBroadcast,
} from 'react-icons/bi';

import { Channel, ChannelBanned, ChannelRoles, Channels, ChannelSettings } from './pages';
import { ChannelEmojis } from './pages/ChannelEmojis/ChannelEmojis';
import { ChannelFeatureFlags } from './pages/ChannelFeatureFlags/ChannelFeatureFlags';
import { ChannelModeration } from './pages/ChannelModeration/ChannelModeration';
import { ChannelStreams } from './pages/ChannelStreams/ChannelStreams';
import { ChannelStreamStream } from './pages/ChannelStreamStream/ChannelStreamStream';

import { SidebarChannel } from '.';

import { Module } from '@common/module';
import { AuthPlatformRole } from '@gen';

export const channelModule: Module = {
  id: 'channels',
  title: 'Channels',
  pages: [
    {
      id: 'index',
      title: 'Channel list',
      component: <Channels />,
      icon: BiChalkboard,
      description: 'List of all channels',
      permissions: [
        AuthPlatformRole.PlatformRoleModerator,
        AuthPlatformRole.PlatformRolePxAgent,
      ],
    },
    {
      id: ':channelId',
      title: 'Channel details',
      component: <Channel />,
      contextualSidebarWrapper: SidebarChannel,
      icon: BiListUl,
      permissions: [
        AuthPlatformRole.PlatformRoleModerator,
        AuthPlatformRole.PlatformRolePxAgent,
      ],
      subPages: [
        {
          id: 'streams',
          title: 'Streams',
          component: <ChannelStreams />,
          icon: BiBroadcast,
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
          isSubSubPagesExcludedFromNavigation: true,
          subSubPages: [
            {
              id: ':streamId',
              title: 'Stream details',
              component: <ChannelStreamStream />,
              icon: BiBroadcast,
              permissions: [
                AuthPlatformRole.PlatformRoleModerator,
                AuthPlatformRole.PlatformRolePxAgent,
              ],
            },
          ],
        },
        {
          id: 'emojis',
          title: 'Emojis',
          component: <ChannelEmojis />,
          icon: BiSmile,
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
        },
        {
          id: 'roles',
          title: 'Roles',
          component: <ChannelRoles />,
          icon: BiKey,
        },
        {
          id: 'moderation',
          title: 'Moderation',
          component: <ChannelModeration />,
          icon: BiShield,
          permissions: [AuthPlatformRole.PlatformRoleModerator],
          isSubSubPagesExcludedFromNavigation: true,
          subSubPages: [
            {
              id: 'banned',
              title: 'Banned users',
              component: <ChannelBanned />,
              icon: BiShield,
              permissions: [AuthPlatformRole.PlatformRoleModerator],
            },
          ],
        },
        {
          component: <ChannelSettings />,
          icon: BiSlider,
          id: 'settings',
          title: 'Settings',
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
        },
        {
          id: 'feature-flags',
          title: 'Feature Flags',
          icon: BiFlag,
          component: <ChannelFeatureFlags />,
        },
      ],
    },
  ],
};
