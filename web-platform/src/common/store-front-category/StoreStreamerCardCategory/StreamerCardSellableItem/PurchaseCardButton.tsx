import { gql } from '@apollo/client';
import {
  ConfirmDialog,
  useAnalytics,
  useWallet,
  WalletCurrencyId,
  WithChildren,
} from '@noice-com/common-ui';
import {
  AnalyticsEventClientInsufficientCreditsSource,
  AnalyticsEventClientStoreItemClicked,
} from '@noice-com/schemas/analytics/analytics.pb';
import { forwardRef, useState } from 'react';

import { useStoreFrontRefetch } from '../../context';

import { StreamerCardPurchaseConfirmationDialog } from './StreamerCardPurchaseConfirmationDialog/StreamerCardPurchaseConfirmationDialog';
import { StreamerCardPurchaseSuccessModal } from './StreamerCardPurchaseSuccessModal/StreamerCardPurchaseSuccessModal';

import { storeV2ItemTypeToAnalyticsItemTypeMap } from '@common/analytics';
import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useConditionalWalletCanNotAffordDialog } from '@common/wallet';
import {
  StreamerCardPurchaseCardButtonPriceFragment,
  StreamerCardPurchaseCardButtonSellableItemFragment,
  StreamerCardPurchaseCardButtonStreamerCardFragment,
} from '@gen';

gql`
  fragment StreamerCardPurchaseCardButtonPrice on StoreV2InGameCurrencyPrice {
    amount
    currencyId
  }

  fragment StreamerCardPurchaseCardButtonSellableItem on StoreV2SellableItem {
    ...StreamerCardPurchaseDialogSellableItem
    sku
  }

  fragment StreamerCardPurchaseCardButtonStreamerCard on GameLogicStreamerCard {
    channelId
    gameId
    familyId
    ...StreamerCardPurchaseDialogStreamerCard
    ...StreamerCardPurchaseSuccessModalStreamerCard
  }
`;

interface Props {
  className: string;
  seasonName: string;
  gameName: string;
  price: StreamerCardPurchaseCardButtonPriceFragment;
  item: StreamerCardPurchaseCardButtonSellableItemFragment;
  card: StreamerCardPurchaseCardButtonStreamerCardFragment;
}

export const PurchaseCardButton = forwardRef<HTMLButtonElement, WithChildren<Props>>(
  ({ className, price, item, seasonName, gameName, card, children }, ref) => {
    const { trackEvent } = useAnalytics();
    const { refetchStoreFrontCategories } = useStoreFrontRefetch();
    const { currencies } = useWallet();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const currencyId = price.currencyId as WalletCurrencyId;

    const onDismiss = () => {
      setShowSuccessModal(false);
      refetchStoreFrontCategories();
    };

    const walletCurrencies = currencies.map((currency) => ({
      ...currency,
      currencyAmount: `${currency.currencyAmount}`,
    }));

    const analyticsCard: AnalyticsEventClientStoreItemClicked['card'] &
      Required<
        Pick<
          Required<AnalyticsEventClientStoreItemClicked>['card'],
          'id' | 'channelId' | 'gameId' | 'familyId'
        >
      > = {
      id: card.id,
      channelId: card.channelId,
      gameId: card.gameId,
      familyId: card.familyId,
    };

    const onCanAffordPurchase = () => {
      trackEvent({
        clientStoreItemClicked: {
          action: 'CreatorCardClicked',
          card: analyticsCard,
          cost: {
            currencyId: price?.currencyId ?? '',
            currencyAmount: `${price?.amount ?? 0}`,
          },
          wallet: walletCurrencies,
          itemType: storeV2ItemTypeToAnalyticsItemTypeMap.ITEM_TYPE_STREAMER_CARD,
        },
      });
      setShowConfirmationDialog(true);
    };

    const { onAction } = useImplicitAccountUpSellingAction(
      UpSellingDialogSource.CreatorCard,
    );
    const { onPurchaseClick, dialogStore } = useConditionalWalletCanNotAffordDialog({
      currencyAmount: price.amount,
      currencyId,
      onCanAffordPurchase,
      source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_STORE,
      skus: [item.sku],
    });

    const onPurchase = () => {
      trackEvent({
        clientStoreItemClicked: {
          action: 'CreatorCardPurchased',
          card: analyticsCard,
          cost: {
            currencyId: price?.currencyId ?? '',
            currencyAmount: `${price?.amount ?? 0}`,
          },
          wallet: walletCurrencies,
          itemType: storeV2ItemTypeToAnalyticsItemTypeMap.ITEM_TYPE_STREAMER_CARD,
        },
      });
      setShowSuccessModal(true);
    };

    return (
      <>
        <button
          className={className}
          ref={ref}
          onClick={() => onAction(onPurchaseClick)}
        >
          {children}
        </button>

        {showConfirmationDialog && (
          <StreamerCardPurchaseConfirmationDialog
            card={card}
            currencyAmount={price.amount}
            currencyId={currencyId}
            gameName={gameName}
            isOpen={showConfirmationDialog}
            item={item}
            seasonName={seasonName}
            onClose={() => setShowConfirmationDialog(false)}
            onPurchase={onPurchase}
          />
        )}

        {showSuccessModal && (
          <StreamerCardPurchaseSuccessModal
            card={card}
            gameName={gameName}
            seasonName={seasonName}
            onDismiss={onDismiss}
          />
        )}

        <ConfirmDialog store={dialogStore} />
      </>
    );
  },
);
