import { WalletCurrencyId } from '@noice-com/common-ui';

import styles from './StorePlatformStoreCategory.module.css';
import { StorePlatformStoreItem } from './StorePlatformStoreItem/StorePlatformStoreItem';

export function StorePlatformStoreCategory() {
  return (
    <div className={styles.wrapper}>
      <StorePlatformStoreItem type={WalletCurrencyId.HardCurrency} />
      <StorePlatformStoreItem type={WalletCurrencyId.ReshuffleToken} />
      <StorePlatformStoreItem type="standard-card-bundle" />
    </div>
  );
}
