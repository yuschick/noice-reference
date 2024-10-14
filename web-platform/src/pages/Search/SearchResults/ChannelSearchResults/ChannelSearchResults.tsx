import { gql, TypedDocumentNode } from '@apollo/client';
import { Pill, useAnalytics } from '@noice-com/common-ui';
import {
  AnalyticsEventClientContentSearchAction,
  AnalyticsEventClientContentSearchResultCategory,
  AnalyticsEventClientContentSearchSection,
} from '@noice-com/schemas/analytics/analytics.pb';
import classNames from 'classnames';
import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from './ChannelSearchResults.module.css';

import { ChannelLogoLink, LiveBadge } from '@common/channel';
import { FollowButton } from '@common/channel/ChannelActionButtons';
import { ShowMoreButton } from '@common/search';
import { AppSoundKeys, usePlaySound } from '@common/sound';
import {
  ChannelLiveStatus,
  SearchPageChannelSearchDocument,
  SearchPageChannelSearchQuery,
  SearchPageChannelSearchQueryVariables,
} from '@gen';
import { SearchResultsWrapper } from '@pages/Search/SearchResults/SearchResultsWrapper';

gql`
  query SearchPageChannelSearch($query: String, $cursor: String) {
    publicSearch(
      query: $query
      entityTypes: [ENTITY_TYPE_CHANNEL]
      cursor: { first: 7, after: $cursor }
    ) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      resultItems {
        ...ChannelSearchResult
      }
    }
  }
`;

export function ChannelSearchResults() {
  const { trackEvent } = useAnalytics();
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const [playStreamLinkHoverSound] = usePlaySound(AppSoundKeys.GenericHover);

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    trackButtonClickEventOnMouseClick(event, 'channel-search-page');
  };

  const onMouseEnter = () => {
    playStreamLinkHoverSound();
  };

  return (
    <SearchResultsWrapper<
      TypedDocumentNode<
        SearchPageChannelSearchQuery,
        SearchPageChannelSearchQueryVariables
      >
    >
      document={SearchPageChannelSearchDocument}
    >
      {({ searchResults, query, hasNextPage, onLoadMoreResults }) => (
        <div className={styles.wrapper}>
          <ul className={styles.searchResults}>
            {searchResults.map(({ entity }) => {
              if (entity?.__typename !== 'ChannelChannel') {
                return null;
              }

              const onResultClick = () => {
                trackEvent({
                  clientContentSearch: {
                    action: AnalyticsEventClientContentSearchAction.ACTION_RESULT_CLICK,
                    section: AnalyticsEventClientContentSearchSection.SECTION_PAGE,
                    resultId: entity.id,
                    searchTerm: query,
                    resultCategory:
                      AnalyticsEventClientContentSearchResultCategory.RESULT_CATEGORY_CHANNELS,
                  },
                });
              };

              const channelPageUrl = `/${entity.name.toLowerCase()}`;

              return (
                <li key={entity.id}>
                  <div className={styles.searchResult}>
                    <div className={styles.channelInfo}>
                      <ChannelLogoLink
                        channel={entity}
                        className={styles.channelLogoWrapper}
                        size="lg"
                        tabIndex={-1}
                        onClick={onResultClick}
                      />
                      <div className={styles.channelData}>
                        <Link
                          className={styles.channelName}
                          title={entity.name}
                          to={channelPageUrl}
                          onClick={onResultClick}
                          onMouseEnter={onMouseEnter}
                        >
                          {entity.name}
                        </Link>
                        {entity.liveStatus === ChannelLiveStatus.LiveStatusLive && (
                          <div className={styles.channelTags}>
                            <LiveBadge />
                            <Pill
                              color="gray-950"
                              label={entity.game.name}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <FollowButton
                        buttonSize="sm"
                        channel={entity}
                        onButtonClick={onButtonClick}
                      />
                    </div>
                  </div>
                  <hr
                    className={classNames(
                      styles.separator,
                      styles.searchResultsSeparator,
                    )}
                  />
                </li>
              );
            })}
          </ul>
          {hasNextPage && (
            <div className={styles.paginationButton}>
              <ShowMoreButton onClick={onLoadMoreResults} />
            </div>
          )}
        </div>
      )}
    </SearchResultsWrapper>
  );
}

ChannelSearchResults.fragments = {
  entry: gql`
    fragment ChannelSearchResult on SearchResultItem {
      entityId
      entity {
        ... on ChannelChannel {
          id
          name
          liveStatus
          game {
            id
            name
          }
          ...ChannelLogoChannel
          ...FollowButtonChannel
        }
      }
    }
  `,
};
