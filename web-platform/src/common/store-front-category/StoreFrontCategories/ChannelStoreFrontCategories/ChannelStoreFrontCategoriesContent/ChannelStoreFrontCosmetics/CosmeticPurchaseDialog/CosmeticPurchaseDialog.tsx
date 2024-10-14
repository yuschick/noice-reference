import { ChannelLiveStatus } from '@noice-com/apollo-client-utils/gen';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  ButtonLink,
  ChannelLogo,
  CommonUtils,
  CurrencyButton,
  Dialog,
  Image,
  useAnalytics,
  useDialog,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback, useEffect, useState } from 'react';
import { generatePath } from 'react-router';

import { CosmeticsPurchaseItem } from '../types';

import styles from './CosmeticPurchaseDialog.module.css';

import { Routes } from '@common/route';
import {
  AvatarAvatarPart,
  ChannelStoreFrontChannelFragment,
  StoreV2ItemRef,
  usePurchaseStoreItemMutation,
} from '@gen';

interface Props {
  channel: ChannelStoreFrontChannelFragment;
  progressPurchaseStage: () => void;
  item: CosmeticsPurchaseItem;
  resetPurchaseFlow: () => void;
}

export function CosmeticPurchaseDialog({
  channel,
  progressPurchaseStage,
  item,
  resetPurchaseFlow,
}: Props) {
  const store = useDialog({
    title: 'Confirm Purchase',
    onEscape: resetPurchaseFlow,
    options: {
      closeOnOutsideClick: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [buyItem] = usePurchaseStoreItemMutation();
  const { trackEvent } = useAnalytics();
  const avatarEditorPreviewUrl = generatePath(
    `${Routes.Avatar}?part_id=${item.sku.replace('avatar-part-', '')}`,
  );
  const imagePreviewUrl =
    ((item.content[0].value as StoreV2ItemRef).item?.details as AvatarAvatarPart)
      ?.previewImgUrl ?? '';

  const handlePreviewEvent = () => {
    trackEvent({
      clientStoreAvatarCosmeticsPurchaseDialog: {
        action:
          AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PREVIEW,
        price: item.igcPrices?.[0]?.amount ?? 0,
        id: item.id,
        name: item.name,
      },
    });
    resetPurchaseFlow();
  };

  const handlePurchase = useCallback(async () => {
    setIsLoading(true);

    try {
      await buyItem({
        variables: {
          itemId: item.id,
          signature: item.signature,
          currencyId: item.igcPrices?.[0]?.currencyId ?? WalletCurrencyId.HardCurrency,
        },
      });

      trackEvent({
        clientStoreAvatarCosmeticsPurchaseDialog: {
          action:
            AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE,
          price: item.igcPrices?.[0]?.amount ?? 0,
          id: item.id,
          name: item.name,
        },
      });
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
      progressPurchaseStage();
    }
  }, [buyItem, item, progressPurchaseStage, trackEvent]);

  useEffect(() => {
    if (!store.state.dialogIsOpen) {
      return;
    }

    trackEvent({
      clientStoreAvatarCosmeticsPurchaseDialog: {
        action:
          AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_DIALOG_SHOWN,
        price: item.igcPrices?.[0]?.amount ?? 0,
        id: item.id,
        name: item.name,
      },
    });
  }, [item, store.state.dialogIsOpen, trackEvent]);

  useMountEffect(() => {
    store.actions.open();
  });

  return (
    <Dialog store={store}>
      <Dialog.Close onClose={resetPurchaseFlow} />
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.purchaseDialogWrapper}>
          <div className={styles.itemPreviewWrapper}>
            <Image
              alt={item.name}
              className={styles.previewImage}
              loadingType="none"
              sizes={`${CommonUtils.getRem(150)}`}
              src={imagePreviewUrl}
            />
          </div>
          <div className={styles.purchaseInfoWrapper}>
            <div className={styles.creatorDetailsWrapper}>
              <ChannelLogo
                channel={{
                  ...channel,
                  liveStatus: ChannelLiveStatus.LiveStatusUnspecified,
                }}
              />
              <div>
                <span className={styles.detailsPrimary}>
                  {item.name.replace('Avatar Part', '')}
                </span>
                <div className={styles.detailsSecondary}>Creator Cosmetic</div>
              </div>
            </div>
            <p>
              Buy this cosmetic and show some love to{' '}
              <span className={styles.channelName}>{channel.name}</span>. You&apos;ll be
              the envy of chat.
            </p>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <ButtonLink
          level="secondary"
          theme="dark"
          to={avatarEditorPreviewUrl}
          onClick={handlePreviewEvent}
        >
          Preview Item
        </ButtonLink>
        <CurrencyButton
          currency={{
            type: 'in-game',
            currency: WalletCurrencyId.HardCurrency,
            value: item.igcPrices?.[0]?.amount ?? 0,
          }}
          isLoading={isLoading}
          onClick={handlePurchase}
        >
          Purchase Item
        </CurrencyButton>
      </Dialog.Actions>
    </Dialog>
  );
}
