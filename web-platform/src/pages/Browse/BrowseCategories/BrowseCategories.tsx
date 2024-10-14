import { gql } from '@apollo/client';
import { LoadingSkeleton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { BrowseTabNavigation } from '../BrowseTabNavigation';

import styles from './BrowseCategories.module.css';

import { CategoryLink, useCategoryListClickAnalyticsEvent } from '@common/category';
import { ChannelListPagesNavigation } from '@common/navigation';
import { useBrowseCategoriesQuery } from '@gen';

gql`
  query BrowseCategories($cursor: String) {
    channelGameStats(cursor: { first: 21, after: $cursor }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      games {
        gameId
        ...CategoryLinkGameStats
      }
    }
  }
`;

export function BrowseCategories() {
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, fetchMore } = useBrowseCategoriesQuery();
  const categories = data?.channelGameStats?.games ?? [];
  const hasNextPage = data?.channelGameStats?.pageInfo?.hasNextPage ?? false;

  const { listRef, onCategoryLinkClick } = useCategoryListClickAnalyticsEvent();

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    let isLoading = false;

    const observer = new IntersectionObserver((entries) => {
      // Prevent multiple calls
      if (isLoading) {
        return;
      }

      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          isLoading = true;
          setIsLoadingMore(true);

          await fetchMore({
            variables: {
              cursor: data?.channelGameStats?.pageInfo?.endCursor,
            },
          });

          setIsLoadingMore(false);
          isLoading = false;
        }
      });
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [data?.channelGameStats?.pageInfo?.endCursor, fetchMore, hasNextPage]);

  return (
    <>
      <Helmet>
        <title>Browse categories</title>
      </Helmet>

      <section className={styles.pageContent}>
        <ChannelListPagesNavigation />

        <h1 className={styles.pageTitle}>Browse</h1>

        <BrowseTabNavigation />

        <h2 className={styles.listTitle}>Browse all</h2>

        {loading ? (
          <BrowseCategories.Loading />
        ) : (
          <ul
            className={styles.categoriesList}
            ref={listRef}
          >
            {categories.map((category, index) => (
              <li key={category.gameId}>
                <CategoryLink
                  category={category}
                  onClick={() => onCategoryLinkClick(category.gameId, index)}
                />
              </li>
            ))}

            {isLoadingMore && <CategoryLink.Loading />}
          </ul>
        )}

        {!!hasNextPage && <div ref={loadMoreRef} />}
      </section>
    </>
  );
}

BrowseCategories.Loading = () => (
  <LoadingSkeleton
    className={classNames(styles.categoriesList, styles.loadingSkeleton)}
    count={8}
  />
);
