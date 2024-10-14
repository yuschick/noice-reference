import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import {
  CommonUtils,
  Icon,
  InputField,
  InputFieldProps,
  useAnalytics,
  useMediaQuery,
  useStableBodyOverflow,
} from '@noice-com/common-ui';
import {
  AnalyticsEventClientContentSearchAction,
  AnalyticsEventClientContentSearchResultCategory,
  AnalyticsEventClientContentSearchSection,
} from '@noice-com/schemas/analytics/analytics.pb';
import classNames from 'classnames';
import { useEffect, useId } from 'react';
import { BiSearch } from 'react-icons/bi';

import { useSearchInputMethods } from './hooks/useSearchInputMethods.hook';
import styles from './SearchInput.module.css';
import { SearchInputCategoryLink } from './SearchInputCategoryLink/SearchInputCategoryLink';
import { SearchInputChannelLink } from './SearchInputChannelLink/SearchInputChannelLink';

import {
  SearchMatchResultCategoryFragment,
  SearchMatchResultChannelFragment,
} from '@gen';

export interface Props extends Pick<InputFieldProps, 'theme'> {
  searchResultsLoading: boolean;
  searchResults: SearchResults;
  autoFocus?: boolean;
  initialQuery?: string;
  onValueChange(query: string): void;
  getSearchPageLink(query: string): string;
  onSearchSubmit?(): void;
}

export interface SearchResult<T> {
  result: T;
  link: string;
}

export type SearchResults = {
  channels?: SearchResult<SearchMatchResultChannelFragment>[];
  categories?: SearchResult<SearchMatchResultCategoryFragment>[];
};

const getOptionId = (index: number, componentId: string) => {
  return `option-${componentId}-${index}`;
};

