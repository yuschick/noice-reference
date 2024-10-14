import {
  CommonUtils,
  WalletCurrencyId,
  useAnalytics,
  useBooleanFeatureFlag,
  useConfirmDialog,
  useWallet,
} from '@noice-com/common-ui';
import { AnalyticsEventClientInsufficientCreditsSource } from '@noice-com/schemas/analytics/analytics.pb';
import { EnumUtils, Nullable } from '@noice-com/utils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { canWalletBuyItem } from '../utils';

import { BROWSE_CHANNELS_PATH, Routes } from '@common/route';

interface HookResult {
  dialogStore: ReturnType<typeof useConfirmDialog>;
  onPurchaseClick(): void;
}

interface Props {
  currencyId: string;
  currencyAmount: number;
  source: AnalyticsEventClientInsufficientCreditsSource;
  skus: string[];
  onCanAffordPurchase(): void;
}

const getDialogDescription = (
  walletCurrencyId: Nullable<WalletCurrencyId>,
  currencyName: string,
) => {
  if (
    walletCurrencyId === WalletCurrencyId.HardCurrency ||
    walletCurrencyId === WalletCurrencyId.ReshuffleToken
  ) {
    return `You don't have enough ${currencyName} to complete this purchase. You can purchase more ${currencyName} from the Noice Store.`;
  }

  if (walletCurrencyId === WalletCurrencyId.SoftCurrency) {
    return "You don't have enough coins to complete this purchase. Play the stream or watch ads to earn coins.";
  }
};

const getDialogActionLabel = (walletCurrencyId: Nullable<WalletCurrencyId>) => {
  if (
    walletCurrencyId === WalletCurrencyId.HardCurrency ||
    walletCurrencyId === WalletCurrencyId.ReshuffleToken
  ) {
    return 'Go to Store';
  }

  if (walletCurrencyId === WalletCurrencyId.SoftCurrency) {
    return 'Browse streams';
  }

  return 'Yes';
};

export function useConditionalWalletCanNotAffordDialog({
  currencyAmount,
  currencyId,
  onCanAffordPurchase,
  source,
  skus,
}: Props): HookResult {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [useNewBrowseLink] = useBooleanFeatureFlag('categoriesListing');

  const walletCurrencyId = CommonUtils.getWalletCurrencyId(currencyId);
  const currencyName = CommonUtils.getWalletCurrencyIdName(
    walletCurrencyId,
    true,
  ).toLowerCase();

  const onConfirm = () => {
    if (walletCurrencyId === WalletCurrencyId.HardCurrency) {
      navigate(`${Routes.Store}#hard-currency`);
      return;
    }

    if (walletCurrencyId === WalletCurrencyId.ReshuffleToken) {
      navigate(`${Routes.Store}#reshuffle-token`);
      return;
    }

    if (walletCurrencyId === WalletCurrencyId.SoftCurrency) {
      navigate(useNewBrowseLink ? BROWSE_CHANNELS_PATH : Routes.Browse);
      return;
    }
  };

  const { trackEvent } = useAnalytics();

  const onOpenAnalytics = useCallback(() => {
    const currencyKey = EnumUtils.getEnumKeyByEnumValue(WalletCurrencyId, currencyId);

    if (!currencyKey) {
      return;
    }

    const currencyType = WalletCurrencyId[currencyKey];
    const balance = wallet?.[currencyType] ?? 0;

    trackEvent({
      clientInsufficientCredits: {
        currencyId,
        cost: currencyAmount,
        balance,
        skus,
        source,
      },
    });
  }, [currencyAmount, currencyId, skus, source, trackEvent, wallet]);

  const dialogStore = useConfirmDialog({
    title: `Not enough ${currencyName}`,
    description: getDialogDescription(walletCurrencyId, currencyName),
    onConfirm: [onConfirm, { label: getDialogActionLabel(walletCurrencyId) }],
    onCancel: [() => {}, { label: 'Cancel' }],
    onOpen: onOpenAnalytics,
  });

  const canAffordToBuy = canWalletBuyItem(wallet, { currencyId, currencyAmount });

  const onPurchaseClick = () => {
    if (canAffordToBuy) {
      onCanAffordPurchase();
      return;
    }

    // Show dialog
    dialogStore.actions.open();
  };

  return { onPurchaseClick, dialogStore };
}
