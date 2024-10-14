import { GiftTarget } from '@noice-com/social';

import {
  SendGiftErrorStateBase,
  SendGiftOverviewStateBase,
  SendGiftOverviewStateBaseData,
  SendGiftPaymentStateBase,
  SendGiftPaymentStateBaseData,
} from '@common/send-gift-dialog/types';
import { SendGiftDialogSellableItemFragment } from '@gen';

interface SendGiftToCommunityOverviewStateData extends SendGiftOverviewStateBaseData {
  sellableItems: SendGiftDialogSellableItemFragment[];
}

type SendGiftToCommunityPaymentStateData = SendGiftPaymentStateBaseData;

export type SendGiftToCommunityOverviewState = SendGiftOverviewStateBase<
  SendGiftToCommunityOverviewStateData,
  GiftTarget.Community
>;

export type SendGiftToCommunityPaymentState = SendGiftPaymentStateBase<
  SendGiftToCommunityPaymentStateData,
  GiftTarget.Community
>;

export type SendGiftToCommunityErrorState = SendGiftErrorStateBase;

export type SendGiftToCommunityDialogState =
  | SendGiftToCommunityOverviewState
  | SendGiftToCommunityPaymentState
  | SendGiftToCommunityErrorState;
