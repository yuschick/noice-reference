import { gql } from '@apollo/client';
import { Icon, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useId } from 'react';
import { BiSearch } from 'react-icons/bi';
import { generatePath } from 'react-router-dom';

import { useSearchBoxMethods } from './hooks/useSearchBoxMethods.hook';
import styles from './SearchBox.module.css';
import { SearchBoxChannelLink } from './SearchBoxChannelLink/SearchBoxChannelLink';
import { SearchBoxProfileLink } from './SearchBoxProfileLink/SearchBoxProfileLink';

import { ButtonLink } from '@common/button';
import {
  SearchBoxProfileResultItemFragment,
  SearchBoxChannelResultItemFragment,
} from '@gen';

export interface Props {
  userResults: SearchBoxProfileResultItemFragment[];
  channelResults: SearchBoxChannelResultItemFragment[];
  onValueChange(value: string): void;
  onSearchSubmit(value: string): void;
  onUserSelectSubmit(userId: string): void;
  onChannelSelectSubmit(channelId: string): void;
}

const getOptionId = (index: number, componentId: string) => {
  return `option-${componentId}-${index}`;
};

export function SearchBox({
  userResults,
  channelResults,
  onValueChange,
  onSearchSubmit,
  onUserSelectSubmit,
  onChannelSelectSubmit,
}: Props) {
  const componentId = useId();
  const listId = `list-${componentId}`;

  const {
    activeIndex,
    isExpanded,
    minimumSearchLength,
    value,
    wrapperRef,
    onFormSubmit,
    onInputChange,
    onInputBlur,
    onInputFocus,
    onInputKeyDown,
    onOptionMouseEnter,
  } = useSearchBoxMethods({
    results: [...userResults, ...channelResults],
    onSearchSubmit,
    onUserSelectSubmit,
    onChannelSelectSubmit,
    onValueChange,
  });

  const activeOptionId =
    activeIndex < 0 ? undefined : getOptionId(activeIndex, componentId);

  const hasUserResults = !!userResults.length;
  const hasChannelResults = !!channelResults.length;
  const hasResults = hasUserResults || hasChannelResults;

  const showResults = hasResults && value.length >= minimumSearchLength;

  return (
    <form
      className={classNames(styles.wrapper, { [styles.expanded]: isExpanded })}
      ref={wrapperRef}
      onSubmit={onFormSubmit}
    >
      <label className={styles.inputWrapper}>
        <VisuallyHidden>Search</VisuallyHidden>

        <input
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isExpanded ? 'true' : 'false'}
          className={styles.input}
          data-active-option={activeOptionId}
          min={minimumSearchLength}
          placeholder="Search"
          role="combobox"
          type="search"
          onBlur={onInputBlur}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />

        <Icon
          className={styles.searchIcon}
          icon={BiSearch}
        />
      </label>

      <div className={styles.listboxWrapper}>
        <ul
          aria-label="Search results within users"
          className={classNames(styles.list, styles.groupList)}
          id={listId}
          role="listbox"
        >
          {showResults ? (
            <>
              {hasUserResults && (
                <li>
                  <div>
                    <span className={styles.groupLabel}>Users</span>

                    <ul className={styles.list}>
                      {userResults.map(({ entity, matchedProperties }, index) => (
                        <li
                          aria-selected={activeIndex === index}
                          className={styles.listOption}
                          id={getOptionId(index, componentId)}
                          key={index}
                          role="option"
                          onMouseEnter={() => onOptionMouseEnter(index)}
                        >
                          {entity?.__typename === 'ProfileProfile' && (
                            <SearchBoxProfileLink
                              className={styles.user}
                              matchedProperties={matchedProperties}
                              profile={entity}
                              query={value}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}

              {hasUserResults && hasChannelResults && <li className={styles.divider} />}

              {hasChannelResults && (
                <li>
                  <div>
                    <span className={styles.groupLabel}>Channels</span>

                    <ul className={styles.list}>
                      {channelResults.map(({ entity, matchedProperties }, index) => (
                        <li
                          aria-selected={activeIndex === index + userResults.length}
                          className={styles.listOption}
                          id={getOptionId(index, componentId)}
                          key={index}
                          role="option"
                          onMouseEnter={() =>
                            onOptionMouseEnter(index + userResults.length)
                          }
                        >
                          {entity?.__typename === 'ChannelChannel' && (
                            <SearchBoxChannelLink
                              channel={entity}
                              className={styles.user}
                              matchedProperties={matchedProperties}
                              query={value}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </>
          ) : (
            <li className={styles.noResult}>
              {value.length < minimumSearchLength ? (
                <span>
                  Type at least {minimumSearchLength} characters to see search results.
                </span>
              ) : (
                <span>No results found.</span>
              )}
            </li>
          )}
        </ul>

        {showResults && (
          <div className={styles.buttonWrapper}>
            <ButtonLink
              buttonType="ghost"
              text="See all results"
              to={generatePath('/search/:value/users', {
                value,
              })}
            />
          </div>
        )}
      </div>
    </form>
  );
}

SearchBox.fragments = {
  profile: gql`
    fragment SearchBoxProfileResultItem on SearchResultItem {
      entity {
        ... on ProfileProfile {
          ...SearchBoxProfileLinkProfile
        }
      }
      matchedProperties
    }
  `,
  channel: gql`
    fragment SearchBoxChannelResultItem on SearchResultItem {
      entity {
        ... on ChannelChannel {
          ...SearchBoxChannelLinkChannel
        }
      }
      matchedProperties
    }
  `,
};
