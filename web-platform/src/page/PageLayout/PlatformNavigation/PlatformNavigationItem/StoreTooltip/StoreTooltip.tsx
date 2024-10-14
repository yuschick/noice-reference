import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  CurrencyIcon,
  HorizontalProgressBar,
  useWallet,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { useMemo } from 'react';

import styles from './StoreTooltip.module.css';

import { getSellableItemIgcPrice } from '@common/sellable-item';
import { useSelectedUIState } from '@context';
import {
  StoreTooltipSellableItemPriceFragment,
  StoreV2ItemType,
  useStoreTooltipStoreFrontQuery,
} from '@gen';

gql`
  query StoreTooltipStoreFront($gameId: ID!) {
    platformStoreFront(gameId: $gameId) {
      id
      gameId
      categories {
        id
        itemType
        sellableItems {
          id
          igcPrices {
            ...StoreTooltipSellableItemPrice
          }
          name
        }
      }
    }
  }

  fragment StoreTooltipSellableItemPrice on StoreV2InGameCurrencyPrice {
    currencyId
    default
    amount
  }
`;

interface Props {
  className?: string;
  inert?: string;
}

const currencyId = WalletCurrencyId.SoftCurrency;

export function StoreTooltip({ className, inert }: Props) {
  const { selectedGameId } = useSelectedUIState();
  const { wallet } = useWallet();

  const { data } = useStoreTooltipStoreFrontQuery({
    ...variablesOrSkip({ gameId: selectedGameId }),
  });

  const standardBundles = useMemo<{ name: string; price: number }[]>(() => {
    if (!data?.platformStoreFront?.categories) {
      return [];
    }

    return (
      data.platformStoreFront.categories
        // Filter to only standard bundles categories
        .filter(({ itemType }) => itemType === StoreV2ItemType.ItemTypeStandardCardBundle)
        // Flat to have only sellable items (== bundles)
        .flatMap((category) => category.sellableItems)
        // Map to have only name, price and currencyId
        .map(({ name, igcPrices }) => {
          const { amount, currencyId } =
            getSellableItemIgcPrice<StoreTooltipSellableItemPriceFragment>(
              igcPrices ?? [],
            );

          return {
            name,
            price: amount,
            currencyId,
          };
        })
        // Filter out the bunldes that are not in the currency we want
        .filter(({ currencyId: bundleCurrencyId }) => currencyId === bundleCurrencyId)
    );
  }, [data?.platformStoreFront]);

  const highestPurchaseableBundle = useMemo(() => {
    const bundles = [...standardBundles].sort((a, b) => b.price - a.price);

    return bundles.find(({ price }) => price <= wallet[currencyId]);
  }, [standardBundles, wallet]);

  const nextAvailableBundle = useMemo(() => {
    const bundles = [...standardBundles].sort((a, b) => a.price - b.price);

    return bundles.find(({ price }) => price > wallet[currencyId]);
  }, [standardBundles, wallet]);

  return (
    <div
      className={className}
      // @ts-ignore-next-line
      inert={inert}
    >
      <div className={styles.tooltipPart}>
        <span className={styles.tooltipTitle}>Store</span>
      </div>

      {highestPurchaseableBundle && (
        <div className={styles.tooltipPart}>
          <div>
            <span className={styles.labelTitle}>You can purchase a bundle!</span>
            <span className={styles.title}>{highestPurchaseableBundle.name}</span>
          </div>

          <div className={styles.currencyWrapper}>
            <CurrencyIcon type={currencyId} />
            <span>{highestPurchaseableBundle.price}</span>
          </div>
        </div>
      )}

      {!highestPurchaseableBundle && nextAvailableBundle && (
        <div className={styles.tooltipPart}>
          <div>
            <span className={styles.labelTitle}>Progress to next bundle</span>
            <span className={styles.title}>{nextAvailableBundle.name}</span>

            <span className={styles.progressText}>
              {wallet[currencyId]}/{nextAvailableBundle.price}
            </span>
            <HorizontalProgressBar
              className={styles.progressBar}
              max={nextAvailableBundle.price}
              progress={wallet[currencyId]}
              title={`Progress to ${nextAvailableBundle.name} bundle`}
            />
          </div>

          <div className={styles.currencyWrapper}>
            <CurrencyIcon type={currencyId} />
            <span>{nextAvailableBundle.price}</span>
          </div>
        </div>
      )}
    </div>
  );
}
