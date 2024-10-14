import { WidgetOfflineCheck, WidgetId } from '../types';

import { AutoModQueue } from './AutoModQueue';

import { useChannelContext } from '@common/channel';

function AutomodQueueWidgetWrapper() {
  const { channelChatId } = useChannelContext();

  return channelChatId ? <AutoModQueue chatId={channelChatId} /> : null;
}

export default {
  offline: ({ streamId }: WidgetOfflineCheck) => {
    return !streamId
      ? {
          title: 'Waiting for a match to start',
          description: 'Messages held by AutoMod will display here.',
        }
      : null;
  },
  id: WidgetId.AutoMod,
  Component: AutomodQueueWidgetWrapper,
} as const;
