import { gql } from '@apollo/client';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';

import styles from './UserWalletTransactions.module.css';

import {
  ContentModulePage,
  PaginatedQueryTableModulePage,
} from '@common/page-components';
import { TableData } from '@common/table';
import {
  StoreV2ItemType,
  UserWallerTransactionsQuery,
  UserWallerTransactionsQueryVariables,
  UserWalletTransactionFragment,
  WalletOperationType,
  useUserWallerTransactionsQuery,
} from '@gen';

gql`
  query UserWallerTransactions($userId: ID!, $cursor: APICursorInput) {
    walletTransactions(
      userId: $userId
      cursor: $cursor
      filter: {
        reasons: [
          TRANSACTION_REASON_ADMINISTRATIVE
          TRANSACTION_REASON_PROVISION
          TRANSACTION_REASON_PURCHASE_WITH_PAYMENT
          TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY
          TRANSACTION_REASON_STORE_ORDER_PAYMENT
          TRANSACTION_REASON_CHANNEL_SUBSCRIPTION
        ]
      }
    ) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      transactions {
        ...UserWalletTransaction
      }
    }
  }

  fragment UserWalletTransaction on WalletTransaction {
    id
    createdAt
    operations {
      type
      currencyId
      currencyBalance
      currencyAmount
    }
    reason {
      reason {
        ... on ReasonReasonAdministrative {
          reason
        }

        ... on ReasonReasonStoreOrderPayment {
          sku
          orderId
          itemType
        }

        ... on ReasonReasonPurchaseWithInGameCurrency {
          sku
          orderId
          itemType
        }

        ... on ReasonReasonPurchaseWithPayment {
          sku
          orderId
          reference
          price {
            value
            currency
          }
        }

        ... on ReasonReasonProvision {
          seasonId
          rev
        }
      }
    }
  }
`;

const getTransactionType = (reason: UserWalletTransactionFragment['reason']) => {
  if (reason.reason?.__typename === 'ReasonReasonAdministrative') {
    return 'Administrative';
  }

  if (reason.reason?.__typename === 'ReasonReasonStoreOrderPayment') {
    return 'Store order payment';
  }

  if (reason.reason?.__typename === 'ReasonReasonPurchaseWithInGameCurrency') {
    return 'Purchase with in-game currency';
  }

  if (reason.reason?.__typename === 'ReasonReasonPurchaseWithPayment') {
    return 'Purchase with payment';
  }

  if (reason.reason?.__typename === 'ReasonReasonProvision') {
    return 'Provision';
  }

  return reason.reason?.__typename ?? 'Unknown';
};

const storeItemTypeMap: Record<StoreV2ItemType, string> = {
  [StoreV2ItemType.ItemTypeCurrencyPack]: 'Currency pack',
  [StoreV2ItemType.ItemTypePremiumCardBundle]: 'Premium card bundle',
  [StoreV2ItemType.ItemTypeStandardCardBundle]: 'Standard card bundle',
  [StoreV2ItemType.ItemTypeStreamerCard]: 'Streamer card',
  [StoreV2ItemType.ItemTypeGiftSubscription]: 'Gift subscription',
  [StoreV2ItemType.ItemTypeAvatarPart]: 'Avatar part',
  [StoreV2ItemType.ItemTypeUnspecified]: 'Unspecified',
};

const getDetails = (transaction: UserWalletTransactionFragment) => {
  if (transaction.reason.reason?.__typename === 'ReasonReasonAdministrative') {
    return (
      <div className={styles.details}>
        <span className={styles.detailsLabel}>reason</span>
        <span>{transaction.reason.reason.reason}</span>
      </div>
    );
  }

  if (
    transaction.reason.reason?.__typename === 'ReasonReasonStoreOrderPayment' ||
    transaction.reason.reason?.__typename === 'ReasonReasonPurchaseWithInGameCurrency'
  ) {
    return (
      <div className={styles.details}>
        <span className={styles.detailsLabel}>order id</span>
        <span>{transaction.reason.reason.orderId}</span>

        <span className={styles.detailsLabel}>SKU</span>
        <span>{transaction.reason.reason.sku}</span>

        <span className={styles.detailsLabel}>item type</span>
        <span>{storeItemTypeMap[transaction.reason.reason.itemType]}</span>
      </div>
    );
  }

  if (transaction.reason.reason?.__typename === 'ReasonReasonPurchaseWithPayment') {
    return (
      <div className={styles.details}>
        <span className={styles.detailsLabel}>order id</span>
        <span>{transaction.reason.reason.orderId}</span>

        <span className={styles.detailsLabel}>SKU</span>
        <span>{transaction.reason.reason.sku}</span>

        <span className={styles.detailsLabel}>reference</span>
        <span>{transaction.reason.reason.reference}</span>
      </div>
    );
  }

  if (transaction.reason.reason?.__typename === 'ReasonReasonProvision') {
    return (
      <div className={styles.details}>
        <span className={styles.detailsLabel}>season id</span>
        <span>{transaction.reason.reason.seasonId}</span>

        <span className={styles.detailsLabel}>rev</span>
        <span>{transaction.reason.reason.rev}</span>
      </div>
    );
  }
};

const getBalanceChange = (transaction: UserWalletTransactionFragment) => {
  return transaction.operations
    .map(
      (operation) =>
        `${operation.type === WalletOperationType.TypeSubtract ? '-' : '+'} ${
          operation.currencyAmount
        } ${CommonUtils.getWalletCurrencyIdName(
          CommonUtils.getWalletCurrencyId(operation.currencyId),
          operation.currencyAmount !== 1,
        )}`,
    )
    .join(', ');
};

const getCurrentBalance = (transaction: UserWalletTransactionFragment) => {
  return transaction.operations
    .map(
      (operation) =>
        `${operation.currencyBalance} ${CommonUtils.getWalletCurrencyIdName(
          CommonUtils.getWalletCurrencyId(operation.currencyId),
          operation.currencyAmount !== 1,
        )}`,
    )
    .join(', ');
};

export function UserWalletTransactions() {
  const { userId } = useParams();

  const dataTransform = (data: UserWallerTransactionsQuery): TableData =>
    data.walletTransactions?.transactions.map((transaction) =>
      (({ createdAt, reason }) => ({
        'date (UTC)': `${DateAndTimeUtils.getShortDate(createdAt, {
          showInUTC: true,
        })} ${DateAndTimeUtils.getTime(createdAt, { showInUTC: true })}`,
        transactionType: getTransactionType(reason),
        details: getDetails(transaction),
        balanceChange: getBalanceChange(transaction),
        newBalance: getCurrentBalance(transaction),
      }))(transaction),
    ) ?? [];

  const getPageInfo = (data: UserWallerTransactionsQuery) =>
    data.walletTransactions?.pageInfo ?? null;

  if (!userId) {
    return <ContentModulePage.Error />;
  }

  return (
    <PaginatedQueryTableModulePage<
      UserWallerTransactionsQuery,
      UserWallerTransactionsQueryVariables
    >
      caption="User wallet transactions"
      dataTransform={dataTransform}
      fetchPolicy="cache-and-network"
      getPageInfo={getPageInfo}
      hook={useUserWallerTransactionsQuery}
      minifyCells={['newBalance', 'date (UTC)', 'sku', 'reason', 'id']}
      variables={{ userId }}
    />
  );
}
