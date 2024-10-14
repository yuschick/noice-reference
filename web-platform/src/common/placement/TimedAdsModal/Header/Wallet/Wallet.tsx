import classNames from 'classnames';

import styles from './Wallet.module.css';

import { UserWalletDisplay } from '@common/wallet';

interface Props {
  showUpdateAnimation: boolean;
}

export function Wallet({ showUpdateAnimation }: Props) {
  return (
    <div
      className={classNames(styles.wrapper, { [styles.changed]: showUpdateAnimation })}
    >
      <UserWalletDisplay />
    </div>
  );
}
