import { WidgetId, ChannelWidgetProps } from '../types';

import { ActivityFeed } from './ActivityFeed';

function ActivityFeedWidget(props: ChannelWidgetProps) {
  return <ActivityFeed {...props} />;
}

export default {
  id: WidgetId.ActivityFeed,
  Component: ActivityFeedWidget,
} as const;
