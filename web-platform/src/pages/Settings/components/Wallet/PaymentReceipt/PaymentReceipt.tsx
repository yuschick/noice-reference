import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { ButtonLink, CommonUtils, Pill } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useNavigate, useParams } from 'react-router';

import { SettingsGroup } from '../../SettingsGroup';

import styles from './PaymentReceipt.module.css';
import { PaymentReceiptValue } from './PaymentReceiptValue/PaymentReceiptValue';

import { Routes, SettingsRoutes } from '@common/route';
import { PaymentPaymentStatus, usePaymentReceiptQuery } from '@gen';

gql`
  query PaymentReceipt($paymentId: ID!) {
    payment(id: $paymentId) {
      id
      items {
        description
      }
      timestamp
      info {
        cardHolderName
        cardSummary
      }
      amount {
        currency
        value
      }
      tax {
        rate
        rateInBasisPoints
        amount {
          currency
          value
        }
      }
      status
    }
  }
`;

export function PaymentReceipt() {
  const navigate = useNavigate();
  const params = useParams();

  const { data } = usePaymentReceiptQuery({
    ...variablesOrSkip({ paymentId: params.paymentId }),
    onCompleted(data) {
      if (!data.payment) {
        navigate(`${Routes.Settings}/${SettingsRoutes.Wallet}`, { replace: true });
      }
    },
  });

  const payment = data?.payment;

  if (!payment) {
    return null;
  }

  const { items, amount, tax, status } = payment;

  const getTaxRate = () => {
    if (tax?.rateInBasisPoints) {
      return tax?.rateInBasisPoints / 100;
    }

    return tax?.rate;
  };

  return (
    <SettingsGroup title="Payment Receipt">
      <SettingsGroup.Action>
        <ButtonLink
          level="secondary"
          size="sm"
          to={`${Routes.Settings}/${SettingsRoutes.Wallet}`}
        >
          Back to Wallet
        </ButtonLink>
      </SettingsGroup.Action>

      <div className={styles.wrapper}>
        {status === PaymentPaymentStatus.PaymentStatusReversed && (
          <Pill
            color="gradient-green-teal"
            label="Refunded"
          />
        )}

        <PaymentReceiptValue label="Description">
          {items.map(({ description }) => description).join(',')}
        </PaymentReceiptValue>

        <PaymentReceiptValue label="Date">
          {!!payment.timestamp && DateAndTimeUtils.getShortDate(payment.timestamp)}
        </PaymentReceiptValue>

        <div className={styles.priceValues}>
          <PaymentReceiptValue label="Total price">
            {CommonUtils.getFormattedPriceWithCurrency({
              currency: amount.currency,
              price: amount.value,
            })}
          </PaymentReceiptValue>

          <PaymentReceiptValue label="Tax">
            {tax?.amount
              ? CommonUtils.getFormattedPriceWithCurrency({
                  currency: tax.amount?.currency,
                  price: tax.amount?.value,
                })
              : 0}{' '}
            ({getTaxRate() ?? 0} %)
          </PaymentReceiptValue>
        </div>

        <PaymentReceiptValue label="Card details">
          - {payment.info?.cardSummary}
        </PaymentReceiptValue>

        <PaymentReceiptValue label="Payment id">{payment.id}</PaymentReceiptValue>
      </div>
    </SettingsGroup>
  );
}
