import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  CommonUtils,
  CurrencyButton,
  CurrencyIcon,
  Dialog,
  Icon,
  VisuallyHidden,
  useDialog,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import styles from './InGameCurrencyBuyOverlay.module.css';

import { PurchaseStatus } from '@common/purchase';
import {
  getSellableItemContent,
  getSellableItemContentText,
  getSellableItemIgcPrice,
} from '@common/sellable-item';
import {
  InGameCurrencyBuyOverlayItemPriceFragment,
  InGameCurrencyBuyOverlaySellableItemFragment,
} from '@gen';

interface Props {
  sellableItem: InGameCurrencyBuyOverlaySellableItemFragment;
  status: Nullable<PurchaseStatus>;
  handleModalClose(): void;
  onPurchaseClick(): void;
}

export function InGameCurrencyBuyOverlay({
  sellableItem: sellableItemProp,
  status,
  handleModalClose,
  onPurchaseClick,
}: Props) {
  const dialog = useDialog({
    title: 'Complete Purchase',
    onClose: handleModalClose,
    initialState: 'open',
  });

  // We need to copy this, so when cache updates, the modal shows the purchased item, not the refreshed one
  const [sellableItem] = useState(sellableItemProp);
  if (!status) {
    return null;
  }

  const { igcPrices } = sellableItem;
  const { currencyId, amount, amountWithoutDiscount } =
    getSellableItemIgcPrice<InGameCurrencyBuyOverlayItemPriceFragment>(igcPrices ?? []);
  const currencyType = CommonUtils.getWalletCurrencyId(currencyId);

  const { currencyType: contentCurrencyType } = getSellableItemContent(sellableItem);

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <section className={styles.itemsSummary}>
          <h2 className={styles.itemsSummaryTitle}>Purchase Summary</h2>

          <ul className={styles.itemsSummaryList}>
            <li className={styles.itemsSummaryItem}>
              {contentCurrencyType && (
                <CurrencyIcon
                  size="lg"
                  type={contentCurrencyType}
                />
              )}

              <span className={styles.itemName}>
                {getSellableItemContentText(sellableItem)}
              </span>

              <div className={styles.itemPrice}>
                {!!amountWithoutDiscount && amountWithoutDiscount !== amount && (
                  <span className={styles.originalPrice}>
                    <VisuallyHidden>Original price: </VisuallyHidden>
                    {amountWithoutDiscount}
                  </span>
                )}

                {currencyType && <CurrencyIcon type={currencyType} />}

                <span>{amount}</span>
              </div>
            </li>
          </ul>
        </section>
      </Dialog.Content>

      <Dialog.Actions>
        {status === PurchaseStatus.Payment ? (
          currencyType && (
            <div className={styles.purchaseButton}>
              <CurrencyButton
                currency={{ type: 'in-game', currency: currencyType, value: amount }}
                onClick={onPurchaseClick}
              >
                Purchase item
              </CurrencyButton>
            </div>
          )
        ) : (
          <>
            {status === PurchaseStatus.Authorised && (
              <div className={styles.paymentResultContent}>
                <Icon
                  color="green-main"
                  icon={CoreAssets.Icons.CheckCircle}
                  size={40}
                />
                <span>Payment successful!</span>
              </div>
            )}

            {status === PurchaseStatus.Rejected && (
              <div className={styles.paymentResultContent}>
                <Icon
                  color="status-error-main"
                  icon={CoreAssets.Icons.Exclamation}
                  size={40}
                />
                <span>Payment failed</span>
              </div>
            )}

            <div className={styles.backToStoreButton}>
              <Button
                level="primary"
                theme="dark"
                onClick={handleModalClose}
              >
                Back to store
              </Button>
            </div>
          </>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}

InGameCurrencyBuyOverlay.fragments = {
  entry: gql`
    fragment InGameCurrencyBuyOverlaySellableItem on StoreV2SellableItem {
      igcPrices {
        ...InGameCurrencyBuyOverlayItemPrice
      }
      ...SellableItemContentText
    }
  `,
  price: gql`
    fragment InGameCurrencyBuyOverlayItemPrice on StoreV2InGameCurrencyPrice {
      currencyId
      default
      amount
      amountWithoutDiscount
    }
  `,
};
