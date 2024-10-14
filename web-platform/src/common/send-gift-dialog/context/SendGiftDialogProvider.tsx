import { gql } from '@apollo/client';
import { useConversionEvents, useDialog, WithChildren } from '@noice-com/common-ui';
import {
  GiftParams,
  GiftTarget,
  GiftToCommunityParams,
  GiftToUserParams,
  SendGiftButtonModel,
} from '@noice-com/social';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { SendGiftDialog } from '../SendGiftDialog/SendGiftDialog';
import { SendGiftToUserDialogState } from '../SendGiftDialog/SendGiftToUserDialog/types';

import { PurchaseStatus, useAdyenCancelOrderMutation } from '@common/purchase';
import { SendGiftToCommunityDialogState } from '@common/send-gift-dialog/SendGiftDialog/SendGiftToCommunityDialog/types';
import {
  AdyenSession,
  GiftableItemFragment,
  SendGiftToUserWithPaymentMutation,
  StoreV2ItemType,
  SubscriptionChannelSubscriptionState,
  useSendGiftGiftItemsLazyQuery,
  useSendGiftToCommunityWithPaymentMutation,
  useSendGiftToUserDialogDataLazyQuery,
  useSendGiftToUserIsTemporaryLazyQuery,
  useSendGiftToUserSubscriptionStateLazyQuery,
  useSendGiftToUserWithPaymentMutation,
} from '@gen';

gql`
  fragment SendGiftDialogSellableItem on StoreV2SellableItem {
    id
    signature
    ...SendGiftDialogOverviewContentSellableItem
    ...SendGiftDialogOverviewActionsSellableItem
    ...SendGiftToUserDialogPaymentSellableItem
  }

  fragment SendGiftToUserDialogProfile on ProfileProfile {
    userId
    ...SendGiftToUserProfile
  }

  fragment GiftableItem on StoreV2SellableItem {
    id
    content {
      value {
        ... on StoreV2SubscriptionRef {
          amount
        }
      }
    }
  }

  query SendGiftToUserDialogData($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      userTag
      ...SendGiftToUserDialogProfile
    }

    userChannelSubscription(userId: $userId, channelId: $channelId) {
      state
    }
  }

  query SendGiftGiftItems($channelId: ID!) {
    giftSellableItems(channelId: $channelId, itemType: ITEM_TYPE_GIFT_SUBSCRIPTION) {
      items {
        id
        ...GiftableItem
        ...SendGiftDialogSellableItem
      }
    }
  }

  query SendGiftToUserIsTemporary($userId: ID!) {
    profile(userId: $userId) {
      userId
      temporary
    }
  }

  query SendGiftToUserSubscriptionState($userId: ID!, $channelId: ID!) {
    userChannelSubscription(userId: $userId, channelId: $channelId) {
      state
    }
  }

  fragment GiftPaymentSession on StoreV2BuyWithPaymentResponse {
    orderId
    session {
      session {
        ... on AdyenSession {
          id
          reference
          returnUrl
          sessionData
          amount {
            value
            currency
          }
        }
      }
    }
  }

  mutation SendGiftToUserWithPayment(
    $itemId: ID!
    $signature: String!
    $giftedUserId: String!
    $giftAnonymously: Boolean!
  ) {
    buyWithPayment(
      itemId: $itemId
      signature: $signature
      giftOptions: { recipientIds: [$giftedUserId], giftAnonymously: $giftAnonymously }
    ) {
      ...GiftPaymentSession
    }
  }

  mutation SendGiftToCommunityWithPayment(
    $itemId: ID!
    $signature: String!
    $giftAnonymously: Boolean!
  ) {
    buyWithPayment(
      itemId: $itemId
      signature: $signature
      giftOptions: { giftAnonymously: $giftAnonymously }
    ) {
      ...GiftPaymentSession
    }
  }
`;

const getIndividualSubscriptionItems = (items: GiftableItemFragment[]) => {
  return items.filter(({ content }) =>
    content[0].value?.__typename === 'StoreV2SubscriptionRef'
      ? content[0].value.amount === 1
      : false,
  );
};