export function SearchInput({
  searchResultsLoading,
  searchResults,
  onValueChange,
  getSearchPageLink,
  autoFocus = false,
  initialQuery,
  onSearchSubmit,
  theme = 'blue',
}: Props) {
  const [showCategories] = useBooleanFeatureFlag('categoriesSearch');
  const componentId = useId();
  const { trackEvent } = useAnalytics();
  const listId = `list-${componentId}`;
  const wideSearchResultsList = useMediaQuery(`(max-width: ${CommonUtils.getRem(800)})`);
  const onSearchResultClick = (
    id: string,
    category: AnalyticsEventClientContentSearchResultCategory,
  ) => {
    trackEvent({
      clientContentSearch: {
        action: AnalyticsEventClientContentSearchAction.ACTION_RESULT_CLICK,
        section: AnalyticsEventClientContentSearchSection.SECTION_POPOVER,
        searchTerm: value,
        resultId: id,
        resultCategory: category,
      },
    });
    onSearchSubmit?.();
  };

  const {
    activeIndex,
    minimumSearchLength,
    value,
    wrapperRef,
    onFormSubmit,
    onInputChange,
    onInputBlur,
    onInputFocus,
    onInputKeyDown,
    onOptionMouseEnter,
    inputRef,
  } = useSearchInputMethods({
    results: searchResults,
    onValueChange,
    getSearchPageLink,
    onSearchSubmit,
    initialValue: initialQuery,
  });

  const activeOptionId =
    activeIndex < 0 ? undefined : getOptionId(activeIndex, componentId);
  const isFocused = inputRef.current === document.activeElement;

  const hasResults =
    isFocused &&
    (!!searchResults.channels?.length || !!searchResults.categories?.length) &&
    value.length >= minimumSearchLength;
  const noResultsFound =
    isFocused &&
    !searchResults.channels?.length &&
    !searchResults.categories?.length &&
    value.length >= minimumSearchLength &&
    !searchResultsLoading;
  const isExpanded = hasResults || noResultsFound;
  const resultsAmount =
    (searchResults.channels?.length || 0) + (searchResults.categories?.length || 0);
  const stableOverflow = useStableBodyOverflow({ isActive: isExpanded });

  useEffect(() => {
    if (!wideSearchResultsList) {
      return;
    }

    // if search results list occupies whole screen then we need to disable overflow on body
    if (isExpanded) {
      stableOverflow.enable();
      return;
    }
  }, [wideSearchResultsList, isExpanded, stableOverflow]);

  return (
    <search
      className={classNames(styles.wrapper, {
        [styles.expanded]: isExpanded,
      })}
    >
      <form
        autoComplete="off"
        ref={wrapperRef}
        onSubmit={onFormSubmit}
      >
        {/* eslint-disable jsx-a11y/no-autofocus */}
        <InputField
          aria-autocomplete="none"
          aria-controls={listId}
          aria-expanded={isExpanded ? 'true' : 'false'}
          autoFocus={autoFocus}
          data-active-option={activeOptionId}
          label={showCategories ? 'Search' : 'Search channels'}
          labelType="disappearing"
          maxLength={50}
          min={minimumSearchLength}
          ref={inputRef}
          role="combobox"
          size="sm"
          slots={{
            inputStart: (
              <div className={styles.searchIcon}>
                <Icon
                  icon={BiSearch}
                  size={16}
                />
              </div>
            ),
          }}
          theme={theme}
          type="search"
          value={value}
          onBlur={onInputBlur}
          onChange={onInputChange}
          onFocus={onInputFocus}
          onKeyDown={onInputKeyDown}
        />
        {/* eslint-enable jsx-a11y/no-autofocus */}

        <div className={styles.listboxWrapper}>
          <ul
            aria-label="Search results"
            className={styles.list}
            id={listId}
            role="listbox"
          >
            {hasResults ? (
              <>
                {showCategories && !!searchResults.channels?.length && (
                  <li
                    className={styles.categoryName}
                    key="category-channels"
                  >
                    Channels
                  </li>
                )}
                {searchResults.channels?.map(({ result, link }, index) => (
                  <li
                    aria-posinset={index + 1}
                    aria-selected={activeIndex === index}
                    aria-setsize={resultsAmount}
                    className={styles.listOption}
                    id={getOptionId(index, componentId)}
                    key={index}
                    role="option"
                    onMouseEnter={() => onOptionMouseEnter(index)}
                  >
                    <SearchInputChannelLink
                      channel={result}
                      channelLink={link}
                      className={styles.item}
                      query={value}
                      onClick={() =>
                        onSearchResultClick(
                          result.id,
                          AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CHANNELS,
                        )
                      }
                    />
                  </li>
                ))}
                {showCategories && !!searchResults.categories?.length && (
                  <>
                    {!!searchResults.channels?.length && (
                      <li>
                        <hr className={styles.separator} />
                      </li>
                    )}
                    <li className={styles.categoryName}>Categories</li>
                  </>
                )}
                {searchResults.categories?.map(({ result, link }, i) => {
                  const index = (searchResults.channels?.length || 0) + i;

                  return (
                    <li
                      aria-posinset={index + 1}
                      aria-selected={activeIndex === index}
                      aria-setsize={resultsAmount}
                      className={styles.listOption}
                      id={getOptionId(index, componentId)}
                      key={index}
                      role="option"
                      onMouseEnter={() => onOptionMouseEnter(index)}
                    >
                      <SearchInputCategoryLink
                        category={result.game}
                        className={styles.item}
                        link={link}
                        query={value}
                        onClick={() =>
                          onSearchResultClick(
                            result.gameId,
                            AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CATEGORIES,
                          )
                        }
                      />
                    </li>
                  );
                })}
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
        </div>
      </form>
    </search>
  );
}

SearchInput.fragments = {
  channel: gql`
    fragment SearchMatchResultChannel on ChannelChannel {
      id
      ...SearchInputChannelLinkChannel
    }
    fragment SearchMatchResultCategory on ChannelGameStats {
      gameId
      game {
        id
        ...SearchInputCategoryLinkGame
      }
    }
  `,
};
