import { gql } from '@apollo/client';

import styles from './CurrencyList.module.css';
import { InGameCurrencyBuyCurrencyCard } from './InGameCurrencyBuyCurrencyCard/InGameCurrencyBuyCurrencyCard';
import { PaymentBuyCurrencyCard } from './PaymentBuyCurrencyCard/PaymentBuyCurrencyCard';

import { CurrencyListStoreFrontCategoryFragment } from '@gen';

interface Props {
  storeCategory: CurrencyListStoreFrontCategoryFragment;
}

export function CurrencyList({ storeCategory }: Props) {
  const { sellableItems } = storeCategory;

  return (
    <div className={styles.row}>
      {sellableItems.map((sellableItem) => {
        if (sellableItem.igcPrices?.length) {
          return (
            <InGameCurrencyBuyCurrencyCard
              key={sellableItem.id}
              sellableItem={sellableItem}
            />
          );
        }

        if (sellableItem.price) {
          return (
            <PaymentBuyCurrencyCard
              key={sellableItem.id}
              sellableItem={sellableItem}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

CurrencyList.fragments = {
  entry: gql`
    fragment CurrencyListStoreFrontCategory on StoreV2StoreFrontCategory {
      id
      sellableItems {
        ...InGameCurrencyBuyCurrencyCardSellableItem
        ...PaymentBuyCurrencyCardSellableItem
      }
    }
  `,
};
