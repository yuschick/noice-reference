import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { useChannelContext } from '@common/channel';
import {
  useChannelEmojiMaxAmountQuery,
  useChannelEmojiSubscriptionStateQuery,
} from '@gen';

gql`
  query ChannelEmojiMaxAmount($channelId: ID!) {
    channelEmojis(channelId: $channelId, includeCount: true) {
      count {
        total
        disabled
      }
    }
  }

  query ChannelEmojiSubscriptionState($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscriptionConfig {
        channelId
        subscriptionsEnabled
      }
    }
  }
`;

interface Context {
  isMaxEmojiAmountReached: boolean;
  isLoadingMaxEmojiAmount: boolean;
  isChannelSubscriptionEnabled: boolean;
  isLoadingChannelSubscriptionState: boolean;
  refetchMaxAmount(): Promise<void>;
}

const ChannelEmojiContext = createContext<Nullable<Context>>(null);

export function ChannelEmojiProvider({ children }: WithChildren) {
  const { channelId } = useChannelContext();

  const [isMaxEmojiAmountReached, setIsMaxEmojiAmountReached] = useState(true);

  const { loading, refetch, previousData } = useChannelEmojiMaxAmountQuery({
    variables: {
      channelId,
    },
    onCompleted(data) {
      const totalCount = data.channelEmojis?.count?.total ?? 0;
      const disabledCount = data.channelEmojis?.count?.disabled ?? 0;

      const activeCount = totalCount - disabledCount;

      setIsMaxEmojiAmountReached(activeCount >= 32);
    },
  });

  const { data, loading: isLoadingChannelSubscriptionState } =
    useChannelEmojiSubscriptionStateQuery({
      variables: {
        channelId,
      },
    });

  const refetchMaxAmount = async () => {
    await refetch();
  };

  return (
    <ChannelEmojiContext.Provider
      value={{
        isMaxEmojiAmountReached,
        isLoadingMaxEmojiAmount: !previousData && loading,
        isChannelSubscriptionEnabled:
          !!data?.channel?.subscriptionConfig?.subscriptionsEnabled,
        isLoadingChannelSubscriptionState,
        refetchMaxAmount,
      }}
    >
      {children}
    </ChannelEmojiContext.Provider>
  );
}

export function useChannelEmoji() {
  const context = useContext(ChannelEmojiContext);

  if (!context) {
    throw new Error('Trying to access channel emoji max amount context without provider');
  }

  return context;
}
