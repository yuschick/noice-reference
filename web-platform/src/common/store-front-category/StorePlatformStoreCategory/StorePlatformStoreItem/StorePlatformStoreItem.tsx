import { ButtonLink, WalletCurrencyId } from '@noice-com/common-ui';
import { useSearchParams } from 'react-router-dom';

import CardBundleBgImage from '../../common/assets/CardBundleBg.webp';
import NoiceCreditsBgImage from '../../common/assets/NoiceCreditsCreatorCardsBg.webp';
import { CardItemBg } from '../../common/CardItemBg/CardItemBg';
import { PlatformStoreItemType } from '../../StorePlatformStoreCategory/StorePlatformStoreItem/common';
import { StorePlatformStoreItemAsset } from '../../StorePlatformStoreCategory/StorePlatformStoreItem/StorePlatformStoreItemAsset/StorePlatformStoreItemAsset';
import { StorePlatformStoreItemDescription } from '../../StorePlatformStoreCategory/StorePlatformStoreItem/StorePlatformStoreItemDescription/StorePlatformStoreItemDescription';
import { getCategorySearchParamString } from '../../utils';

import ReshuffleTokensPlatformItemImage from './assets/ReshuffleTokensPlatformItemBg.webp';
import styles from './StorePlatformStoreItem.module.css';
import { StorePlatformStoreItemTitle } from './StorePlatformStoreItemTitle/StorePlatformStoreItemTitle';

import { Routes } from '@common/route';

interface Props {
  type: PlatformStoreItemType;
}

export function StorePlatformStoreItem({ type }: Props) {
  const [searchParams] = useSearchParams();
  let bgImage = '';
  switch (type) {
    case 'standard-card-bundle':
      bgImage = CardBundleBgImage;
      break;
    case WalletCurrencyId.HardCurrency:
      bgImage = NoiceCreditsBgImage;
      break;
    case WalletCurrencyId.ReshuffleToken:
      bgImage = ReshuffleTokensPlatformItemImage;
      break;
  }

  return (
    <div className={styles.card}>
      <CardItemBg image={bgImage} />
      <div className={styles.content}>
        <div>
          <StorePlatformStoreItemTitle type={type} />
          <StorePlatformStoreItemDescription type={type} />
        </div>
        <div className={styles.button}>
          <ButtonLink
            level="secondary"
            size="sm"
            to={`${Routes.Store}?${getCategorySearchParamString(searchParams)}#${type}`}
          >
            View all bundles
          </ButtonLink>
        </div>
      </div>
      <StorePlatformStoreItemAsset type={type} />
    </div>
  );
}
