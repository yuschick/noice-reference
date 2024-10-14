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
import { useLocation } from 'react-router';

import {
  ChannelChannel,
  ProfileProfile,
  SearchBoxChannelResultItemFragment,
  SearchBoxProfileResultItemFragment,
} from '@gen';

interface HookResult {
  activeIndex: number;
  isExpanded: boolean;
  minimumSearchLength: number;
  value: string;
  wrapperRef: RefObject<HTMLFormElement>;
  onFormSubmit(event: FormEvent): void;
  onInputBlur(event: FocusEvent<HTMLInputElement, Element>): void;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onInputFocus(event: FocusEvent<HTMLInputElement>): void;
  onInputKeyDown(event: KeyboardEvent): void;
  onOptionMouseEnter(index: number): void;
}

interface Props {
  results: (SearchBoxProfileResultItemFragment | SearchBoxChannelResultItemFragment)[];
  onSearchSubmit(value: string): void;
  onUserSelectSubmit(userId: string): void;
  onChannelSelectSubmit(channelId: string): void;
  onValueChange(value: string): void;
}

const MINIMUM_SEARCH_LENGTH = 3;

export function useSearchBoxMethods({
  results,
  onSearchSubmit,
  onUserSelectSubmit,
  onChannelSelectSubmit,
  onValueChange,
}: Props): HookResult {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState('');

  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // When location changes, reset search box
    if (location) {
      setIsExpanded(false);
      setActiveIndex(-1);
      wrapperRef.current?.reset();
    }
  }, [location]);

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (activeIndex < 0) {
      if (value.length >= MINIMUM_SEARCH_LENGTH) {
        onSearchSubmit(value);
      }

      return;
    }

    const activeResultItemEntity = results[activeIndex].entity;

    if (activeResultItemEntity?.__typename === 'ProfileProfile') {
      onUserSelectSubmit(
        (activeResultItemEntity as Pick<ProfileProfile, 'userId'>).userId,
      );
    }

    if (activeResultItemEntity?.__typename === 'ChannelChannel') {
      onChannelSelectSubmit((activeResultItemEntity as Pick<ChannelChannel, 'id'>).id);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Close listbox if no value, otherwise open
    setIsExpanded(!!value);

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

    setIsExpanded(false);
    setActiveIndex(-1);
  };

  const onInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIsExpanded(!!value);
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        // If last one is active, do nothing
        if (prev === results.length - 1) {
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

    // Go to the first item whit home key
    if (event.key === 'Home') {
      setActiveIndex(0);
      return;
    }

    // Go to the last item with end key
    if (event.key === 'End') {
      setActiveIndex(results.length - 1);
      return;
    }

    // Esc does some thing as blur
    if (event.key === 'Escape') {
      onInputBlur();
      return;
    }
  };

  const onOptionMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  return {
    activeIndex,
    isExpanded,
    minimumSearchLength: MINIMUM_SEARCH_LENGTH,
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
