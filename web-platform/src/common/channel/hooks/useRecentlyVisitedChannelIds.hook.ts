import { useUniqueValueArray } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useAppLocalStorage } from '../../localstorage';

export function useRecentlyVisitedChannelIds(): [
  Nullable<string[]>,
  (channelId: string) => void,
] {
  const [channelIds, addValue, setContent] = useUniqueValueArray<string>(3);
  const localStorage = useAppLocalStorage();

  const addChannelId = useCallback(
    (channelId: string) => {
      const newChannelIds = addValue(channelId);
      localStorage.SetValue('channel.recentlyVisited', newChannelIds);
    },
    [localStorage, addValue],
  );

  useEffect(() => {
    if (!localStorage) {
      return;
    }

    setContent(localStorage.GetValue('channel.recentlyVisited'));
  }, [localStorage, setContent]);

  useEffect(() => {
    if (!localStorage) {
      return;
    }

    return localStorage.SetListener('channel.recentlyVisited', setContent);
  }, [localStorage, setContent]);

  return [channelIds, addChannelId];
}
