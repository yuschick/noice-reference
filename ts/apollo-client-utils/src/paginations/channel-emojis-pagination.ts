import { FieldPolicy, Reference } from '@apollo/client';

import { EmojiListChannelEmojisResponse } from '../../gen';

type ExistingEmojiPagination =
  | (Omit<EmojiListChannelEmojisResponse, 'emojis'> & {
      emojis: Reference[];
    })
  | null;

type ResultEmojiPagination =
  | (Omit<EmojiListChannelEmojisResponse, 'emojis'> & {
      emojis: Reference[];
    })
  | null;

type EmojiFieldPolicy = FieldPolicy<
  ExistingEmojiPagination,
  ResultEmojiPagination,
  ResultEmojiPagination
>;

export function channelEmojisPagination(): EmojiFieldPolicy {
  return {
    keyArgs: ['channelId'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing ?? null;
      }

      const existingEmojiIds = new Set(
        existing?.emojis.map((emoji) => readField('id', emoji)),
      );

      const emojis = [
        ...(existing?.emojis ?? []),
        ...(incoming.emojis?.filter(
          (emoji) => !existingEmojiIds.has(readField('id', emoji)),
        ) ?? []),
      ];

      return {
        ...incoming,
        emojis,
      };
    },
  };
}
