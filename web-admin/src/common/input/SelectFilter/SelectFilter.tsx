import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useId, useState, KeyboardEvent, useEffect, useRef, useCallback } from 'react';
import { BiCheck } from 'react-icons/bi';

import { InputOption } from '../types';

import styles from './SelectFilter.module.css';

export interface Props {
  label: string;
  options: InputOption[];
  defaultValue?: string[];
  onChange(values: string[]): void;
}

const getSelectedLabel = (selectedLength: number, optionsLength: number) => {
  if (selectedLength <= 0) {
    return '—';
  }

  if (selectedLength === optionsLength) {
    return 'All';
  }

  return selectedLength;
};

export function SelectFilter({ label, options, defaultValue, onChange }: Props) {
  const [selected, setSelected] = useState<string[]>(defaultValue ?? []);
  const [expanded, setExpanded] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const id = useId();

  const preventBlur = useRef(false);
  const combobox = useRef<HTMLDivElement>(null);

  const listboxId = `listbox${id}`;
  const labelId = `label${id}`;

  const onOptionChange = useCallback(
    (optionValue: string) => {
      let newSelected = selected;

      // If option is in the array, remove it
      if (newSelected.includes(optionValue)) {
        newSelected = newSelected.filter((o) => o !== optionValue);
      } else {
        // Otherwise add option to array
        newSelected = [...newSelected, optionValue];
      }

      onChange(newSelected);
      setSelected(newSelected);
    },
    [onChange, selected],
  );

  const onComboboxKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Open and close on enter
        if (activeOption < 0) {
          setExpanded((prev) => !prev);
          return;
        }

        // Do nothing else if list is not expanded
        if (!expanded) {
          return;
        }

        // On enter change option
        onOptionChange(options[activeOption].value);
        return;
      }

      // Do nothing on keys, when list is not expanded
      if (!expanded) {
        return;
      }

      if (event.key === 'ArrowDown') {
        setActiveOption((prev) => {
          // If no active option, start from 0
          if (prev < 0) {
            return 0;
          }

          // If active is in the end, go to start
          if (prev === options.length - 1) {
            return 0;
          }

          // Set it to be next
          return prev + 1;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        setActiveOption((prev) => {
          // If no active option or in start, go to end
          if (prev <= 0) {
            return options.length - 1;
          }

          // Set it to be next
          return prev - 1;
        });
        return;
      }

      // Go to the first item whit home key
      if (event.key === 'Home') {
        setActiveOption(0);
      }

      // Go to the last item with end key
      if (event.key === 'End') {
        setActiveOption(options.length - 1);
      }

      // Esc closes the listbox
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    },
    [activeOption, expanded, onOptionChange, options],
  );

  const onOptionClick = useCallback(
    (optionValue: string) => {
      // Change option
      onOptionChange(optionValue);

      // Set clicked option to active one
      setActiveOption(options.findIndex((o) => o.value === optionValue));

      // Set focus to combobox
      combobox.current?.focus();
    },
    [onOptionChange, options],
  );

  const onComboboxBlur = () => {
    if (preventBlur.current) {
      preventBlur.current = false;
      return;
    }

    setExpanded(false);
  };

  useEffect(() => {
    if (!expanded) {
      // When not expanded, set active option to none
      setActiveOption(-1);
    }
  }, [expanded]);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.expanded]: expanded,
      })}
    >
      <div
        aria-controls={listboxId}
        aria-expanded={expanded ? 'true' : 'false'}
        aria-labelledby={labelId}
        className={styles.combobox}
        ref={combobox}
        role="combobox"
        tabIndex={0}
        onBlur={onComboboxBlur}
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
        onKeyDown={onComboboxKeyDown}
      >
        <span id={labelId}>{label}</span>

        <div className={styles.selectWrapper}>
          <span>{getSelectedLabel(selected.length, options.length)}</span>
          <Icon
            icon={CoreAssets.Icons.ChevronDown}
            size={16}
          />
        </div>
      </div>

      <div
        aria-labelledby={labelId}
        className={styles.listbox}
        id={listboxId}
        role="listbox"
      >
        {options.map((option, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
          <div
            aria-selected={selected.some((o) => o === option.value) ? 'true' : 'false'}
            className={classNames(styles.option, {
              [styles.activeOption]: index === activeOption,
            })}
            key={option.value}
            role="option"
            onClick={() => onOptionClick(option.value)}
            onMouseDown={() => {
              preventBlur.current = true;
            }}
          >
            <div className={styles.optionBox}>
              <Icon
                className={styles.optionIcon}
                icon={BiCheck}
                size={18}
              />
            </div>

            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
