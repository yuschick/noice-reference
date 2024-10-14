import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useId } from 'react';
import { validate } from 'uuid';

import { useProfileSelectOnEvents } from './hooks/useProfileSelectOnEvents.hook';
import styles from './ProfileSelect.module.css';

import { Button } from '@common/button';
import { getUserMatchedField } from '@common/search';
import { HighlightedText } from '@common/text';
import { ProfileSelectProfileFragment, ProfileSelectResultItemFragment } from '@gen';

const MINIMUM_SEARCH_LENGTH = 3;

export interface Props {
  label: string;
  /** Defaults to medium */
  size?: 'small' | 'medium';
  query: string;
  selected: Nullable<ProfileSelectProfileFragment>;
  results: ProfileSelectResultItemFragment[];
  hasError?: boolean;
  className?: string;
  onChange(value: string): void;
  onSelect(userId: string): void;
  onBlur?(): void;
}

const getOptionId = (index: number, componentId: string) => {
  return `option-${componentId}-${index}`;
};

const ProfileSelectOptionContent = ({
  query,
  profile,
  matchedProperties,
}: {
  query: string;
  profile: ProfileSelectProfileFragment;
  matchedProperties: string[];
}) => {
  const { userTag } = profile;

  const matchField = getUserMatchedField(profile, matchedProperties);

  return (
    <>
      <ProfileImage
        profile={profile}
        size="xs"
      />

      <div className={styles.userDetails}>
        <HighlightedText
          query={query}
          text={userTag}
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

export function ProfileSelect({
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
  } = useProfileSelectOnEvents({
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
          placeholder="Search for a user"
          role="combobox"
          type="search"
          value={value}
          onBlur={onInputBlur}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />

        <span className={styles.label}>{label}</span>

        {selected ? (
          <div className={styles.inputAvatarWrapper}>
            <ProfileImage
              profile={selected}
              size="xs"
            />
          </div>
        ) : (
          <div className={classNames(styles.inputAvatar, styles.emptyAvatar)} />
        )}
      </label>

      {validate(value) && (
        <Button
          buttonType="warning"
          className={styles.useIdButton}
          text="Use id"
          onClick={() => onSelect(value)}
        />
      )}

      <ul
        aria-label="User options"
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
              {entity?.__typename === 'ProfileProfile' && (
                <ProfileSelectOptionContent
                  matchedProperties={matchedProperties}
                  profile={entity}
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

ProfileSelect.fragments = {
  resultItem: gql`
    fragment ProfileSelectResultItem on SearchResultItem {
      entity {
        ... on ProfileProfile {
          ...ProfileSelectProfile
        }
      }
      matchedProperties
    }
  `,
  profile: gql`
    fragment ProfileSelectProfile on ProfileProfile {
      userId
      userTag
      ...ProfileImageProfile
      ...SearchMatchResultProfile
    }
  `,
};
