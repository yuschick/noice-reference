import { useApolloClient } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { Tabs, useTabs } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import styles from './Search.module.css';
import { ChannelSearchResults } from './SearchResults';

import { Routes } from '@common/route';
import { SearchRoutes } from '@common/route/types';
import { SEARCH_QUERY_PARAM } from '@common/search';

export function Search() {
  const { pathname } = useLocation();
  const { cache } = useApolloClient();
  const searchCategories = Object.values(SearchRoutes);
  const store = useTabs({ variant: 'page' });
  const [showCategories] = useBooleanFeatureFlag('categoriesSearch');
  const [params] = useSearchParams();
  const query = params.get(SEARCH_QUERY_PARAM);

  useEffect(() => {
    cache.evict({ fieldName: 'publicSearch' });
    cache.gc();
  }, [cache, pathname]);

  return (
    <section className={classNames(styles.wrapper, { [styles.wide]: showCategories })}>
      <Helmet>
        <title>{query}</title>
      </Helmet>

      <div className={styles.content}>
        <h1 className={styles.header}>
          <span className={styles.secondaryText}>Results for</span>&nbsp;
          <span className={styles.title}>{query}</span>
        </h1>
        {!showCategories && <hr className={styles.separator} />}
        {!showCategories ? (
          <ChannelSearchResults />
        ) : (
          <>
            <div className={styles.categories}>
              <Tabs
                store={store}
                title="Search results category"
              >
                <Tabs.List>
                  {Object.values(searchCategories).map((category) => {
                    return (
                      <Tabs.TabLink
                        key={category}
                        to={{
                          pathname: `${Routes.Search}/${category}`,
                          search: location.search,
                        }}
                      >
                        {category}
                      </Tabs.TabLink>
                    );
                  })}
                </Tabs.List>
              </Tabs>
            </div>
            <Outlet />
          </>
        )}
      </div>
    </section>
  );
}
