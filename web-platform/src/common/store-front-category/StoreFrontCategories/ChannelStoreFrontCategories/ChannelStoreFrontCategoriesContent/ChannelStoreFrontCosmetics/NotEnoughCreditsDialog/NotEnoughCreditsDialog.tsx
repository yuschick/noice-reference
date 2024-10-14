import { useMountEffect } from '@noice-com/common-react-core';
import { ConfirmDialog, useAnalytics, useConfirmDialog } from '@noice-com/common-ui';
import { AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction } from '@noice-com/schemas/analytics/analytics.pb';
import { useNavigate } from 'react-router';

import { CosmeticsPurchaseItem } from '../types';

import { Routes } from '@common/route';

interface Props {
  item: CosmeticsPurchaseItem;
  resetPurchaseFlow: () => void;
}

export function NotEnoughCreditsDialog({ item, resetPurchaseFlow }: Props) {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const dialog = useConfirmDialog({
    title: 'Not enough credits',
    description:
      "You don't have enough credits to complete this purchase. You can purchase more credits from the Noice Store.",
    onClose: () => resetPurchaseFlow(),
    onCancel: [
      () => {
        trackEvent({
          clientStoreAvatarCosmeticsPurchaseDialog: {
            action:
              AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_CANCEL,
            id: item.id,
            price: item.igcPrices?.[0].amount,
            name: item.name,
          },
        });
      },
      { label: 'Cancel' },
    ],
    onConfirm: [
      () => {
        trackEvent({
          clientStoreAvatarCosmeticsPurchaseDialog: {
            action:
              AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_GO_TO_STORE,
            id: item.id,
            price: item.igcPrices?.[0].amount,
            name: item.name,
          },
        });

        navigate(`${Routes.Store}#hard-currency`);
      },
      { label: 'Go to Store' },
    ],
    onOpen: () => {
      trackEvent({
        clientStoreAvatarCosmeticsPurchaseDialog: {
          action:
            AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY,
          id: item.id,
          price: item.igcPrices?.[0].amount,
          name: item.name,
        },
      });
    },
  });

  useMountEffect(() => {
    dialog.actions.open();
  });

  return <ConfirmDialog store={dialog} />;
}
