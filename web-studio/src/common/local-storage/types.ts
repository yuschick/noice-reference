import { CommonUserDataKeys, FontSize } from '@noice-com/common-ui';
import { StreamLocalStorageKeys } from '@noice-com/stream';
import { Nullable } from '@noice-com/utils';

import { NavigationSidebarMode } from '@common/sidebar';
import { Direction, TimestampFormat } from '@common/widget/ActivityFeed';
// Import directly from types to avoid circular dependency
import { InsightsGroup, CountDisplayType } from '@common/widget/AudienceInsights/types';
import { WidgetLayoutState } from '@common/widget/types';
import { StreamerChannelActivityEventFilterEventType } from '@gen';

export interface StudioLocalStorageKeys
  extends CommonUserDataKeys,
    StreamLocalStorageKeys {
  // Stream
  'stream.current': Nullable<string>;

  // Layout
  'layout.navigationSidebarMode': NavigationSidebarMode;
  'layout.storedState': WidgetLayoutState;

  // Debug
  'debug.featureFlags': Record<string, boolean>;
  'debug.forceChannelOnline': boolean;

  // Chat
  'chat.showModerationTools': boolean;

  // Chat User List
  'chatUserList.showUserBadges': boolean;

  // Activity Feed
  'activityFeed.direction': Direction;
  'activityFeed.fontSize': FontSize;
  'activityFeed.showAvatars': boolean;
  'activityFeed.showUserBadges': boolean;
  'activityFeed.timestampFormat': TimestampFormat;
  'activityFeed.filters': StreamerChannelActivityEventFilterEventType[];

  // Audience Insights
  'audienceInsights.countDisplayType': CountDisplayType;
  'audienceInsights.fontSize': FontSize;
  'audienceInsights.filters': InsightsGroup[];

  // Top Predictions Settings
  'topPredictions.fontSize': FontSize;
  'topPredictions.showDescriptions': boolean;

  // Onboarding
  'onboarding.lastCompletedStep': number;
}

export type StudioAppLocalStorageKeys = CommonUserDataKeys & StreamLocalStorageKeys;
