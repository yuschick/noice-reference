import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient, useMountEffect } from '@noice-com/common-react-core';
import {
  Callout,
  ChannelLogo,
  CommonUtils,
  CurrencyButton,
  Dialog,
  Image,
  useAnalytics,
  UseDialogResult,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useMemo, useState } from 'react';

import styles from './PurchaseDialog.module.css';

import { AvatarComposition, ExtendedAvatarPart } from '@common/avatar/types';
import { AppSoundKeys, usePlaySound } from '@common/sound';
import { useAvatarPartChannelQuery, usePurchaseStoreItemMutation } from '@gen';

gql`
  query AvatarPartChannel($channelId: ID) {
    channel(id: $channelId) {
      id
      name
      logo
      liveStatus
    }
  }
`;

export interface PurchaseDialogProps {
  dialogStore: UseDialogResult;
  composition: Nullable<AvatarComposition>;
  selectedItem: Nullable<ExtendedAvatarPart>;
  onItemsBought(): void;
  onReloadAvatarParts(): void;
}

export function PurchaseDialog({
  dialogStore,
  composition,
  onItemsBought,
  onReloadAvatarParts,
  selectedItem,
}: PurchaseDialogProps) {
  const [playPurchaseSound] = usePlaySound(AppSoundKeys.ShopPurchasePremiumBundle);
  const cli = useClient();
  const { trackEvent } = useAnalytics();

  const { data } = useAvatarPartChannelQuery({
    ...variablesOrSkip({ channelId: selectedItem?.channelId }),
  });

  const { compositionPrice, currencyID, compositionName, compositionId } = useMemo(() => {
    if (!composition) {
      return {
        compositionPrice: 0,
        currencyID: '',
        compositionName: '',
        compositionId: '',
      };
    }

    return Array.from(composition.values()).reduce(
      (acc, item) => {
        if (item.sellableItem?.igcPrices?.length) {
          return {
            compositionPrice:
              acc.compositionPrice + item.sellableItem.igcPrices[0].amount,
            currencyID: item.sellableItem.igcPrices[0].currencyId,
            compositionName: item.name || '',
            compositionId: item.id || item.sellableItem.id,
          };
        }

        return acc;
      },
      {
        compositionPrice: 0,
        currencyID: '',
        compositionName: '',
        compositionId: '',
      },
    );
  }, [composition]);

  const [buyItem] = usePurchaseStoreItemMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePurchase = useCallback(async () => {
    if (!composition) {
      dialogStore.actions.close();
      return;
    }

    setLoading(true);

    const itemsToCheck: string[] = [];
    let success = false;

    try {
      for (const item of composition.values()) {
        if (!item.sellableItem) {
          continue;
        }

        await buyItem({
          variables: {
            itemId: item.sellableItem.id,
            signature: item.sellableItem.signature,
            currencyId: currencyID,
          },
        });

        const content = item.sellableItem.content[0];
        if (content.value?.__typename === 'StoreV2ItemRef') {
          itemsToCheck.push(content.value.item.id);
        }
      }

      success = true;
    } catch (error) {
      setError(true);
    } finally {
      // TODO make this a proper event driven system
      // Lets check the items have been propagated into the user inventory
      // This is a bit of a busy wait but it should be fine for now
      // This logic should be replaced by a proper event driven system
      // This is done in finally so that we can make sure we check even if
      // Only part of the items were bought
      while (itemsToCheck.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        for (let i = itemsToCheck.length - 1; i >= 0; i--) {
          const itemId = itemsToCheck[i];
          const itemCount = await cli.UserInventoryService.getInventoryItem(itemId)
            .then(({ itemCount }) => itemCount || '0')
            .catch(() => '0');

          if (itemCount && parseInt(itemCount, 10) > 0) {
            itemsToCheck.splice(i, 1);
          }
        }
      }

      setLoading(false);

      if (success) {
        playPurchaseSound();
        dialogStore.actions.close();
        onItemsBought();

        trackEvent({
          clientAvatarCosmeticsPurchaseDialog: {
            action:
              AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE,
            id: compositionId,
            price: compositionPrice,
            name: compositionName,
          },
        });
      }

      onReloadAvatarParts();
    }
  }, [
    composition,
    dialogStore.actions,
    buyItem,
    currencyID,
    onReloadAvatarParts,
    cli.UserInventoryService,
    playPurchaseSound,
    onItemsBought,
    trackEvent,
    compositionId,
    compositionPrice,
    compositionName,
  ]);

  const dismiss = useCallback(() => {
    setError(false);

    trackEvent({
      clientAvatarCosmeticsPurchaseDialog: {
        action:
          AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_CANCEL,
        id: compositionId,
        price: compositionPrice,
        name: compositionName,
      },
    });
  }, [trackEvent, compositionId, compositionPrice, compositionName]);

  useMountEffect(() => {
    trackEvent({
      clientAvatarCosmeticsPurchaseDialog: {
        action:
          AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction.ACTION_DIALOG_SHOWN,
        id: compositionId,
        price: compositionPrice,
        name: compositionName,
      },
    });
  });

  if (!selectedItem || !data?.channel) {
    return null;
  }

  return (
    <Dialog store={dialogStore}>
      <Dialog.Header />
      <Dialog.Close onClose={dismiss} />
      <Dialog.Content>
        <section className={styles.contentWrapper}>
          <div className={styles.itemPreviewWrapper}>
            <Image
              alt={selectedItem.name}
              className={styles.partImage}
              loadingType="none"
              sizes={`${CommonUtils.getRem(150)}`}
              src={selectedItem.previewImgUrl}
            />
          </div>
          <div className={styles.purchaseInfoWrapper}>
            <div className={styles.creatorDetailsWrapper}>
              <ChannelLogo channel={data.channel} />
              <div>
                <span className={styles.detailsPrimary}>{selectedItem.name}</span>
                <span className={styles.detailsSecondary}>Creator Cosmetic</span>
              </div>
            </div>
            <p>
              Buy this cosmetic and show some love to{' '}
              <span className={styles.channelName}>{data.channel.name}</span>. You&apos;ll
              be the envy of chat.
            </p>
          </div>
        </section>

        {error && (
          <Callout
            message={
              <div className={styles.errorContainer}>
                <h2 className={styles.errorHeading}>Purchase Failed</h2>
                <p>
                  There was an error while trying to complete your purchase. Please try
                  again or return to the avatar editor.
                </p>
              </div>
            }
            slots={{
              actions: {
                primary: (
                  <button
                    className={styles.errorButton}
                    onClick={() => {
                      dismiss();
                      dialogStore.actions.close();
                    }}
                  >
                    Back to the editor
                  </button>
                ),
              },
            }}
            type="error"
          />
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <div className={styles.actionsWrapper}>
          <CurrencyButton
            currency={{
              type: 'in-game',
              currency: WalletCurrencyId.HardCurrency,
              value: compositionPrice,
            }}
            isDisabled={!!error}
            isLoading={loading}
            size="sm"
            onClick={handlePurchase}
          >
            Purchase & Save Avatar
          </CurrencyButton>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
