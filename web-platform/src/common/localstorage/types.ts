import { GameLocalStorageKeys } from '@noice-com/card-game';
import { StreamLocalStorageKeys } from '@noice-com/stream';
import { Nullable } from '@noice-com/utils';

export interface AppLocalStorageKeys
  extends GameLocalStorageKeys,
    StreamLocalStorageKeys {
  // Avatar creation reminder
  'create-avatar.reminder.shown': boolean;
  // DGC
  'dailygoals.reminder.timestamp': number;
  // Debug
  'debug.forceChannelOnline': boolean;
  // Game
  'game.selected': Nullable<string>;
  // Season
  'season.selected': Nullable<string>;
  'season.seasonEndSeen': Nullable<string[]>;
  // Store
  'store.visited.timestamp': number;
  'store.updated.timestamp': number;
  'store.bundle.revealed': string[];
  // Notifications
  'notifications.timestamp': number;
  // Account setup
  'account.setup.disabled': number;
  // Popup asking permissions for web push notifications (must be shown exactly one time per browser)
  'web-push-notifications.popup.actioned': boolean;
}
