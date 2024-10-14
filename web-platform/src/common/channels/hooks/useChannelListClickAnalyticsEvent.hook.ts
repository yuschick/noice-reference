import { useAnalytics } from '@noice-com/common-ui';
import { Optional } from '@noice-com/utils';
import { RefObject, useRef } from 'react';
import { useLocation } from 'react-router';

interface HookResult {
  listRef: RefObject<HTMLUListElement>;
  onChannelLinkClick(channelId: string, index: number): void;
}

interface Props {
  section: string;
  listGameId?: string;
}

export function useChannelListClickAnalyticsEvent({
  section,
  listGameId,
}: Props): HookResult {
  const { trackEvent } = useAnalytics();
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  const onChannelLinkClick = (channelId: string, index: number) => {
    let rowIndex,
      columnIndex: Optional<number> = undefined;

    if (listRef.current) {
      const computedListStyles = window.getComputedStyle(listRef.current);
      const gridColumnCount = computedListStyles
        .getPropertyValue('grid-template-columns')
        .split(' ').length;

      columnIndex = index % gridColumnCount;
      rowIndex = Math.floor(index / gridColumnCount);
    }

    trackEvent({
      clientChannelListClick: {
        section,
        channelId,
        listGameId,
        rowIndex,
        columnIndex,
        pathname,
        listIndex: index,
      },
    });
  };

  return { listRef, onChannelLinkClick };
}
