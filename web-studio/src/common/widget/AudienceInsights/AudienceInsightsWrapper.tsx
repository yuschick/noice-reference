import { WidgetOfflineCheck, WidgetId, LiveChannelWidgetProps } from '../types';

import { AudienceInsights } from './AudienceInsights';

function AudienceInsightsWidget(props: LiveChannelWidgetProps) {
  return <AudienceInsights {...props} />;
}

export default {
  offline: ({ streamId }: WidgetOfflineCheck) => {
    if (streamId) {
      return null;
    }

    return {
      title: 'Widget Disabled',
      description: `Audience Insights will help you understand your audience composition when you're live.`,
    };
  },
  id: WidgetId.AudienceInsights,
  Component: AudienceInsightsWidget,
} as const;
