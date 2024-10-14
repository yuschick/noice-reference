import { FieldPolicy, Reference } from '@apollo/client';

import { ChannelListGameStatsResponse } from '../../gen';

type ExistingChannelGameStatsPagination =
  | (Omit<ChannelListGameStatsResponse, 'games'> & {
      games: Reference[];
    })
  | null;

type ResultChannelGameStatsPagination =
  | (Omit<ChannelListGameStatsResponse, 'games'> & {
      games: Reference[];
    })
  | null;

type ChannelGameStatsFieldPolicy = FieldPolicy<
  ExistingChannelGameStatsPagination,
  ResultChannelGameStatsPagination,
  ResultChannelGameStatsPagination
>;

export function channelGameStatsPagination(): ChannelGameStatsFieldPolicy {
  return {
    keyArgs: ['filters', '@connection'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField, storeFieldName }) {
      if (!incoming) {
        return existing ?? null;
      }

      // If there is connection argument for query, return incoming without any pagination handling
      if (storeFieldName.includes('@connection')) {
        return incoming;
      }

      const existingGameIds = new Set(
        existing?.games.map((game) => readField('gameId', game)),
      );

      const games = [
        ...(existing?.games ?? []),
        ...(incoming.games?.filter(
          (game) => !existingGameIds.has(readField('gameId', game)),
        ) ?? []),
      ];

      return {
        ...incoming,
        games,
      };
    },
  };
}
