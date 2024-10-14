import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';

import { Icon } from '../Icon';
import { Image } from '../Image';

import styles from './CurrencyIcon.module.css';

import { WalletCurrencyId } from '@common-types';
import { getWalletCurrencyIdName } from '@common-utils';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const getCurrencyImage = (type: WalletCurrencyId, size: IconSize) => {
  /* eslint-disable no-fallthrough */
  switch (type) {
    case WalletCurrencyId.SoftCurrency:
      switch (size) {
        case 'sm':
          return CoreAssets.Images.CoinSm;
        case 'md':
          return CoreAssets.Images.CoinMd;
        case 'lg':
          return CoreAssets.Images.CoinLg;
        case 'xl':
          return CoreAssets.Images.CoinXl;
      }

    case WalletCurrencyId.HardCurrency:
      switch (size) {
        case 'sm':
          return CoreAssets.Images.CreditSm;
        case 'md':
          return CoreAssets.Images.CreditMd;
        case 'lg':
          return CoreAssets.Images.CreditLg;
        case 'xl':
          return CoreAssets.Images.CreditXl;
      }

    case WalletCurrencyId.ReshuffleToken:
      switch (size) {
        case 'sm':
          return CoreAssets.Images.ReshuffleTokenSm;
        case 'md':
          return CoreAssets.Images.ReshuffleTokenMd;
        case 'lg':
          return CoreAssets.Images.ReshuffleTokenLg;
        case 'xl':
          return CoreAssets.Images.ReshuffleTokenXl;
      }
  }
  /* eslint-enable no-fallthrough */

  return CoreAssets.Images.ReshuffleTokenMd;
};

export interface Props {
  type: WalletCurrencyId;
  size?: IconSize;
  className?: string;
}

export function CurrencyIcon({ type, size = 'md', className }: Props) {
  if (type === WalletCurrencyId.ChannelCurrency) {
    return (
      <Icon
        className={classNames(styles.currencyIcon, styles[size], className)}
        icon={CoreAssets.Icons.ChannelCoin}
      />
    );
  }

  return (
    <Image
      alt={getWalletCurrencyIdName(type, false)}
      className={classNames(styles.currencyIcon, styles[size], className)}
      loadingType="none"
      src={getCurrencyImage(type, size)}
    />
  );
}
