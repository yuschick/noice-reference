import { WidgetOfflineCheck, WidgetId } from '../types';

import { Leaderboard } from './Leaderboard';

export default {
  offline: ({ streamId, isNoicePredictionsEnabled }: WidgetOfflineCheck) => {
    if (streamId && isNoicePredictionsEnabled) {
      return null;
    }

    if (!isNoicePredictionsEnabled) {
      return {
        title: 'Noice Predictions is disabled',
        description:
          'Leaderboard shows the current state of the leaderboards when Noice Predictions is enabled.',
      };
    }

    return {
      title: 'Waiting for a match to start',
      description:
        'Leaderboard shows the current state of the leaderboards when the stream is online.',
    };
  },
  id: WidgetId.Leaderboard,
  Component: Leaderboard,
} as const;
