import { WithChildren } from '@noice-com/common-ui';

import styles from './SendGiftDialogOverviewContent.module.css';

type Props = WithChildren;

export function SendGiftDialogOverviewContent({ children }: Props) {
  return (
    <div className={styles.overviewStateWrapper}>
      {children}

      <section className={styles.priceDisclaimer}>
        <p>
          The price is an estimate and may be adjusted based on your region.
          <br />
          Final price will be disclosed at checkout.
        </p>
      </section>
    </div>
  );
}
