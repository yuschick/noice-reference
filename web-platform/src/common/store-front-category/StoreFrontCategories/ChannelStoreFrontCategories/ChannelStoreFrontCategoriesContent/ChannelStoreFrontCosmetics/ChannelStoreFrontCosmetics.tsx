import {
  LoadingSkeleton,
  useAnalytics,
  useWallet,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { ChannelStoreFrontCosmeticItem } from './ChannelStoreFrontCosmeticItem';
import styles from './ChannelStoreFrontCosmetics.module.css';
import { CosmeticPurchaseDialog } from './CosmeticPurchaseDialog/CosmeticPurchaseDialog';
import { NotEnoughCreditsDialog } from './NotEnoughCreditsDialog/NotEnoughCreditsDialog';
import { PurchaseCompleteDialog } from './PurchaseCompleteDialog/PurchaseCompleteDialog';
import { CosmeticsPurchaseItem, PurchaseStage } from './types';

import { StoreSectionHeader } from '@common/store-front-category/StoreSectionHeader';
import {
  ChannelStoreFrontCategoriesCategoryFragment,
  ChannelStoreFrontChannelFragment,
  StoreV2ItemType,
} from '@gen';

interface Props {
  categories: ChannelStoreFrontCategoriesCategoryFragment[];
  channel: ChannelStoreFrontChannelFragment;
  headingLevel?: 'h2' | 'h3';
  refetchStoreFrontCategories: () => void;
}

export function ChannelStoreFrontCosmetics({
  categories = [],
  channel,
  headingLevel = 'h2',
  refetchStoreFrontCategories,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<Nullable<CosmeticsPurchaseItem>>(null);
  const [purchaseStage, setPurchaseStage] = useState<Nullable<PurchaseStage>>(null);
  const { currencies } = useWallet();

  const { trackEvent } = useAnalytics();
  const cosmetics = categories.find(
    (category) => category.itemType === StoreV2ItemType.ItemTypeAvatarPart,
  );

  const handleCosmeticsItemClick = useCallback((item: CosmeticsPurchaseItem) => {
    setSelectedItem(item);

    // if yes, proceed to the purchase flow with the selected item
    setPurchaseStage('confirm');
  }, []);

  const resetPurchaseFlow = useCallback(() => {
    setSelectedItem(null);
    setPurchaseStage(null);
  }, []);

  const progressPurchaseStage = useCallback(() => {
    if (!purchaseStage || !selectedItem) {
      return;
    }

    // Check if the person can afford the item
    const itemCurrencyId = selectedItem.igcPrices?.[0]?.currencyId as WalletCurrencyId;
    const userCurrencyAmount =
      currencies.find((currency) => currency.currencyId === itemCurrencyId)
        ?.currencyAmount ?? 0;
    const itemAmount = selectedItem.igcPrices?.[0]?.amount ?? 0;
    const canAffordToPurchase = userCurrencyAmount >= itemAmount;

    // If not, show the not enough credits dialog
    if (!canAffordToPurchase) {
      setPurchaseStage('not-enough-credits');
      return;
    }

    // If the stage if 'confirm', proceed to the 'complete' stage
    if (purchaseStage === 'confirm') {
      // Using settimeout to allow the user inventory time to update before refetching
      // We do this to avoid the user seeing the item they just purchased as available
      setTimeout(() => {
        refetchStoreFrontCategories();
      }, 250);
      setPurchaseStage('complete');
    }

    // If the stage is 'complete', close the dialogs
    if (purchaseStage === 'complete') {
      // Backup request in the event the timeout request fails to load the updated inventory
      // @todo: Sync this request with the inventory update event to ensure we only call it once after the purchased item lands in the user inventory
      refetchStoreFrontCategories();
      resetPurchaseFlow();
    }
  }, [
    currencies,
    purchaseStage,
    refetchStoreFrontCategories,
    resetPurchaseFlow,
    selectedItem,
  ]);

  useEffect(() => {
    if (cosmetics?.sellableItems.length) {
      trackEvent({
        clientStoreAvatarCosmeticsPurchaseDialog: {
          action:
            AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_COSMETICS_ARE_AVAILABLE,
        },
      });
    }
  }, [cosmetics?.sellableItems, trackEvent]);

  return (
    <>
      <StoreSectionHeader
        color="magenta-main"
        headingLevel={headingLevel}
        title="Creator Cosmetics"
      />

      <div
        className={styles.cosmeticsWrapper}
        id="creator-cosmetics"
      >
        {cosmetics?.sellableItems.map((item) => {
          return (
            <ChannelStoreFrontCosmeticItem
              channel={channel}
              handleCosmeticsItemClick={handleCosmeticsItemClick}
              item={item}
              key={item.id}
            />
          );
        })}
      </div>

      {selectedItem && (
        <>
          {purchaseStage === 'not-enough-credits' && (
            <NotEnoughCreditsDialog
              item={selectedItem}
              resetPurchaseFlow={resetPurchaseFlow}
            />
          )}

          {purchaseStage === 'confirm' && (
            <CosmeticPurchaseDialog
              channel={channel}
              item={selectedItem}
              progressPurchaseStage={progressPurchaseStage}
              resetPurchaseFlow={resetPurchaseFlow}
            />
          )}

          {purchaseStage === 'complete' && (
            <PurchaseCompleteDialog
              item={selectedItem}
              progressPurchaseStage={progressPurchaseStage}
            />
          )}
        </>
      )}
    </>
  );
}

ChannelStoreFrontCosmetics.Loading = () => {
  return (
    <div className={styles.cosmeticsWrapper}>
      {new Array(2).fill(null).map((_, idx) => (
        <LoadingSkeleton
          className={styles.skeleton}
          key={idx}
        />
      ))}
    </div>
  );
};
