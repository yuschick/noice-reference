import { gql } from '@apollo/client';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';

import {
  ContentModulePage,
  PaginatedQueryTableModulePage,
} from '@common/page-components';
import {
  UserWalletPaymentFragment,
  UserWalletPaymentsQuery,
  UserWalletPaymentsQueryVariables,
  useUserWalletPaymentsQuery,
} from '@gen';

gql`
  query UserWalletPayments($userId: ID!, $cursor: APICursorInput) {
    successfulPayments(userId: $userId, cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      payments {
        ...UserWalletPayment
      }
    }
  }

  fragment UserWalletPayment on PaymentPayment {
    id
    timestamp
    items {
      description
    }
    info {
      cardSummary
    }
    amount {
      currency
      value
    }
    tax {
      amount {
        currency
        value
      }
      rate
    }
  }
`;

const getPrice = (amount: UserWalletPaymentFragment['amount']) => {
  return CommonUtils.getFormattedPriceWithCurrency({
    currency: amount.currency,
    price: amount.value,
  });
};

const getTax = (tax: UserWalletPaymentFragment['tax']) => {
  if (!tax.amount) {
    return;
  }

  return CommonUtils.getFormattedPriceWithCurrency({
    currency: tax.amount.currency,
    price: tax.amount.value,
  });
};

export function UserWalletPayments() {
  const { userId } = useParams();

  const dataTransform = (data: UserWalletPaymentsQuery) =>
    data.successfulPayments?.payments.map((payment) =>
      (({ id, timestamp, items, info, amount, tax }) => ({
        id,
        'date (UTC)': `${DateAndTimeUtils.getShortDate(timestamp, {
          showInUTC: true,
        })} ${DateAndTimeUtils.getTime(timestamp, { showInUTC: true })}`,
        description: items.map(({ description }) => description).join(','),
        totalPrice: getPrice(amount),
        tax: getTax(tax),
        cardDetails: `-${info.cardSummary}`,
      }))(payment),
    ) ?? [];

  const getPageInfo = (data: UserWalletPaymentsQuery) =>
    data.successfulPayments?.pageInfo ?? null;

  if (!userId) {
    return <ContentModulePage.Error />;
  }

  return (
    <PaginatedQueryTableModulePage<
      UserWalletPaymentsQuery,
      UserWalletPaymentsQueryVariables
    >
      caption="User wallet transactions"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useUserWalletPaymentsQuery}
      minifyCells={['id']}
      variables={{ userId }}
    />
  );
}
