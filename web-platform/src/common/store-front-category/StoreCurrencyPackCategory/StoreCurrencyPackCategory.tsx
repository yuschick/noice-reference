import { gql } from '@apollo/client';
import { CommonUtils, WalletCurrencyId } from '@noice-com/common-ui';
import { Optional } from '@noice-com/utils';

import { StoreSectionHeader } from '../StoreSectionHeader';

import { CurrencyList } from './CurrencyList';
import styles from './StoreCurrencyPackCategory.module.css';

import { StoreCurrencyPackCategoryFragment } from '@gen';

interface Props {
  currencyStoreCategory: StoreCurrencyPackCategoryFragment;
}

const getContentCurrencyType = (storeCategory: StoreCurrencyPackCategoryFragment) => {
  const currencyId = storeCategory.sellableItems
    .map((sellableItem) =>
      sellableItem.content.map(({ value }) =>
        value?.__typename === 'StoreV2CurrencyRef' ? value.id : null,
      ),
    )
    .flat()?.[0];

  return CommonUtils.getWalletCurrencyId(currencyId ?? undefined);
};

const currencyTypeColorMap: Record<WalletCurrencyId, Optional<string>> = {
  [WalletCurrencyId.ChannelCurrency]: undefined,
  [WalletCurrencyId.HardCurrency]: 'magenta-main',
  [WalletCurrencyId.SoftCurrency]: undefined,
  [WalletCurrencyId.ReshuffleToken]: 'teal-main',
};

export function StoreCurrencyPackCategory({ currencyStoreCategory }: Props) {
  const contentCurrencyType = getContentCurrencyType(currencyStoreCategory);

  return (
    <section className={styles.section}>
      <StoreSectionHeader
        color={
          contentCurrencyType ? currencyTypeColorMap[contentCurrencyType] : undefined
        }
        id={contentCurrencyType ?? undefined}
        title={CommonUtils.getWalletCurrencyIdName(contentCurrencyType)}
      />

      <div className={styles.content}>
        <CurrencyList storeCategory={currencyStoreCategory} />
      </div>
    </section>
  );
}

StoreCurrencyPackCategory.fragments = {
  entry: gql`
    fragment StoreCurrencyPackCategory on StoreV2StoreFrontCategory {
      itemType
      ...CurrencyListStoreFrontCategory
    }
  `,
};
