import { CoreAssets } from '@noice-com/assets-core';

import styles from './CurrencyAmounts.module.css';

export function CurrencyAmounts() {
  return (
    <div className={styles.currencyAmountsContainer}>
      <div className={styles.totalVoteAmountContainer}>
        <CoreAssets.Icons.ChannelCurrency />
        <span className={styles.totalAmountText}>9999</span>
      </div>
      <span className={styles.highestAmountText}>(999) Bob</span>
    </div>
  );
}