const getSubscriptionPackItems = (items: GiftableItemFragment[]) => {
  return items.filter(({ content }) =>
    content[0].value?.__typename === 'StoreV2SubscriptionRef'
      ? content[0].value.amount > 1
      : false,
  );
};

const userCanBeGiftedSubscriptionStates = [
  SubscriptionChannelSubscriptionState.StatePending,
  SubscriptionChannelSubscriptionState.StateUnspecified,
  SubscriptionChannelSubscriptionState.StateExpired,
];

interface Context {
  sendGiftButton?: SendGiftButtonModel;
}

const SendGiftDialogContext = createContext<Nullable<Context>>(null);

const { logError } = makeLoggers('SendGiftToUserDialogProvider');

const getModalTitle = (
  dialogState: Nullable<SendGiftToUserDialogState | SendGiftToCommunityDialogState>,
) => {
  if (
    dialogState?.state === 'overview' &&
    dialogState.data.selectedSellableItem.type ===
      StoreV2ItemType.ItemTypeGiftSubscription
  ) {
    if (dialogState.target === GiftTarget.User) {
      return 'Gift a subscription';
    }

    if (dialogState.target === GiftTarget.Community) {
      return 'Community Gift Subscription';
    }
  }

  if (dialogState?.state === 'payment') {
    if (dialogState.data.purchaseStatus === PurchaseStatus.Payment) {
      return 'Complete purchase';
    }

    if (dialogState.data.purchaseStatus === PurchaseStatus.Authorised) {
      return 'Purchase complete';
    }

    return 'Purchase failed';
  }

  return 'Give a gift';
};

