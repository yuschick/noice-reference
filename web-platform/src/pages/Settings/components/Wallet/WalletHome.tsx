import { gql } from '@apollo/client';
import { useAuthenticatedUser, Button, LoadingSkeleton } from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { SettingsGroup } from '../SettingsGroup';

import { Payments } from './Payments/Payments';
import styles from './Wallet.module.css';

import { SettingsWalletPaymentsQuery, useSettingsWalletPaymentsQuery } from '@gen';

gql`
  query SettingsWalletPayments($userId: ID, $cursor: APICursorInput) {
    payments(
      userId: $userId
      cursor: $cursor
      filter: { statuses: [PAYMENT_STATUS_REVERSED, PAYMENT_STATUS_SUCCESS] }
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      payments {
        id
        ...WalletPaymentsPayment
      }
    }
  }
`;

const PAGE_SIZE = 10;

export function WalletHome() {
  const [paymentsData, setPaymentsData] = useState<
    SettingsWalletPaymentsQuery | undefined
  >();
  const { userId } = useAuthenticatedUser();
  const { data, fetchMore, loading } = useSettingsWalletPaymentsQuery({
    variables: {
      userId,
      cursor: {
        first: PAGE_SIZE,
      },
    },
    // Wallet is important to be up to date, so we always want to fetch the latest data
    fetchPolicy: 'network-only',
  });

  const handleNextClick = useCallback(async () => {
    const { data: fetchMoreData } = await fetchMore({
      variables: {
        cursor: {
          after: paymentsData?.payments?.pageInfo?.endCursor,
          first: PAGE_SIZE,
        },
      },
    });

    setPaymentsData(fetchMoreData);
  }, [fetchMore, paymentsData?.payments?.pageInfo?.endCursor]);

  const handlePreviousClick = useCallback(async () => {
    const { data: fetchMoreData } = await fetchMore({
      variables: {
        cursor: {
          before: paymentsData?.payments?.pageInfo?.startCursor,
          last: PAGE_SIZE,
        },
      },
    });

    setPaymentsData(fetchMoreData);
  }, [fetchMore, paymentsData?.payments?.pageInfo?.startCursor]);

  useEffect(() => {
    if (!data || paymentsData) {
      return;
    }

    setPaymentsData(data);
  }, [data, paymentsData]);

  const hasNextPage = paymentsData?.payments?.pageInfo?.hasNextPage;
  const hasPreviousPage = paymentsData?.payments?.pageInfo?.hasPreviousPage;
  const payments = paymentsData?.payments?.payments ?? [];

  return (
    <SettingsGroup
      description="Here you can see all of your purchases made on Noice."
      title="Payment History"
    >
      <section className={styles.paymentsHistoryWrapper}>
        <div className={styles.paymentsWrapper}>
          {loading && !paymentsData ? (
            <LoadingSkeleton height={24} />
          ) : payments.length ? (
            <Payments payments={payments} />
          ) : (
            <span className={styles.emptyPaymentsText}>
              No purchases made from Noice Store.
            </span>
          )}
        </div>

        {(hasPreviousPage || hasNextPage) && (
          <div className={styles.paginationWrapper}>
            <Button
              aria-label="Previous page"
              isDisabled={!hasPreviousPage || loading}
              size="sm"
              onClick={handlePreviousClick}
            >
              Previous
            </Button>

            <Button
              aria-label="Next page"
              isDisabled={!hasNextPage || loading}
              size="sm"
              onClick={handleNextClick}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </SettingsGroup>
  );
}
