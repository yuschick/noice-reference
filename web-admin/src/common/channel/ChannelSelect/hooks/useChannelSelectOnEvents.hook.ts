import { useOnOutsideClick } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ChannelSelectChannelFragment, ChannelSelectResultItemFragment } from '@gen';

interface HookResult {
  activeIndex: number;
  isExpanded: boolean;
  value: string;
  wrapperRef: RefObject<HTMLDivElement>;
  onInputBlur(): void;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onInputFocus(event: FocusEvent<HTMLInputElement>): void;
  onInputKeyDown(event: KeyboardEvent): void;
  onOptionMouseEnter(index: number): void;
  onOptionMouseDown(): void;
  onOptionClick(index: number): void;
}

interface Props {
  results: ChannelSelectResultItemFragment[];
  selected: Nullable<ChannelSelectChannelFragment>;
  onChange(value: string): void;
  onSelect(userId: string): void;
  onBlur?(): void;
}

export function useChannelSelectOnEvents({
  results,
  selected,
  onChange: onChangeProp,
  onSelect,
  onBlur,
}: Props): HookResult {
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const preventBlur = useRef(false);

  useOnOutsideClick(wrapperRef, () => setIsExpanded(false));

  useEffect(() => {
    if (!selected) {
      setValue('');
      return;
    }

    setValue(selected.name);
    setIsExpanded(false);
  }, [selected]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Close listbox if no value, otherwise open
    setIsExpanded(!!value);

    // Set active index to start when no value
    if (!value) {
      setActiveIndex(-1);
    }

    onChangeProp(value);
    setValue(value);
  };

  const onInputBlur = () => {
    onBlur?.();
    // When blur is prevented, do nothing
    if (preventBlur.current) {
      preventBlur.current = false;
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
    if (event.key === 'Enter') {
      event.preventDefault();

      const activeResultItemEntity = results[activeIndex].entity;

      if (activeResultItemEntity?.__typename === 'ChannelChannel') {
        onSelect(activeResultItemEntity.id);
      }

      return;
    }

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

  const onOptionMouseDown = () => {
    preventBlur.current = true;
  };

  const onOptionClick = (index: number) => {
    const activeResultItemEntity = results[index].entity;

    if (activeResultItemEntity?.__typename === 'ChannelChannel') {
      onSelect(activeResultItemEntity.id);
    }
  };

  return {
    activeIndex,
    isExpanded,
    value,
    wrapperRef,
    onInputChange,
    onInputBlur,
    onInputFocus,
    onInputKeyDown,
    onOptionMouseEnter,
    onOptionMouseDown,
    onOptionClick,
  };
}
