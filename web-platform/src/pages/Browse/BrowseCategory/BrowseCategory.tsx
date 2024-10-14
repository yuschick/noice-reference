import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { LoadingSkeleton } from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';

import styles from './BrowseCategory.module.css';
import { BrowseCategoryChannels } from './BrowseCategoryChannels/BrowseCategoryChannels';

import { ChannelListPagesNavigation } from '@common/navigation';
import { BROWSE_CATEGORIES_PATH } from '@common/route';
import { useBrowseCategoryQuery } from '@gen';

gql`
  query BrowseCategory($categoryId: ID!) {
    game(id: $categoryId) {
      id
      name
    }
  }
`;

export function BrowseCategory() {
  const { category } = useParams();
  const categoryId = category?.replace('-creators', '');

  const navigate = useNavigate();

  const { data, loading } = useBrowseCategoryQuery({
    ...variablesOrSkip({ categoryId }),
    onCompleted(data) {
      if (!data.game) {
        navigate(BROWSE_CATEGORIES_PATH, { replace: true });
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Browse category</title>
      </Helmet>

      <section className={styles.pageContent}>
        <ChannelListPagesNavigation />

        <div className={styles.pageTitleWrapper}>
          {loading ? (
            <LoadingSkeleton
              className={styles.loadingTitle}
              count={2}
              width={240}
            />
          ) : (
            <h1 className={styles.pageTitle}>
              {data?.game?.name} <span className={styles.titleCreators}>creators</span>
            </h1>
          )}
        </div>

        {!!categoryId && <BrowseCategoryChannels categoryId={categoryId} />}
      </section>
    </>
  );
}
