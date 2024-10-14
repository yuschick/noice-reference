import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useId } from 'react';

import styles from './ChannelSelect.module.css';
import { useChannelSelectOnEvents } from './hooks/useChannelSelectOnEvents.hook';

import { getChannelMatchedField } from '@common/search';
import { HighlightedText } from '@common/text';
import { ChannelSelectChannelFragment, ChannelSelectResultItemFragment } from '@gen';

const MINIMUM_SEARCH_LENGTH = 3;

export interface Props {
  label: string;
  /** Defaults to medium */
  size?: 'small' | 'medium';
  query: string;
  selected: Nullable<ChannelSelectChannelFragment>;
  results: ChannelSelectResultItemFragment[];
  hasError?: boolean;
  className?: string;
  required?: boolean;
  onChange(value: string): void;
  onSelect(channelId: string): void;
  onBlur?(): void;
}

const getOptionId = (index: number, componentId: string) => {
  return `option-${componentId}-${index}`;
};

const ChannelSelectOptionContent = ({
  query,
  channel,
  matchedProperties,
}: {
  query: string;
  channel: ChannelSelectChannelFragment;
  matchedProperties: string[];
}) => {
  const { name } = channel;

  const matchField = getChannelMatchedField(channel, matchedProperties);

  return (
    <>
      <ChannelLogo
        channel={channel}
        size="xs"
      />

      <div className={styles.channelDetails}>
        <HighlightedText
          query={query}
          text={name}
        />

        {matchField && matchField.field !== 'name' && (
          <div className={styles.matchRow}>
            <HighlightedText
              query={query}
              text={matchField.value}
            />
            <span>{matchField.field}</span>
          </div>
        )}
      </div>
    </>
  );
};

export function ChannelSelect({
  label,
  size,
  query,
  results,
  onChange,
  onSelect,
  onBlur,
  selected,
  hasError,
  className,
  required,
}: Props) {
  const {
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
  } = useChannelSelectOnEvents({
    onChange,
    onSelect,
    results,
    selected,
    onBlur,
  });

  const componentId = useId();
  const listId = `list-${componentId}`;
  const activeOptionId =
    activeIndex < 0 ? undefined : getOptionId(activeIndex, componentId);
  const showResults = !!results.length && value.length >= MINIMUM_SEARCH_LENGTH;

  return (
    <div
      className={classNames(styles.wrapper, styles[size ?? 'medium'], className, {
        [styles.expanded]: isExpanded,
      })}
      ref={wrapperRef}
    >
      <label className={styles.inputWrapper}>
        <input
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isExpanded ? 'true' : 'false'}
          aria-invalid={hasError ? 'true' : undefined}
          className={styles.input}
          data-active-option={activeOptionId}
          placeholder="Search for a channel"
          required={required}
          role="combobox"
          type="search"
          value={value}
          onBlur={onInputBlur}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />

        <span className={styles.label}>{label}</span>

        <div className={styles.inputLogoWrapper}>
          {selected ? (
            <ChannelLogo
              channel={selected}
              size="xs"
            />
          ) : (
            <div className={classNames(styles.inputLogo, styles.emptyLogo)} />
          )}
        </div>
      </label>

      <ul
        aria-label="Channel options"
        className={styles.list}
        id={listId}
        role="listbox"
      >
        {showResults ? (
          results.map(({ entity, matchedProperties }, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              aria-selected={activeIndex === index}
              className={styles.listOption}
              id={getOptionId(index, componentId)}
              key={index}
              role="option"
              onClick={() => onOptionClick(index)}
              onMouseDown={onOptionMouseDown}
              onMouseEnter={() => onOptionMouseEnter(index)}
            >
              {entity?.__typename === 'ChannelChannel' && (
                <ChannelSelectOptionContent
                  channel={entity}
                  matchedProperties={matchedProperties}
                  query={query}
                />
              )}
            </li>
          ))
        ) : (
          <li className={styles.noResult}>
            {value.length < MINIMUM_SEARCH_LENGTH ? (
              <span>
                Type at least {MINIMUM_SEARCH_LENGTH} characters to see search results.
              </span>
            ) : (
              <span>No results found.</span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

ChannelSelect.fragments = {
  resultItem: gql`
    fragment ChannelSelectResultItem on SearchResultItem {
      entity {
        ... on ChannelChannel {
          ...ChannelSelectChannel
        }
      }
      matchedProperties
    }
  `,
  channel: gql`
    fragment ChannelSelectChannel on ChannelChannel {
      id
      name
      ...ChannelLogoChannel
      ...SearchMatchResultChannel
    }
  `,
};
