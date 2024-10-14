import { RenderQualityProfiles, GPU } from '@noice-com/stream';
import clamp from 'lodash/clamp';

import { AppLocalStorageKeys } from './types';

export async function getAppLocalStorageDefaults(): Promise<AppLocalStorageKeys> {
  const gpuTier = await GPU.getTier();
  // 3 is the best GPU tier, so we need to swap it around so that 3 = 0, 2 = 1, 3 = 2
  let performanceProfileIndex = 3 - (gpuTier?.tier ?? 2);
  // The resulting performance profile index needs to be between 0 and 2, so make sure it is
  performanceProfileIndex = clamp(performanceProfileIndex, 0, 2);

  return {
    // Store
    'store.visited.timestamp': 0,
    'store.updated.timestamp': 0,
    // Store in-game toasts
    'store.toasts.bundle-purchase.shown.soft-currency': 0,
    // Avatar creation reminder
    'create-avatar.reminder.shown': false,
    'store.bundle.revealed': [],
    // Sounds
    'audio.volume.master': 0.5,
    'audio.volume.effects': 0.5,
    'audio.volume.stream': 1,
    'audio.muted': false,
    // DGC
    'dailygoals.reminder.timestamp': 0,
    // Debug
    'debug.forceChannelOnline': false,
    'avatar-emotes.recently-used': [],
    // Game
    'game.selected': null,
    // Collection
    'channel.selected': null,
    'channel.recentlyVisited': null,
    // Season
    'season.selected': null,
    'season.seasonEndSeen': null,
    // Stream settings
    'renderSettings.performanceProfileIndex': performanceProfileIndex,
    'renderSettings.performanceProfile':
      RenderQualityProfiles[performanceProfileIndex].settings,
    'renderSettings.metricsVisible': false,
    'sidebar.channel-details.collapsed': false,
    // Announcements
    'announcements.seen': [],
    // Notifications
    'notifications.timestamp': 0,
    // Stream settings
    'streamSettings.preferredQuality': null,
    // Account setup
    'account.setup.disabled': 0,
    // Popup asking permissions for web push notifications (must be shown exactly one time per browser)
    'web-push-notifications.popup.actioned': false,
  };
}
