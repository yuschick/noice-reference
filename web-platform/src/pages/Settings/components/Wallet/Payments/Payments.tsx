import { gql } from '@apollo/client';
import {
  ButtonLink,
  CommonUtils,
  Pill,
  VisuallyHidden,
  useMediaQuery,
} from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { generatePath } from 'react-router-dom';

import { PAYMENT_RECEIPT_PATH } from '../../../const';

import styles from './Payments.module.css';

import { PaymentPaymentStatus, WalletPaymentsPaymentFragment } from '@gen';

gql`
  fragment WalletPaymentsPayment on PaymentPayment {
    id
    timestamp
    status
    items {
      description
    }
  }
`;

interface Props {
  payments: WalletPaymentsPaymentFragment[];
}

export function Payments({ payments }: Props) {
  const showTable = useMediaQuery(`(min-width: ${CommonUtils.getRem(960)})`);

  if (!showTable) {
    return (
      <>
        <ul className={styles.paymentsList}>
          {payments.map((payment) => {
            return (
              <li
                className={styles.paymentItem}
                key={payment.id}
              >
                <div className={styles.detailsContainer}>
                  <time>{DateAndTimeUtils.getShortDate(payment.timestamp)}</time>

                  {payment.status === PaymentPaymentStatus.PaymentStatusReversed && (
                    <div className={styles.refundedPill}>
                      <Pill
                        color="gradient-green-teal"
                        label="Refunded"
                      />
                    </div>
                  )}

                  <div className={styles.detailtsContent}>
                    {payment.items.map((item) => (
                      <div
                        className={styles.itemTitle}
                        key={item.description}
                      >
                        {item.description}
                      </div>
                    ))}
                  </div>
                </div>

                <ButtonLink
                  level="secondary"
                  size="sm"
                  state={{ payment }}
                  to={generatePath(PAYMENT_RECEIPT_PATH, { paymentId: payment.id })}
                >
                  View Details{' '}
                  <VisuallyHidden>for transaction {payment.id}</VisuallyHidden>
                </ButtonLink>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <div className={styles.paymentsTableWrapper}>
      <table className={styles.paymentsTable}>
        <caption>
          <VisuallyHidden> Payments history</VisuallyHidden>
        </caption>
        <thead className={styles.paymentsTableHead}>
          <tr>
            <th className={styles.paymentsTableCell}>Description</th>
            <th className={styles.paymentsTableCell}>Date</th>
            <th>
              <VisuallyHidden>Details</VisuallyHidden>
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            return (
              <tr key={payment.id}>
                <td className={styles.paymentsTableCell}>
                  <div className={styles.descriptionCellContent}>
                    {payment.items.map((item) => (
                      <div key={item.description}>{item.description}</div>
                    ))}

                    {payment.status === PaymentPaymentStatus.PaymentStatusReversed && (
                      <Pill
                        color="gradient-green-teal"
                        label="Refunded"
                      />
                    )}
                  </div>
                </td>
                <td className={styles.paymentsTableCell}>
                  {DateAndTimeUtils.getShortDate(payment.timestamp)}
                </td>
                <td className={styles.paymentsTableCell}>
                  <ButtonLink
                    aria-label={`View receipt for transaction ${payment.id}`}
                    level="secondary"
                    size="sm"
                    state={{ payment }}
                    to={generatePath(PAYMENT_RECEIPT_PATH, { paymentId: payment.id })}
                  >
                    View Details
                  </ButtonLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
