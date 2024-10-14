import { BiFlag, BiGame, BiMessageAlt, BiMessageDetail, BiSmile } from 'react-icons/bi';

import { FTUE } from './FTUE/FTUE';
import { GameEvents } from './GameEvents/GameEvents';
import { Announcements, FeatureFlags as FeatureFlagsV2 } from './pages';
import { PlatformEmojis } from './pages/emojis';

import { Module } from '@common/module';
import { AuthPlatformRole } from '@gen';

export const platformModule: Module = {
  id: 'platform',
  title: 'Platform',
  pages: [
    {
      id: 'feature-flags/*',
      title: 'Feature Flags',
      component: <FeatureFlagsV2 />,
      icon: BiFlag,
      description: 'Feature Flag configuration',
    },
    {
      id: 'ftue',
      title: 'FTUE',
      component: <FTUE />,
      icon: BiMessageAlt,
      description:
        'List of all FTUE components and manage the dismissed state of your own FTUE components',
    },
    {
      id: 'game-events',
      title: 'Game Events',
      component: <GameEvents />,
      icon: BiGame,
      description: 'Tool to send game events',
    },
    {
      id: 'announcements/*',
      title: 'Announcements',
      component: <Announcements />,
      icon: BiMessageDetail,
      description: 'Platform announcements',
      permissions: [AuthPlatformRole.PlatformRolePxAgent],
    },
    {
      id: 'emojis',
      title: 'Emojis',
      component: <PlatformEmojis />,
      icon: BiSmile,
      description: 'Emojis management',
    },
  ],
};
