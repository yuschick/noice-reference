import { gql } from '@apollo/client';
import {
  Callout,
  CommonUtils,
  ConfirmDialog,
  CurrencyButton,
  useMediaQuery,
} from '@noice-com/common-ui';
import { AnalyticsEventClientInsufficientCreditsSource } from '@noice-com/schemas/analytics/analytics.pb';

import { getSellableItemIgcPrice } from '../../utils';

import styles from './CardBundlePurchaseButtons.module.css';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useConditionalWalletCanNotAffordDialog } from '@common/wallet';
import { CardBundlePurchaseButtonCurrencyPriceFragment } from '@gen';

gql`
  fragment CardBundlePurchaseButtonCurrencyPrice on StoreV2InGameCurrencyPrice {
    currencyId
    amount
    default
  }
`;

interface Props {
  igcPrices: CardBundlePurchaseButtonCurrencyPriceFragment[];
  disablePurchaseButton: boolean;
  showPurchaseError: boolean;
  isPremiumBundle: boolean;
  sku: string;
  onPurchaseClick(): void;
  closeOnError(): void;
}

export function CardBundlePurchaseButtons({
  igcPrices,
  disablePurchaseButton,
  showPurchaseError,
  isPremiumBundle,
  sku,
  onPurchaseClick: onCanAffordPurchase,
  closeOnError,
}: Props) {
  const { currencyId, amount } =
    getSellableItemIgcPrice<CardBundlePurchaseButtonCurrencyPriceFragment>(
      igcPrices ?? [],
    );

  const { onAction } = useImplicitAccountUpSellingAction(
    isPremiumBundle
      ? UpSellingDialogSource.CreatorCardBundle
      : UpSellingDialogSource.CardBundle,
  );
  const { dialogStore, onPurchaseClick } = useConditionalWalletCanNotAffordDialog({
    currencyAmount: amount,
    currencyId,
    onCanAffordPurchase,
    skus: [sku],
    source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_STORE,
  });

  const currencyType = CommonUtils.getWalletCurrencyId(currencyId);
  const showLargeButton = useMediaQuery(`(min-width: ${CommonUtils.getRem(600)})`);

  return (
    <>
      {currencyType && (
        <CurrencyButton
          currency={{ type: 'in-game', currency: currencyType, value: amount }}
          data-ftue-anchor="store-bundle-modal-purchase-button"
          isDisabled={disablePurchaseButton}
          size={showLargeButton ? 'lg' : 'sm'}
          onClick={() => onAction(onPurchaseClick)}
        >
          Purchase card bundle
        </CurrencyButton>
      )}

      {showPurchaseError && (
        <Callout
          message={
            <div className={styles.errorContainer}>
              <h2 className={styles.errorHeading}>Purchase Failed</h2>
              <p>
                There was an error while trying to complete your purchase. Please try
                again or return to the store.
              </p>
            </div>
          }
          slots={{
            actions: {
              primary: (
                <button
                  className={styles.errorButton}
                  onClick={closeOnError}
                >
                  Back to store
                </button>
              ),
            },
          }}
          type="error"
        />
      )}

      <ConfirmDialog store={dialogStore} />
    </>
  );
}
