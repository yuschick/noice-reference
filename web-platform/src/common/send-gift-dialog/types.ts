import { GiftTarget } from '@noice-com/social';

import { PurchaseStatus } from '@common/purchase';
import { AdyenSession, SendGiftDialogSellableItemFragment } from '@gen';

export interface SendGiftOverviewStateBaseData {
  selectedSellableItem: SendGiftDialogSellableItemFragment;
}

export interface SendGiftPaymentStateBaseData {
  selectedSellableItem: SendGiftDialogSellableItemFragment;
  session: AdyenSession;
  orderId: string;
  purchaseStatus: PurchaseStatus;
  onPaymentFailed: () => void;
  onPaymentCompleted: () => void;
}

export interface SendGiftOverviewStateBase<
  T extends SendGiftOverviewStateBaseData,
  P extends GiftTarget,
> {
  state: 'overview';
  target: P;
  data: T;
}

export interface SendGiftPaymentStateBase<
  T extends SendGiftPaymentStateBaseData,
  P extends GiftTarget,
> {
  state: 'payment';
  target: P;
  data: T;
}

export interface SendGiftErrorStateBase {
  state: 'error';
}
