import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import {
  CommonUtils,
  CurrencyButton,
  Dialog,
  useDialog,
  useMediaQuery,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { useEffect } from 'react';

import { StreamerCardPurchaseDescription } from '../StreamerCardPurchaseDescription/StreamerCardPurchaseDescription';

import styles from './StreamerCardPurchaseConfirmationDialog.module.css';

import { usePurchaseStoreItem } from '@common/sellable-item/StoreItemPage/hooks/usePurchaseStoreItem.hook';
import {
  StreamerCardPurchaseDialogSellableItemFragment,
  StreamerCardPurchaseDialogStreamerCardFragment,
} from '@gen';

gql`
  fragment StreamerCardPurchaseDialogSellableItem on StoreV2SellableItem {
    ...PurchaseStoreItemSellableItem
  }

  fragment StreamerCardPurchaseDialogStreamerCard on GameLogicStreamerCard {
    channel {
      name
      ...StreamerCardPurchaseDescriptionChannel
    }
    baseCard {
      ...GameStreamerBaseCard
    }
    ...GameStreamerCard
  }
`;

interface Props {
  gameName: string;
  seasonName: string;
  item: StreamerCardPurchaseDialogSellableItemFragment;
  card: StreamerCardPurchaseDialogStreamerCardFragment;
  onPurchase: () => void;
  onClose: () => void;
  currencyId: WalletCurrencyId;
  currencyAmount: number;
  isOpen: boolean;
}

export function StreamerCardPurchaseConfirmationDialog({
  item,
  gameName,
  seasonName,
  card,
  onPurchase,
  onClose,
  currencyId,
  currencyAmount,
  isOpen,
}: Props) {
  const dialog = useDialog({
    title: 'Confirm purchase',
    onClose,
  });
  const {
    disablePurchaseButton,
    onPurchaseClick,
    showPurchaseError,
    showSuccessState: showPurchaseSuccessModal,
  } = usePurchaseStoreItem(item ?? null);

  useEffect(() => {
    if (showPurchaseSuccessModal && !showPurchaseError) {
      dialog.actions.close();
      onPurchase();
    }
  }, [dialog.actions, onPurchase, showPurchaseError, showPurchaseSuccessModal]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dialog.actions.open();
  }, [dialog.actions, isOpen]);

  const { baseCard, channel } = card;

  const showFullView = useMediaQuery(`(min-width: ${CommonUtils.getRem(600)})`);

  return (
    <Dialog store={dialog}>
      <Dialog.Close />
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.dialogContent}>
          <div className={styles.card}>
            <GameCard card={{ ...baseCard, activeStreamerCard: card }} />
          </div>

          <div className={styles.panel}>
            <StreamerCardPurchaseDescription channel={channel}>
              <p>
                This streamer card is usable during{' '}
                <span className={styles.bold}>{seasonName}</span> for{' '}
                <span className={styles.bold}>{gameName} creators</span>.
              </p>
              {!!channel?.name && (
                <p>
                  Purchasing this card directly supports{' '}
                  <span className={styles.bold}>{channel.name}</span>.
                </p>
              )}
              <div className={styles.secondaryInfo}>
                <p>
                  Creator cards are used in place of standard cards on {channel.name}
                  ’s streams and provide +10% points during gameplay.
                </p>
              </div>
              {showPurchaseError && (
                <div className={styles.error}>
                  Something went wrong. Try operation later.
                </div>
              )}
            </StreamerCardPurchaseDescription>
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <div className={styles.purchaseCardButtonWrapper}>
          <div className={styles.purchaseCardButton}>
            <CurrencyButton
              currency={{
                type: 'in-game',
                value: currencyAmount,
                currency: currencyId,
              }}
              isDisabled={disablePurchaseButton}
              size={showFullView ? 'md' : 'sm'}
              onClick={onPurchaseClick}
            >
              Purchase card
            </CurrencyButton>
          </div>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
