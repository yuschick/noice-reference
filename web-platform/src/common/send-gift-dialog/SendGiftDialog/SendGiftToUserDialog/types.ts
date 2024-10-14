import { GiftTarget } from '@noice-com/social';

import {
  SendGiftErrorStateBase,
  SendGiftOverviewStateBase,
  SendGiftOverviewStateBaseData,
  SendGiftPaymentStateBase,
  SendGiftPaymentStateBaseData,
} from '@common/send-gift-dialog/types';
import { SendGiftToUserDialogProfileFragment } from '@gen';

interface SendGiftToUserOverviewStateData extends SendGiftOverviewStateBaseData {
  profile: SendGiftToUserDialogProfileFragment;
}

interface SendGiftToUserPaymentStateData extends SendGiftPaymentStateBaseData {
  profile: SendGiftToUserDialogProfileFragment;
}

export type SendGiftToUserOverviewState = SendGiftOverviewStateBase<
  SendGiftToUserOverviewStateData,
  GiftTarget.User
>;

export type SendGiftToUserPaymentState = SendGiftPaymentStateBase<
  SendGiftToUserPaymentStateData,
  GiftTarget.User
>;

export type SendGiftToUserErrorState = SendGiftErrorStateBase;

export type SendGiftToUserDialogState =
  | SendGiftToUserOverviewState
  | SendGiftToUserPaymentState
  | SendGiftToUserErrorState;
