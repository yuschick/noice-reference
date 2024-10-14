import { gql } from '@apollo/client';
import { ButtonLink, useBooleanFeatureFlag, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';

import { HOME_CHANNEL_POLL_INTERVAL } from '../utils';

import styles from './HomePageCategoryList.module.css';

import { CategoryLink, useCategoryListClickAnalyticsEvent } from '@common/category';
import { BROWSE_CATEGORIES_PATH } from '@common/route';
import { useHomePageCategoryListQuery, useHomePageOfflineCategoryListQuery } from '@gen';

gql`
  query HomePageCategoryList {
    channelGameStats(filters: [{ live: true }], cursor: { first: 6 })
      @connection(key: "homepage") {
      games {
        gameId
        ...CategoryLinkGameStats
      }
    }
  }

  query HomePageOfflineCategoryList {
    channelGameStats(cursor: { first: 6 }) @connection(key: "homepage") {
      games {
        gameId
        ...CategoryLinkGameStats
      }
    }
  }
`;

export function HomePageCategoryList() {
  const { listRef, onCategoryLinkClick } = useCategoryListClickAnalyticsEvent();

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  const { data, loading } = useHomePageCategoryListQuery({
    pollInterval: HOME_CHANNEL_POLL_INTERVAL,
    fetchPolicy: 'network-only',
  });

  const isOnline = !!data?.channelGameStats?.games.length;

  const { data: backupData } = useHomePageOfflineCategoryListQuery({
    skip: loading || isOnline,
  });

  const categories =
    (isOnline ? data?.channelGameStats?.games : backupData?.channelGameStats?.games) ??
    [];

  if (!loading && !categories.length) {
    return null;
  }

  return (
    <div
      className={classNames(styles.categoriesListWrapper, {
        [styles.tighterHomePage]: tighterHomePage,
      })}
    >
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>
          {isOnline && (
            <>
              <span className={styles.titlePrefix}>Live</span>{' '}
            </>
          )}
          categories
        </h2>

        <ButtonLink
          fit="content"
          level="secondary"
          size="xs"
          to={BROWSE_CATEGORIES_PATH}
        >
          See all <VisuallyHidden>{isOnline && <>live </>}categories</VisuallyHidden>
        </ButtonLink>
      </div>

      {loading ? (
        <HomePageCategoryList.Loading />
      ) : (
        <ul
          className={styles.categoriesList}
          ref={listRef}
        >
          {categories.map((category, index) => (
            <li
              className={styles.categoryListItem}
              key={category.gameId}
            >
              <CategoryLink
                category={category}
                onClick={() => onCategoryLinkClick(category.gameId, index)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

HomePageCategoryList.Loading = () => (
  <ul className={styles.categoriesList}>
    {new Array(6).fill(null).map((_, index) => (
      <li
        className={styles.categoryListItem}
        key={index}
      >
        <CategoryLink.Loading />
      </li>
    ))}
  </ul>
);
