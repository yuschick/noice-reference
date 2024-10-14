import { WalletCurrencyId, useWallet } from '@noice-com/common-ui';

import { UserCurrency } from './UserCurrency';
import styles from './UserWalletDisplay.module.css';

export function UserWalletDisplay() {
  const { currencies } = useWallet();

  const activeCurrencies = currencies
    .filter(({ currencyId }) => currencyId !== WalletCurrencyId.ChannelCurrency)
    .sort((a, z) => {
      if (a.currencyId === WalletCurrencyId.HardCurrency) {
        return -1;
      }

      if (z.currencyId === WalletCurrencyId.HardCurrency) {
        return 1;
      }

      if (a.currencyId === WalletCurrencyId.SoftCurrency) {
        return -1;
      }

      if (z.currencyId === WalletCurrencyId.SoftCurrency) {
        return 1;
      }

      return 0;
    });

  return (
    <div className={styles.currencyGroupWrapper}>
      {activeCurrencies.map((currency) => (
        <UserCurrency
          currency={currency}
          key={currency.currencyId}
        />
      ))}
    </div>
  );
}
