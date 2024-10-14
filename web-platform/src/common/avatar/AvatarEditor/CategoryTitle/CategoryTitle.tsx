import { Icon, SvgComponent } from '@noice-com/common-ui';

import styles from './CategoryTitle.module.css';

import { UserCurrency } from '@common/wallet/UserWalletDisplay/UserCurrency';
import { WalletWalletCurrency } from '@gen';

interface Props {
  icon?: SvgComponent;
  title: string;
  currency?: WalletWalletCurrency;
}

export function CategoryTitle({ icon, title, currency }: Props) {
  return (
    <div className={styles.titleRow}>
      <div className={styles.titleContainer}>
        {icon && (
          <Icon
            className={styles.icon}
            icon={icon}
          />
        )}
        <span className={styles.title}>{title}</span>
      </div>
      {currency && <UserCurrency currency={currency} />}
    </div>
  );
}
