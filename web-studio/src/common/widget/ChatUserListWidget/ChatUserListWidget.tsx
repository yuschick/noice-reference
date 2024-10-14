import { useEffect, useId } from 'react';

import { useWidgetMenu } from '../context';
import { WidgetOfflineCheck, WidgetId, LiveChannelWidgetProps } from '../types';

import { ChatUserList } from './ChatUserList/ChatUserList';
import { ChatUserListSettings } from './ChatUserListSettings';

/**
 * The ChatUserList is a separate widget of its own, but is also used currently as an alternative
 * view to Chat widget. Just to remember: if adding props here - add then in both parents.
 */
// eslint-disable-next-line no-empty-pattern
export function ChatUserListWidget({}: LiveChannelWidgetProps) {
  const id = useId();
  const { setSettings } = useWidgetMenu();

  useEffect(() => {
    const settings = <ChatUserListSettings key={id} />;

    setSettings(settings);

    return () => {
      setSettings(null);
    };
  }, [id, setSettings]);

  return <ChatUserList />;
}

export default {
  offline: ({ streamId }: WidgetOfflineCheck) => {
    return !streamId
      ? {
          title: 'No stream',
          description: 'Waiting for stream and players to show up!',
        }
      : null;
  },
  id: WidgetId.ChatUserList,
  Component: ChatUserListWidget,
} as const;
