import { FieldPolicy } from '@apollo/client';

import { ChatListMessagesResponse } from '../../gen';

type ChatFieldPolicy = FieldPolicy<
  ChatListMessagesResponse,
  ChatListMessagesResponse,
  ChatListMessagesResponse
>;

export function chatCache(): ChatFieldPolicy {
  return {
    keyArgs: ['chatId'],
    read(existing) {
      return existing;
    },
    merge(_existing, incoming) {
      // All have been done in useChat hook
      return incoming;
    },
  };
}
