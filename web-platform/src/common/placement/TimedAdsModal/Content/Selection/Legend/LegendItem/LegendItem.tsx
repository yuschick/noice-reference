import { CurrencyIcon, WalletCurrencyId } from '@noice-com/common-ui';

import styles from './LegendItem.module.css';

interface Props {
  currency: WalletCurrencyId;
  range: { min: number; max: number };
}

export function LegendItem({ currency, range }: Props) {
  const rangeText =
    range.min === range.max ? `${range.max}` : `${range.min}-${range.max}`;

  return (
    <div className={styles.wrapper}>
      <CurrencyIcon type={currency} />
      <div className={styles.details}>
        <span className={styles.rangeText}>{rangeText}</span>
      </div>
    </div>
  );
}
