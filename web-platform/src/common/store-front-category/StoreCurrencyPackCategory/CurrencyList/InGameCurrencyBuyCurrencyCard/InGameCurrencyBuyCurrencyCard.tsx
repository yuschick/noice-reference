import { gql } from '@apollo/client';
import { ConfirmDialog } from '@noice-com/common-ui';
import { AnalyticsEventClientInsufficientCreditsSource } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { useStoreFrontRefetch } from '../../../context';
import { CurrencyCard } from '../CurrencyCard/CurrencyCard';
import { InGameCurrencyBuyOverlay } from '../InGameCurrencyBuyOverlay/InGameCurrencyBuyOverlay';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { PurchaseStatus } from '@common/purchase';
import { getNullableSellableItemIgcPrice } from '@common/sellable-item';
import { useConditionalWalletCanNotAffordDialog } from '@common/wallet';
import {
  InGameCurrencyBuyCurrencyCardIgcPriceFragment,
  InGameCurrencyBuyCurrencyCardSellableItemFragment,
  useStoreBuyCurrencyBundleWithInGameCurrencyMutation,
} from '@gen';

gql`
  mutation StoreBuyCurrencyBundleWithInGameCurrency(
    $itemId: ID!
    $signature: String!
    $currencyId: ID!
  ) {
    buyWithInGameCurrency(
      itemId: $itemId
      signature: $signature
      currencyId: $currencyId
    ) {
      orderId
    }
  }
`;

interface Props {
  sellableItem: InGameCurrencyBuyCurrencyCardSellableItemFragment;
}

export function InGameCurrencyBuyCurrencyCard({ sellableItem }: Props) {
  const { refetchStoreFrontCategories } = useStoreFrontRefetch();

  const [showBuyOverlay, setShowBuyOverlay] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<Nullable<PurchaseStatus>>(null);

  const price = sellableItem.igcPrices
    ? getNullableSellableItemIgcPrice<InGameCurrencyBuyCurrencyCardIgcPriceFragment>(
        sellableItem.igcPrices,
      )
    : null;

  const [onPurchaseClick] = useStoreBuyCurrencyBundleWithInGameCurrencyMutation({
    variables: {
      itemId: sellableItem.id,
      signature: sellableItem.signature,
      currencyId: price?.currencyId ?? '',
    },
    onCompleted() {
      setPurchaseStatus(PurchaseStatus.Authorised);
      refetchStoreFrontCategories();
    },
    onError() {
      setPurchaseStatus(PurchaseStatus.Rejected);
    },
  });

  const onCardPurchaseClick = () => {
    setShowBuyOverlay(true);
    setPurchaseStatus(PurchaseStatus.Payment);
  };

  const onModalClose = () => {
    setShowBuyOverlay(false);
    setPurchaseStatus(null);
  };

  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.InGameCurrencyBundle,
  );
  const { dialogStore, onPurchaseClick: onPurchaseCardClick } =
    useConditionalWalletCanNotAffordDialog({
      currencyAmount: price?.amount ?? 0,
      currencyId: price?.currencyId ?? '',
      onCanAffordPurchase: onCardPurchaseClick,
      source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_STORE,
      skus: [sellableItem.sku],
    });

  return (
    <>
      <CurrencyCard
        sellableItem={sellableItem}
        onPurchaseClick={() => onAction(onPurchaseCardClick)}
      />

      {showBuyOverlay && (
        <InGameCurrencyBuyOverlay
          handleModalClose={onModalClose}
          sellableItem={sellableItem}
          status={purchaseStatus}
          onPurchaseClick={onPurchaseClick}
        />
      )}

      <ConfirmDialog store={dialogStore} />
    </>
  );
}

InGameCurrencyBuyCurrencyCard.fragments = {
  entry: gql`
    fragment InGameCurrencyBuyCurrencyCardSellableItem on StoreV2SellableItem {
      id
      signature
      ...CurrencyCardSellableItem
      ...InGameCurrencyBuyOverlaySellableItem
      igcPrices {
        ...InGameCurrencyBuyCurrencyCardIgcPrice
      }
      sku
    }

    fragment InGameCurrencyBuyCurrencyCardIgcPrice on StoreV2InGameCurrencyPrice {
      currencyId
      default
      amount
    }
  `,
};
