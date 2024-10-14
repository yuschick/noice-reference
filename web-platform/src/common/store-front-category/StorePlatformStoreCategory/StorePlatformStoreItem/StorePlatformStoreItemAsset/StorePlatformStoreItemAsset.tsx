import { CoreAssets } from '@noice-com/assets-core';
import { Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import { CardAssetImage } from '../../../common/CardAssetImage/CardAssetImage';
import { PlatformStoreItemType } from '../common';

import styles from './StorePlatformStoreItemAsset.module.css';

import { StoreV2ItemType } from '@gen';

interface Props {
  type: PlatformStoreItemType;
}

export function StorePlatformStoreItemAsset({ type }: Props) {
  switch (type) {
    case 'reshuffle-token':
      return (
        <div className={classNames(styles.assetWrapper, styles.currencyWrapper)}>
          <Image
            alt="Reshuffle token"
            className={styles.currencyIcon}
            loadingType="none"
            src={CoreAssets.Images.ReshuffleTokenMd}
          />
        </div>
      );
    case 'hard-currency':
      return (
        <div className={classNames(styles.assetWrapper, styles.currencyWrapper)}>
          <Image
            alt="Credit"
            className={styles.currencyIcon}
            loadingType="none"
            src={CoreAssets.Images.CreditMd}
          />
        </div>
      );
    case 'standard-card-bundle':
      return (
        <CardAssetImage
          className={styles.assetWrapper}
          size="sm"
          type={StoreV2ItemType.ItemTypeStandardCardBundle}
        />
      );
  }
}
