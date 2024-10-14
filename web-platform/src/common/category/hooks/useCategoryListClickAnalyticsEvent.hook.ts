import { useAnalytics } from '@noice-com/common-ui';
import { Optional } from '@noice-com/utils';
import { RefObject, useRef } from 'react';
import { useLocation } from 'react-router';

interface HookResult {
  listRef: RefObject<HTMLUListElement>;
  onCategoryLinkClick(categoryId: string, index: number): void;
}

export function useCategoryListClickAnalyticsEvent(): HookResult {
  const { trackEvent } = useAnalytics();
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  const onCategoryLinkClick = (categoryId: string, index: number) => {
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
      clientCategoryListClick: {
        categoryId,
        rowIndex,
        columnIndex,
        pathname,
        listIndex: index,
      },
    });
  };

  return { listRef, onCategoryLinkClick };
}
