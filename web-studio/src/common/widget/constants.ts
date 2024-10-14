import ActionsWidget from './ActionsWidget';
import ActivityFeed from './ActivityFeed';
import AudienceInsights from './AudienceInsights';
import AutoModQueueWidget from './AutoModQueue';
import ChallengesWidget from './ChallengesWidget';
import ChatUserListWidget from './ChatUserListWidget';
import ChatWidget from './ChatWidget';
import GameAndCrowdWidget from './GameAndCrowd';
import LeaderboardWidget from './Leaderboard';
import ModeratorLogWidget from './ModeratorLog';
import TopPredictions from './TopPredictions';
import { WidgetId, WidgetConfig } from './types';

export const AvailableWidgets: Record<WidgetId, WidgetConfig> = {
  [WidgetId.Actions]: ActionsWidget,
  [WidgetId.ActivityFeed]: ActivityFeed,
  [WidgetId.AudienceInsights]: AudienceInsights,
  [WidgetId.AutoMod]: AutoModQueueWidget,
  [WidgetId.Chat]: ChatWidget,
  [WidgetId.Challenges]: ChallengesWidget,
  [WidgetId.ChatUserList]: ChatUserListWidget,
  [WidgetId.GameCrowd]: GameAndCrowdWidget,
  [WidgetId.Leaderboard]: LeaderboardWidget,
  [WidgetId.ModeratorLog]: ModeratorLogWidget,
  [WidgetId.StreamHighlights]: ActivityFeed, // Incremental phaseout to activity feed
  [WidgetId.TopPredictions]: TopPredictions,
};
