import { WidgetOfflineCheck, WidgetId, LiveChannelWidgetProps } from '../types';

import { TopPredictions } from './TopPredictions';

function TopPredictionsWidget(props: LiveChannelWidgetProps) {
  return <TopPredictions {...props} />;
}

export default {
  offline: ({ streamId, isNoicePredictionsEnabled }: WidgetOfflineCheck) => {
    if (streamId && isNoicePredictionsEnabled) {
      return null;
    }

    if (!isNoicePredictionsEnabled) {
      return {
        title: 'Noice Predictions is disabled',
        description:
          'Top Predictions shows the most active cards and predictions of the audience when Noice Predictions is enabled.',
      };
    }

    return {
      title: 'Waiting for a match to start',
      description:
        'Top Predictions shows the most active cards and predictions of the audience during a match.',
    };
  },
  id: WidgetId.TopPredictions,
  Component: TopPredictionsWidget,
} as const;
