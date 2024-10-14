import { WithChildren } from '@noice-com/common-ui';

import styles from './PaymentReceiptValue.module.css';

interface Props {
  label: string;
}

export function PaymentReceiptValue({ children, label }: WithChildren<Props>) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
