import { useAnalytics } from '@noice-com/common-ui';
import {
  AnalyticsEventClientContentSearchAction,
  AnalyticsEventClientContentSearchResultCategory,
  AnalyticsEventClientContentSearchSection,
} from '@noice-com/schemas/analytics/analytics.pb';
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';

import { SearchResult, SearchResults } from '../SearchInput';
import { MIN_QUERY_LENGTH } from '../utils';

import {
  SearchMatchResultCategoryFragment,
  SearchMatchResultChannelFragment,
} from '@gen';

interface HookResult {
  activeIndex: number;
  minimumSearchLength: number;
  value: string;
  wrapperRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  onFormSubmit(event: FormEvent): void;
  onInputBlur(event: FocusEvent<HTMLInputElement, Element>): void;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onInputFocus(event: FocusEvent<HTMLInputElement>): void;
  onInputKeyDown(event: KeyboardEvent): void;
  onOptionMouseEnter(index: number): void;
}

interface Props {
  results: SearchResults;
  initialValue?: string;
  onValueChange(value: string): void;
  getSearchPageLink(query: string): string;
  onSearchSubmit?(): void;
}

const getEntityId = (
  entity:
    | SearchResult<SearchMatchResultChannelFragment>
    | SearchResult<SearchMatchResultCategoryFragment>,
) => {
  switch (entity?.result.__typename) {
    case 'ChannelChannel':
      return entity.result.id;
    case 'ChannelGameStats':
      return entity.result.gameId;
  }
};

const getEntityCategory = (
  entity:
    | SearchResult<SearchMatchResultChannelFragment>
    | SearchResult<SearchMatchResultCategoryFragment>,
) => {
  switch (entity?.result.__typename) {
    case 'ChannelChannel':
      return AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CATEGORIES;
    case 'ChannelGameStats':
      return AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CHANNELS;
  }
};

export function useSearchInputMethods({
  results,
  onValueChange,
  getSearchPageLink,
  onSearchSubmit,
  initialValue,
}: Props): HookResult {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [value, setValue] = useState('');
  const { trackEvent } = useAnalytics();

  const wrapperRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = [...(results.channels || []), ...(results.categories || [])];
  const lastResultIndex = items.length - 1;

  useEffect(() => {
    // When location changes, reset search input
    setActiveIndex(-1);
    wrapperRef.current?.reset();
    setValue(initialValue ?? '');
  }, [initialValue, location]);

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    inputRef.current?.blur();

    if (activeIndex < 0) {
      if (value.length >= MIN_QUERY_LENGTH) {
        trackEvent({
          clientContentSearch: {
            action: AnalyticsEventClientContentSearchAction.ACTION_INPUT_SUBMIT,
            section: AnalyticsEventClientContentSearchSection.SECTION_POPOVER,
            searchTerm: value,
          },
        });
        navigate(getSearchPageLink(value));
        onSearchSubmit?.();
      }

      return;
    }

    const activeResultItemEntity = items[activeIndex];

    trackEvent({
      clientContentSearch: {
        action: AnalyticsEventClientContentSearchAction.ACTION_RESULT_CLICK,
        section: AnalyticsEventClientContentSearchSection.SECTION_POPOVER,
        searchTerm: value,
        resultId: getEntityId(activeResultItemEntity),
        resultCategory: getEntityCategory(activeResultItemEntity),
      },
    });
    navigate(activeResultItemEntity.link);
    onSearchSubmit?.();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Set active index to start when no value
    if (!value) {
      setActiveIndex(-1);
    }

    onValueChange(value);
    setValue(value);
  };

  const onInputBlur = (event?: FocusEvent<HTMLInputElement, Element>) => {
    // When new target is inside search box, do nothing
    if (event?.relatedTarget && wrapperRef.current?.contains(event.relatedTarget)) {
      return;
    }

    setActiveIndex(-1);
  };

  const onInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onValueChange(value);
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    // TODO: replace onInputKeyDown logic with useKeyboardNavigation hook
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        // If last one is active, do nothing
        if (prev === lastResultIndex) {
          return prev;
        }

        // Active index is the next one
        return prev + 1;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => {
        // If no natural number is active, return -1 to be non-active value
        if (prev < 0) {
          return -1;
        }

        // Active index is the previous one
        return prev - 1;
      });
    }

    // Go to the first item whit page up key
    if (event.key === 'PageUp') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    // Go to the last item with page down key
    if (event.key === 'PageDown') {
      event.preventDefault();
      setActiveIndex(lastResultIndex);
      return;
    }

    // Esc does some thing as blur
    if (event.key === 'Escape') {
      event.preventDefault();
      onInputBlur();
      return;
    }
  };

  const onOptionMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  return {
    activeIndex,
    inputRef,
    minimumSearchLength: MIN_QUERY_LENGTH,
    value,
    wrapperRef,
    onFormSubmit,
    onInputChange,
    onInputBlur,
    onInputFocus,
    onInputKeyDown,
    onOptionMouseEnter,
  };
}