export function SendGiftDialogProvider({ children }: WithChildren) {
  const { sendItemPurchasedConversionEvent } = useConversionEvents();

  const [dialogState, setDialogState] =
    useState<Nullable<SendGiftToUserDialogState | SendGiftToCommunityDialogState>>(null);

  const [fetchItems, { data: itemsData, refetch: refetchItemsData }] =
    useSendGiftGiftItemsLazyQuery();
  const [fetchIsTemporary] = useSendGiftToUserIsTemporaryLazyQuery();

  const [fetchDialogData] = useSendGiftToUserDialogDataLazyQuery();

  const [cancelOrder] = useAdyenCancelOrderMutation();

  const sendGiftDialogStore = useDialog({
    title: getModalTitle(dialogState),
    onClose() {
      setDialogState((prev) => {
        if (
          prev?.state === 'payment' &&
          prev.data.purchaseStatus !== PurchaseStatus.Authorised
        ) {
          cancelOrder({
            variables: {
              orderId: prev.data.orderId,
            },
          });
        }

        return null;
      });
    },
  });

  const onPaymentCompleted = () => {
    setDialogState((prev) => {
      if (!prev || prev.state !== 'payment') {
        return prev;
      }

      sendItemPurchasedConversionEvent({
        contentType: 'channel-subscription-gift',
        contentId: prev.data.selectedSellableItem.id,
        currency: prev.data.selectedSellableItem.price?.currency,
        value: prev.data.selectedSellableItem.price?.amount,
      });

      if (prev.target === GiftTarget.User) {
        return {
          ...prev,
          data: {
            ...prev.data,
            purchaseStatus: PurchaseStatus.Authorised,
          },
        };
      }

      if (prev.target === GiftTarget.Community) {
        return {
          ...prev,
          data: {
            ...prev.data,
            purchaseStatus: PurchaseStatus.Authorised,
          },
        };
      }

      return prev;
    });
  };

  const onPaymentFailed = () => {
    setDialogState((prev) => {
      if (prev?.state !== 'payment') {
        return prev;
      }

      if (prev.target === GiftTarget.User) {
        return {
          ...prev,
          data: {
            ...prev.data,
            purchaseStatus: PurchaseStatus.Rejected,
          },
        };
      }

      if (prev.target === GiftTarget.Community) {
        return {
          ...prev,
          data: {
            ...prev.data,
            purchaseStatus: PurchaseStatus.Rejected,
          },
        };
      }

      return prev;
    });
  };

  const getPaymentHandlers = (
    onCompleted: (orderId: string, session: AdyenSession) => void,
  ) => ({
    onCompleted(data: SendGiftToUserWithPaymentMutation) {
      // Refetch the store items after a successful purchase
      refetchItemsData();

      const session =
        data.buyWithPayment?.session.session?.__typename === 'AdyenSession'
          ? data.buyWithPayment?.session.session
          : null;
      const orderId = data.buyWithPayment?.orderId;

      if (!session || !orderId) {
        logError('Failed to get session data', { session, orderId });
        setDialogState({ state: 'error' });
        return;
      }

      onCompleted(orderId, session);
    },
    onError() {
      setDialogState({ state: 'error' });
    },
  });

  const [getSessionForGiftingToUser] = useSendGiftToUserWithPaymentMutation(
    getPaymentHandlers((orderId, session) =>
      setDialogState((prev) => {
        if (prev?.state !== 'overview' || prev.target !== GiftTarget.User) {
          logError('Invalid state', { state: prev?.state });
          return { state: 'error' };
        }

        return {
          state: 'payment',
          target: GiftTarget.User,
          data: {
            orderId,
            session: session,
            selectedSellableItem: prev.data.selectedSellableItem,
            purchaseStatus: PurchaseStatus.Payment,
            onPaymentCompleted,
            onPaymentFailed,
            profile: prev.data.profile,
          },
        };
      }),
    ),
  );
  const [getSessionForGiftingToCommunity] = useSendGiftToCommunityWithPaymentMutation(
    getPaymentHandlers((orderId, session) =>
      setDialogState((prev) => {
        if (prev?.state !== 'overview' || prev.target !== GiftTarget.Community) {
          logError('Invalid state', { state: prev?.state });
          return { state: 'error' };
        }

        return {
          state: 'payment',
          target: GiftTarget.Community,
          data: {
            orderId,
            session: session,
            selectedSellableItem: prev.data.selectedSellableItem,
            purchaseStatus: PurchaseStatus.Payment,
            onPaymentCompleted,
            onPaymentFailed,
          },
        };
      }),
    ),
  );

  const onSendGiftToUser = async (userId: string, channelId: string) => {
    const { data } = await fetchDialogData({
      variables: {
        userId,
        channelId,
      },
    });

    const profile = data?.profile;

    if (!profile) {
      logError('Profile not found', { userId });
      return;
    }

    const sellableItem = itemsData?.giftSellableItems?.items[0];

    if (!sellableItem) {
      return;
    }

    setDialogState({
      state: 'overview',
      target: GiftTarget.User,
      data: {
        selectedSellableItem: sellableItem,
        profile,
      },
    });

    sendGiftDialogStore.actions.open();
  };

  const onSendGiftToCommunity = async () => {
    const sellableItems = itemsData?.giftSellableItems?.items;
    if (!sellableItems?.length) {
      return;
    }

    // Only gifting to community supports multiple sellable items
    setDialogState({
      state: 'overview',
      target: GiftTarget.Community,
      data: {
        sellableItems,
        selectedSellableItem: sellableItems[0],
      },
    });

    sendGiftDialogStore.actions.open();
  };

  const onSendGift = (params: GiftParams) => {
    switch (params.target) {
      case GiftTarget.User:
        return onSendGiftToUser(params.userId, params.channelId);
      case GiftTarget.Community:
        return onSendGiftToCommunity();
      default:
        logError('Unable to identify gift target');
        return;
    }
  };

  const onPurchaseClick: React.ComponentProps<
    typeof SendGiftDialog
  >['onPurchaseClick'] = (params) => {
    switch (params.target) {
      case GiftTarget.Community:
        getSessionForGiftingToCommunity({
          variables: {
            itemId: params.data.selectedSellableItem.id,
            signature: params.data.selectedSellableItem.signature,
            giftAnonymously: params.giftAnonymously,
          },
        });
        return;
      case GiftTarget.User:
        getSessionForGiftingToUser({
          variables: {
            itemId: params.data.selectedSellableItem.id,
            signature: params.data.selectedSellableItem.signature,
            giftAnonymously: params.giftAnonymously,
            giftedUserId: params.data.profile.userId,
          },
        });
        return;
    }
  };

  const onSelectItem: React.ComponentProps<typeof SendGiftDialog>['onSelectItem'] = (
    itemId: string,
  ) => {
    setDialogState((prev) => {
      if (prev?.state !== 'overview') {
        logError('Invalid state', { state: prev?.state });
        return { state: 'error' };
      }

      if (prev.target === GiftTarget.Community) {
        const selectedSellableItem = prev.data.sellableItems.find(
          ({ id }) => itemId === id,
        );

        if (!selectedSellableItem) {
          logError('Selected sellable item not found', { state: prev?.state });
          return { state: 'error' };
        }

        return {
          ...prev,
          data: {
            ...prev.data,
            selectedSellableItem,
          },
        };
      }

      if (prev.target === GiftTarget.User) {
        logError('Selectable gifts are not supported', { state: prev?.state });
      }

      return prev;
    });
  };

  const [fetchSubscriptionState] = useSendGiftToUserSubscriptionStateLazyQuery();

  const shouldRenderGiftToUserButton = async (userId: string, channelId: string) => {
    const { data: userData } = await fetchIsTemporary({
      variables: { userId },
    });

    // Do not render gift button for temporary users
    if (userData?.profile?.temporary) {
      return false;
    }

    const { data: itemsData } = await fetchItems({
      variables: { channelId },
    });

    if (
      itemsData?.giftSellableItems?.items &&
      !getIndividualSubscriptionItems(itemsData.giftSellableItems.items).length
    ) {
      return false;
    }

    const { data } = await fetchSubscriptionState({
      variables: {
        userId,
        channelId,
      },
      fetchPolicy: 'network-only',
    });

    // If we are missing data, there is something funky going on, so we should not render the button
    if (!data?.userChannelSubscription?.state) {
      return false;
    }

    // If the state is ok, render button
    return userCanBeGiftedSubscriptionStates.includes(data.userChannelSubscription.state);
  };

  const shouldRenderGiftToCommunityButton = async (channelId: string) => {
    const { data: itemsData } = await fetchItems({
      variables: { channelId },
    });

    return (
      !!itemsData?.giftSellableItems?.items &&
      !!getSubscriptionPackItems(itemsData.giftSellableItems.items).length
    );
  };

  const shouldRenderGiftButton = async (
    params: GiftToUserParams | GiftToCommunityParams,
  ) => {
    switch (params.target) {
      case GiftTarget.User:
        return shouldRenderGiftToUserButton(params.userId, params.channelId);
      case GiftTarget.Community:
        return shouldRenderGiftToCommunityButton(params.channelId);
      default:
        logError('Unable to identify gift target');
        return false;
    }
  };

  return (
    <SendGiftDialogContext.Provider
      value={{
        sendGiftButton: {
          onClick: onSendGift,
          shouldButtonBeRendered: shouldRenderGiftButton,
        },
      }}
    >
      {children}

      <SendGiftDialog
        state={dialogState}
        store={sendGiftDialogStore}
        onPurchaseClick={onPurchaseClick}
        onSelectItem={onSelectItem}
      />
    </SendGiftDialogContext.Provider>
  );
}

function useSendGiftDialog() {
  const context = useContext(SendGiftDialogContext);

  if (!context) {
    throw new Error('useSendGiftDialog must be used within a SendGiftDialogProvider');
  }

  return context;
}

export function useSendGiftButton() {
  const { sendGiftButton } = useSendGiftDialog();

  return sendGiftButton;
}
