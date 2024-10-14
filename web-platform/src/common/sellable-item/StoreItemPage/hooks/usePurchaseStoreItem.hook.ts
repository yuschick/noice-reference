import { gql } from '@apollo/client';
import {
  FTUEActionType,
  useConversionEvents,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { getNullableSellableItemIgcPrice } from '../../utils';

import { usePlaySound, AppSoundKeys } from '@common/sound';
import {
  PurchaseStoreItemSellableItemFragment,
  StoreV2InGameCurrencyPrice,
  StoreV2ItemType,
  usePurchaseStoreItemMutation,
} from '@gen';

interface HookResult {
  disablePurchaseButton: boolean;
  showSuccessState: boolean;
  showPurchaseError: boolean;
  onPurchaseClick(): Promise<void | Error>;
}

gql`
  mutation PurchaseStoreItem($itemId: ID!, $signature: String!, $currencyId: ID) {
    buyWithInGameCurrency(
      itemId: $itemId
      signature: $signature
      currencyId: $currencyId
    ) {
      orderId
    }
  }
`;

gql`
  fragment PurchaseStoreItemSellableItem on StoreV2SellableItem {
    id
    type
    signature
    igcPrices {
      currencyId
      default
    }
  }
`;

type StoreItemIgcPrice = Pick<StoreV2InGameCurrencyPrice, 'currencyId' | 'default'>;

const getPurchaseCurrencyId = (prices: StoreItemIgcPrice[]) => {
  const price = getNullableSellableItemIgcPrice<StoreItemIgcPrice>(prices);

  if (!price) {
    return undefined;
  }

  return price.currencyId;
};

export function usePurchaseStoreItem(
  sellableItem: Nullable<PurchaseStoreItemSellableItemFragment>,
): HookResult {
  const [playPurchaseStandardBundleSound] = usePlaySound(
    AppSoundKeys.ShopPurchaseStandardBundle,
  );
  const [playPurchasePremiumBundleSound] = usePlaySound(
    AppSoundKeys.ShopPurchasePremiumBundle,
  );
  const { sendCardPackPurchasedConversionEvent } = useConversionEvents();

  const [showPurchaseError, setShowPurchaseError] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);

  const triggerFTUEAction = useTriggerFTUEAction();

  const currencyId = getPurchaseCurrencyId(sellableItem?.igcPrices ?? []);

  const [buyItem, { loading: isPurchaseLoading }] = usePurchaseStoreItemMutation({
    onCompleted: () => {
      playPurchaseSound();

      if (
        sellableItem?.type === StoreV2ItemType.ItemTypePremiumCardBundle ||
        sellableItem?.type === StoreV2ItemType.ItemTypeStandardCardBundle
      ) {
        triggerFTUEAction(FTUEActionType.StoreBundlePurchased);
      }

      setShowSuccessState(true);
    },
    onError(_error, _clientOptions) {
      setShowPurchaseError(true);
    },
  });

  const playPurchaseSound = () => {
    if (sellableItem?.type === StoreV2ItemType.ItemTypeStandardCardBundle) {
      playPurchaseStandardBundleSound();
      return;
    }

    if (sellableItem?.type === StoreV2ItemType.ItemTypePremiumCardBundle) {
      playPurchasePremiumBundleSound();
      return;
    }
  };

  const onPurchaseClick = async () => {
    if (!sellableItem || !currencyId) {
      return;
    }

    setShowPurchaseError(false);

    const { id, signature } = sellableItem;

    buyItem({
      variables: {
        itemId: id,
        signature,
        currencyId,
      },
    });

    sendCardPackPurchasedConversionEvent({
      contentId: id,
      currencyId,
    });
  };

  return {
    disablePurchaseButton: isPurchaseLoading || !sellableItem || !currencyId,
    showSuccessState,
    showPurchaseError,
    onPurchaseClick,
  };
}
