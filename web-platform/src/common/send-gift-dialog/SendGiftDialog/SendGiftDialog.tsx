import { gql } from '@apollo/client';
import { Button, Dialog, useDialog } from '@noice-com/common-ui';
import { GiftTarget } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';

import { isReactNativeWebView } from '../../../embeds/bridge';
import {
  SendGiftToCommunityDialogState,
  SendGiftToCommunityOverviewState,
} from '../SendGiftDialog/SendGiftToCommunityDialog/types';
import {
  SendGiftToUserDialogState,
  SendGiftToUserOverviewState,
} from '../SendGiftDialog/SendGiftToUserDialog/types';

import { SendGiftDialogOverviewActions } from './common/SendGiftDialogOverviewActions/SendGiftDialogOverviewActions';
import { SendGiftDialogOverviewContent } from './common/SendGiftDialogOverviewContent/SendGiftDialogOverviewContent';
import { SendGiftDialogPaymentContent } from './common/SendGiftDialogPaymentContent/SendGiftDialogPaymentContent';
import { SendGiftToCommunityDialogOverviewContent } from './SendGiftToCommunityDialog/SendGiftToCommunityDialogOverviewContent/SendGiftToCommunityDialogOverviewContent';
import { SendGiftToUserDialogOverviewContent } from './SendGiftToUserDialog/SendGiftToUserDialogOverviewContent/SendGiftToUserDialogOverviewContent';

import { PurchaseStatus } from '@common/purchase';

interface PurchaseGiftForUserParams {
  target: GiftTarget.User;
  data: SendGiftToUserOverviewState['data'];
  giftAnonymously: boolean;
}

interface PurchaseGiftForCommunityParams {
  target: GiftTarget.Community;
  data: SendGiftToCommunityOverviewState['data'];
  giftAnonymously: boolean;
}

interface Props {
  state: Nullable<SendGiftToUserDialogState | SendGiftToCommunityDialogState>;
  store: ReturnType<typeof useDialog>;
  onPurchaseClick(
    params: PurchaseGiftForUserParams | PurchaseGiftForCommunityParams,
  ): void;
  onSelectItem(id: string): void;
}

gql`
  fragment SendGiftDialogOverviewContentSellableItem on StoreV2SellableItem {
    type
    content {
      value {
        ... on StoreV2SubscriptionRef {
          channelId
          amount
        }
      }
    }
    ...OverviewSubscriptionContentSellableItem
    ...OverviewCurrencyContentSellableItem
  }
`;

export function SendGiftDialog({ state, store, onPurchaseClick, onSelectItem }: Props) {
  const isEmbed = isReactNativeWebView();

  if (isEmbed) {
    return null;
  }

  const getDialogContent = () => {
    if (state?.state === 'overview') {
      switch (state.target) {
        case GiftTarget.User:
          return (
            <SendGiftDialogOverviewContent>
              <SendGiftToUserDialogOverviewContent data={state.data} />
            </SendGiftDialogOverviewContent>
          );
        case GiftTarget.Community:
          return (
            <SendGiftDialogOverviewContent>
              <SendGiftToCommunityDialogOverviewContent
                data={state.data}
                onSelectItem={onSelectItem}
              />
            </SendGiftDialogOverviewContent>
          );
      }
    }

    if (state?.state === 'payment') {
      switch (state.target) {
        case GiftTarget.User:
          return (
            <SendGiftDialogPaymentContent
              data={state.data}
              target={state.target}
            />
          );
        case GiftTarget.Community:
          return (
            <SendGiftDialogPaymentContent
              data={state.data}
              target={state.target}
            />
          );
      }
    }

    if (state?.state === 'error') {
      return <div>Something went wrong while gifting. Please try again later.</div>;
    }

    return null;
  };

  const getDialogActions = () => {
    if (state?.state === 'overview') {
      return (
        <Dialog.Actions>
          <SendGiftDialogOverviewActions
            data={state.data}
            onPurchaseClick={(giftAnonymously: boolean) =>
              onPurchaseClick(
                state.target === GiftTarget.Community
                  ? { data: state.data, giftAnonymously, target: state.target }
                  : { data: state.data, giftAnonymously, target: state.target },
              )
            }
          />
        </Dialog.Actions>
      );
    }

    if (
      state?.state === 'payment' &&
      state.data.purchaseStatus !== PurchaseStatus.Payment
    ) {
      return (
        <Dialog.Actions>
          <Button
            fit="content"
            theme="dark"
            onClick={store.actions.close}
          >
            Close
          </Button>
        </Dialog.Actions>
      );
    }

    if (state?.state === 'error') {
      return (
        <Dialog.Actions>
          <Button
            fit="content"
            theme="dark"
            onClick={store.actions.close}
          >
            Close
          </Button>
        </Dialog.Actions>
      );
    }

    return null;
  };

  return (
    <Dialog store={store}>
      <Dialog.Close />
      <Dialog.Header />
      <Dialog.Content>{getDialogContent()}</Dialog.Content>
      {getDialogActions()}
    </Dialog>
  );
}
