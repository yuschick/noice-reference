import { gql, TypedDocumentNode } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import {
  AnalyticsEventClientContentSearchAction,
  AnalyticsEventClientContentSearchResultCategory,
  AnalyticsEventClientContentSearchSection,
} from '@noice-com/schemas/analytics/analytics.pb';

import { SearchResultsWrapper } from '../SearchResultsWrapper';

import styles from './CategorySearchResults.module.css';

import { CategoryLink } from '@common/category';
import { ShowMoreButton } from '@common/search';
import {
  SearchPageCategorySearchDocument,
  SearchPageCategorySearchQuery,
  SearchPageCategorySearchQueryVariables,
} from '@gen';

gql`
  query SearchPageCategorySearch($query: String, $cursor: String) {
    publicSearch(
      query: $query
      entityTypes: [ENTITY_TYPE_GAME]
      cursor: { first: 28, after: $cursor }
    ) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      resultItems {
        ...CategorySearchResult
      }
    }
  }
`;

export function CategorySearchResults() {
  const { trackEvent } = useAnalytics();

  return (
    <SearchResultsWrapper<
      TypedDocumentNode<
        SearchPageCategorySearchQuery,
        SearchPageCategorySearchQueryVariables
      >
    >
      document={SearchPageCategorySearchDocument}
    >
      {({ searchResults, query, hasNextPage, onLoadMoreResults }) => (
        <>
          <ul className={styles.searchResults}>
            {searchResults.map(({ entity }) => {
              if (entity?.__typename !== 'ChannelGameStats') {
                return null;
              }

              const onResultClick = () => {
                trackEvent({
                  clientContentSearch: {
                    action: AnalyticsEventClientContentSearchAction.ACTION_RESULT_CLICK,
                    section: AnalyticsEventClientContentSearchSection.SECTION_PAGE,
                    resultId: entity.gameId,
                    searchTerm: query,
                    resultCategory:
                      AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CATEGORIES,
                  },
                });
              };

              return (
                <li key={entity.gameId}>
                  <CategoryLink
                    category={entity}
                    onClick={onResultClick}
                  />
                </li>
              );
            })}
          </ul>
          {hasNextPage && (
            <div>
              <ShowMoreButton onClick={onLoadMoreResults} />
            </div>
          )}
        </>
      )}
    </SearchResultsWrapper>
  );
}

CategorySearchResults.fragments = {
  entry: gql`
    fragment CategorySearchResult on SearchResultItem {
      entityId
      entity {
        ... on ChannelGameStats {
          gameId
          ...CategoryLinkGameStats
        }
      }
    }
  `,
};
