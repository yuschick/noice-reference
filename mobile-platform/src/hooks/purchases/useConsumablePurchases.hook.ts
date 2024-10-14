import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { CurrencyStoreSellableItemFragment, useSellableItemsQuery } from '@gen/graphql';
import { InAppPurchaseProduct, NoicePurchases } from '@native/NoicePurchasesModule';

gql`
  query SellableItems {
    sellableItems(filter: { platform: { categoryId: "currency-packs" } }) {
      items {
        ...CurrencyStoreSellableItem
      }
    }
  }

  fragment CurrencyStoreSellableItem on StoreV2SellableItem {
    id
    sku
    name
    type
    signature
    discountPercent
  }
`;

const platformSKUToNativeProductId = new Map<string, string>([
  ['currency-pack-1', 'CREDITS_350'],
  ['currency-pack-2', 'CREDITS_750'],
  ['currency-pack-3', 'CREDITS_1200'],
  ['currency-pack-4', 'CREDITS_2100'],
  ['currency-pack-5', 'CREDITS_3500'],
  ['currency-pack-6', 'CREDITS_6000'],
]);

export type ConsumableProduct = InAppPurchaseProduct & {
  platformProductId: string;
  platformProductSignature: string;
  platformDiscountPercent?: number;
  discountOriginalPrice?: string;
};

export const getDiscountProductId = (
  nativeProductId: string,
  discountPercentage: number,
) => `${nativeProductId}_DISCOUNT_${discountPercentage}`;

export const useConsumablePurchases = () => {
  const {
    data: availablePlatformProducts,
    refetch: refetchPlatformProducts,
    loading,
  } = useSellableItemsQuery();

  const nativeProductIdToPlatformProduct = useMemo(():
    | Record<string, CurrencyStoreSellableItemFragment>
    | undefined => {
    const platformProducts = availablePlatformProducts?.sellableItems?.items;
    if (!platformProducts?.length) {
      return;
    }

    const mappedIds: Record<string, CurrencyStoreSellableItemFragment> = {};

    for (const product of platformProducts) {
      const nativeProductId = platformSKUToNativeProductId.get(product.sku as string);
      if (!nativeProductId) {
        continue;
      }

      if (product.discountPercent > 0) {
        const id = getDiscountProductId(nativeProductId, product.discountPercent);
        mappedIds[id] = product;
      }

      // Non discounted version
      mappedIds[nativeProductId] = product;
    }

    return mappedIds;
  }, [availablePlatformProducts]);

  const { data: nativeStoreProducts, isLoading: isNativeProductsLoading } = useQuery({
    queryKey: ['hardCurrencyPurchases'],
    queryFn: () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return NoicePurchases.getProducts(Object.keys(nativeProductIdToPlatformProduct!));
    },
    enabled: !!nativeProductIdToPlatformProduct,
  });

  const consumableProducts = useMemo((): ConsumableProduct[] => {
    const platformProducts = availablePlatformProducts?.sellableItems?.items;
    if (!platformProducts || !nativeStoreProducts || !nativeProductIdToPlatformProduct) {
      return [];
    }

    const mappedProducts: ConsumableProduct[] = [];

    for (const nativeProduct of nativeStoreProducts) {
      if (nativeProduct.id.includes('DISCOUNT')) {
        // We skip discounted products and map them to the non discounted version
        continue;
      }

      const platformProduct = nativeProductIdToPlatformProduct[nativeProduct.id];

      if (!platformProduct) {
        continue;
      }

      const discountedProduductId = getDiscountProductId(
        nativeProduct.id,
        platformProduct.discountPercent,
      );
      const discountedPlatformProduct =
        nativeProductIdToPlatformProduct[discountedProduductId];

      if (discountedPlatformProduct) {
        const nativeDiscountedProduct = nativeStoreProducts.find(
          (p) => p.id === discountedProduductId,
        );

        if (!nativeDiscountedProduct) {
          continue;
        }

        mappedProducts.push({
          ...nativeDiscountedProduct,
          platformProductSignature: discountedPlatformProduct.signature,
          platformProductId: discountedPlatformProduct.id,
          platformDiscountPercent: discountedPlatformProduct.discountPercent,
          discountOriginalPrice: nativeProduct.displayPrice,
        });

        continue;
      }

      mappedProducts.push({
        ...nativeProduct,
        platformProductSignature: platformProduct.signature,
        platformProductId: platformProduct.id,
      });
    }

    return mappedProducts;
  }, [
    availablePlatformProducts?.sellableItems?.items,
    nativeStoreProducts,
    nativeProductIdToPlatformProduct,
  ]);

  return {
    refetchPlatformProducts,
    isLoadingProducts: loading || isNativeProductsLoading,
    consumableProducts,
  };
};
