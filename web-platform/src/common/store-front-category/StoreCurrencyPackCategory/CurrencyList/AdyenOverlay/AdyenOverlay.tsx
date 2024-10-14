import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  VisuallyHidden,
  CurrencyIcon,
  Icon,
  Button,
  useDialog,
  Dialog,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import styles from './AdyenOverlay.module.css';

import { getFormattedPricesWithCurrency } from '@common/currency';
import { AdyenPurchaseContent, PurchaseStatus } from '@common/purchase';
import {
  getSellableItemContent,
  getSellableItemContentText,
} from '@common/sellable-item';
import { AdyenOverlaySellableItemFragment, AdyenSession } from '@gen';

interface Props {
  sellableItem: AdyenOverlaySellableItemFragment;
  session: Nullable<AdyenSession>;
  orderId: Nullable<string>;
  onModalCloseOnCancel: () => void;
  onModalCloseOnComplete: () => void;
  onPaymentCompleted: () => void;
}

export function AdyenOverlay({
  onModalCloseOnCancel,
  onModalCloseOnComplete,
  onPaymentCompleted,
  sellableItem: sellableItemProp,
  session,
  orderId,
}: Props) {
  // We need to copy this, so when cache updates, the modal shows the purchased item, not the refreshed one
  const [sellableItem] = useState(sellableItemProp);
  const [paymentStage, setPaymentStage] = useState<PurchaseStatus>(
    PurchaseStatus.Payment,
  );

  const onClose = useCallback(() => {
    if (paymentStage === PurchaseStatus.Authorised) {
      onModalCloseOnComplete();
      return;
    }

    onModalCloseOnCancel();
  }, [onModalCloseOnCancel, onModalCloseOnComplete, paymentStage]);

  const dialog = useDialog({
    title: 'Complete Purchase',
    onClose,
    initialState: 'open',
  });

  if (!session || !orderId) {
    return null;
  }

  const { formattedPrice, formattedOriginalPrice } = getFormattedPricesWithCurrency(
    sellableItem.price,
  );
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
                {!!formattedOriginalPrice &&
                  formattedOriginalPrice !== formattedPrice && (
                    <span className={styles.originalPrice}>
                      <VisuallyHidden>Original price: </VisuallyHidden>
                      {formattedOriginalPrice}
                    </span>
                  )}

                <span>{formattedPrice}</span>
              </div>
            </li>
          </ul>

          <div className={styles.purchaseTotalWrapper}>
            <span>Total</span>
            <span>{formattedPrice}</span>
          </div>
        </section>

        {paymentStage === PurchaseStatus.Payment && (
          <>
            <hr className={styles.divider} />

            <AdyenPurchaseContent
              orderId={orderId}
              session={session}
              onPaymentCompleted={() => {
                setPaymentStage(PurchaseStatus.Authorised);
                onPaymentCompleted();
              }}
              onPaymentFailed={() => setPaymentStage(PurchaseStatus.Rejected)}
            />
          </>
        )}
      </Dialog.Content>

      {paymentStage !== PurchaseStatus.Payment && (
        <Dialog.Actions>
          {paymentStage === PurchaseStatus.Authorised && (
            <div className={styles.paymentResultContent}>
              <Icon
                color="green-main"
                icon={CoreAssets.Icons.CheckCircle}
                size={40}
              />
              <span>Payment successful!</span>
            </div>
          )}

          {paymentStage === PurchaseStatus.Rejected && (
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
              onClick={onModalCloseOnComplete}
            >
              Back to store
            </Button>
          </div>
        </Dialog.Actions>
      )}
    </Dialog>
  );
}

AdyenOverlay.fragments = {
  entry: gql`
    fragment AdyenOverlaySellableItem on StoreV2SellableItem {
      name
      price {
        currency
        amount
      }
      ...SellableItemContentText
    }
  `,
};
