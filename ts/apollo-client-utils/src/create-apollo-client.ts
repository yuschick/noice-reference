import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  DefaultOptions,
  InMemoryCacheConfig,
  split,
  from,
  FieldPolicy,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Client } from '@noice-com/platform-client';
import { DeepPartial, Nullable } from '@noice-com/utils';
import { createClient } from 'graphql-ws';

import {
  BadgeBadge,
  EmojiEmoji,
  ProfileProfile,
  QueryStreamSummaryArgs,
  QueryStreamSummaryBatchArgs,
} from '../gen';

import { getErrorLink } from './onError';
import {
  channelPagination,
  chatCache,
  channelBannedUsersPagination,
  profilePagination,
  channelPrivilegedUsersPagination,
  channelModerationSettingsCache,
  userChannelBansPagination,
  searchPagination,
  friendsPagination,
  subscriptionsPagination,
  channelEmojisPagination,
  channelSubscriptionsPagination,
  channelActivityFeedsPagination,
  followedChannelsPagination,
} from './paginations';
import { channelGameStatsPagination } from './paginations/channel-game-stats-pagination';

const getInMemoryCacheConfig = (
  preventInfinityPagination?: boolean,
): InMemoryCacheConfig => {
  let infinityPaginationQueryFields: Record<string, FieldPolicy> = {};

  if (!preventInfinityPagination) {
    infinityPaginationQueryFields = {
      channelActivityEvents: channelActivityFeedsPagination(),
      channels: channelPagination(),
      channelBannedUsers: channelBannedUsersPagination(),
      profiles: profilePagination(),
      channelPrivilegedUsers: channelPrivilegedUsersPagination(),
      userChannelBans: userChannelBansPagination(),
      search: searchPagination(),
      publicSearch: searchPagination(),
      friends: friendsPagination(),
      userChannelSubscriptions: subscriptionsPagination(),
      channelEmojis: channelEmojisPagination(),
      channelSubscriptions: channelSubscriptionsPagination(),
      followedChannels: followedChannelsPagination(),
      channelGameStats: channelGameStatsPagination(),
    };
  }

  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    typePolicies: {
      Query: {
        fields: {
          ...infinityPaginationQueryFields,
          chatMessages: chatCache(),
          channelModerationSettings: channelModerationSettingsCache(),
          booster: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'GameLogicBooster',
                id: args?.id,
              });
            },
          },
          channel: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'ChannelChannel',
                id: args?.id,
              });
            },
          },
          emoji: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'EmojiEmoji',
                id: args?.id,
              });
            },
          },
          game: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'GameGame',
                id: args?.id,
              });
            },
          },
          gameCards: {
            read(_existing, { args, toReference }) {
              return {
                cards: args?.cardIds?.map((cardId: string) => {
                  return toReference(
                    {
                      __typename: 'GameLogicCard',
                      id: cardId,
                    },
                    // If the card is not in the cache, add it to the cache
                    true,
                  );
                }),
              };
            },
          },
          payment: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'PaymentPayment',
                id: args?.id,
              });
            },
          },
          party: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'PartyParty',
                id: args?.partyId,
              });
            },
          },
          profile: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'ProfileProfile',
                userId: args?.userId,
              });
            },
          },
          profileBatch: {
            read(_existing, { args, toReference }) {
              return {
                profiles:
                  args?.userIds?.map((userId: string) => {
                    return toReference(
                      {
                        __typename: 'ProfileProfile',
                        userId: userId,
                      },
                      // If the profile is not in the cache, add it to the cache
                      true,
                    );
                  }) ?? [],
              };
            },
          },
          season: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'GameSeason',
                id: args?.id,
              });
            },
          },
          sellableItem: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'SellableItemSellableItem',
                id: args?.id,
              });
            },
          },
          stream: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'ChannelStream',
                streamId: args?.id,
              });
            },
          },
          streamerCard: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'GameLogicStreamerCard',
                id: args?.id,
              });
            },
          },
          streamSummary: {
            read(_existing, { args, toReference }) {
              return toReference({
                __typename: 'ChannelStreamSummary',
                streamId: (args as Nullable<QueryStreamSummaryArgs>)?.id,
              });
            },
          },
          streamSummaryBatch: {
            read(_existing, { args, toReference }) {
              return {
                summaries:
                  (args as Nullable<QueryStreamSummaryBatchArgs>)?.streamIds?.map(
                    (streamId: string) => {
                      return toReference(
                        {
                          __typename: 'ChannelStreamSummary',
                          streamId,
                        },
                        // If the stream summary is not in the cache, add it to the cache
                        true,
                      );
                    },
                  ) ?? [],
              };
            },
          },
        },
      },
      ProfileProfile: {
        keyFields: ['userId'],
        fields: {
          friendshipStatus: {
            merge: true,
          },
          badges: {
            merge(
              existing: Partial<BadgeBadge>[] = [],
              incoming: Partial<BadgeBadge>[] = [],
            ) {
              return [...existing, ...incoming].reduce<Partial<BadgeBadge>[]>(
                (acc, curr) => [
                  // Filter existing same type badge
                  ...acc.filter((item) => item?.type !== curr.type),
                  // Add new badge
                  curr,
                ],
                [],
              );
            },
          },
          usernameHistory: {
            merge(
              existing: DeepPartial<ProfileProfile['usernameHistory']>,
              incoming: DeepPartial<ProfileProfile['usernameHistory']>,
            ) {
              // If incoming and existing length is different, we want to trust the incoming data
              if (incoming?.length !== existing?.length) {
                return incoming;
              }

              // Otherwise we combine the objects of the arrays
              return existing?.map((item, index) => ({
                ...item,
                ...incoming?.[index],
              }));
            },
          },
          playedGames: {
            // Incoming data is the full list of played games, so we can just trust the latest
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      ChannelPrivilegedUser: {
        keyFields: ['userId'],
      },
      ProfileProfileAvatars: {
        merge: true,
      },
      PlayerStatsPlayerStats: {
        merge: true,
      },
      AuthAccount: {
        merge: true,
      },
      ProfileProfileSettings: {
        merge: true,
      },
      ProfilePrivacySettings: {
        merge: true,
      },
      GoalCardGoalCardSlotProgress: {
        merge: true,
      },
      ItemItem: {
        keyFields: (object: any) => {
          if (!object.details) {
            return `ItemItem:${object.id}`;
          }

          // Add detail's cache id to the ItemItem key, so they are not wrongly merged
          return `ItemItem:${object.id}|${object.details.__ref}`;
        },
        fields: {
          inventoryItem: {
            merge: true,
          },
        },
      },
      GameLogicCard: {
        keyFields: (object: any) => {
          if ((object.leveling?.progressToNextLevel ?? -1) < 0) {
            return `GameLogicCard:${object.id}`;
          }

          // Add progressToNextLevel to the GameLogicCard key, so they are not wrongly merged in store / collection views
          // when there is the future state and current state of the card
          return `GameLogicCard:${object.id}|${object.leveling.progressToNextLevel}`;
        },
        fields: {
          leveling: {
            merge: true,
          },
        },
      },
      GameLogicStreamerCard: {
        fields: {
          saleConfig: {
            merge: true,
          },
        },
      },
      StoreV2StreamerCardSaleConfig: {
        keyFields: ['cardId'],
      },
      ChannelBannedUser: {
        keyFields: ['userId', 'channelId'],
      },
      ModerationPlatformBanAppeal: {
        keyFields: ['banId'],
      },
      ModerationPlatformBan: {
        keyFields: ['banId'],
      },
      ChannelStreamBackendConfig: {
        fields: {
          mlConfig: {
            merge: true,
          },
          recConfig: {
            merge: true,
          },
          crConfig: {
            merge: true,
          },
        },
      },
      GameLogicPlayerJoinedMsg: {
        keyFields: ['userId'],
      },
      GameLogicPlayer: {
        keyFields: ['userId'],
      },
      StreamerChannelFollowed: {
        keyFields: ['userId'],
      },
      ChannelLiveStatusEvent: {
        keyFields: ['channelId', 'streamId'],
      },
      ChannelChannelStreamDetailEvent: {
        keyFields: ['channelId', 'streamId'],
      },
      PartyParty: {
        fields: {
          members: {
            // Incoming data is the full list of members, so we can just trust the latest
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      PartyPartyMember: {
        keyFields: ['userId'],
      },
      FriendsUser: {
        keyFields: ['userId'],
      },
      ChannelChannel: {
        fields: {
          channelFriends: {
            merge: true,
          },
        },
      },
      StoreV2CurrencyRef: {
        keyFields: false,
      },
      ChannelStream: {
        keyFields: ['streamId'],
      },
      SubscriptionChannelSubscriptionConfig: {
        keyFields: ['channelId'],
      },
      GameSeason: {
        fields: {
          cardBackgroundUrls: {
            // This field is coming from season configs and is very static data so we can just trust
            // the latest. Also note that `merge: true` didn't work with this field (console error
            // about not able to handle array) so that's why doing it like this.
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      StoreV2StoreFront: {
        keyFields: ['id', 'gameId'],
        fields: {
          categories: {
            // Incoming data is the full list of categories, so we can just trust the latest
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      StoreV2StoreFrontCategory: {
        keyFields: false,
      },
      ChannelRestreamingConfig: {
        keyFields: ['channelId'],
      },
      WaitlistWaitlistUser: {
        keyFields: ['userId'],
      },
      ProfileProfileAvatarConfig: {
        keyFields: ['modelId'],
      },
      EmojiEmoji: {
        fields: {
          image: {
            merge(existing?: EmojiEmoji['image'], incoming?: EmojiEmoji['image']) {
              // If there is no image coming from the server or it is empty string, we want to keep the existing one
              if (!incoming) {
                return existing;
              }

              return incoming;
            },
          },
        },
      },
      ProfilePlayedGame: {
        keyFields: ['id', 'userId'],
        fields: {
          progression: {
            merge: true,
          },
        },
      },
      ChatSenderInfo: {
        keyFields: ['userId'],
      },
      ChannelStreamSummary: {
        keyFields: ['streamId'],
      },
      GameLogicChallengeStatus: {
        keyFields: ['challengeId'],
      },
      ChannelGameStats: {
        keyFields: ['gameId'],
      },
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  };
};

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  },
};

interface Props {
  client: Client;
  httpLinkUrl: string;
  wsLinkUrl: string;
  preventInfinityPagination?: boolean;
  /**
   * Enables apollo dev tools in web clients.
   */
  enableApolloDevTools?: boolean;
  /**
   * Customize the retryWait functionality when client is trying to re-establish
   * the GraphQLWsLink connection.
   * @param retries
   * @returns
   */
  customLinkConnectionRetryWait?: (retries: number) => Promise<void>;
  onLogout?: () => void;

  // Apollo itself uses any, so yeah, that's why no better types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sha256: (...args: any[]) => Promise<string>;
}

export const createApolloClient = ({
  client,
  httpLinkUrl,
  wsLinkUrl,
  preventInfinityPagination,
  enableApolloDevTools,
  customLinkConnectionRetryWait,
  sha256,
}: Props) => {
  const httpLink = createHttpLink({
    uri: httpLinkUrl,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await client.getToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      async retryWait(retries) {
        if (customLinkConnectionRetryWait) {
          return await customLinkConnectionRetryWait(retries);
        }

        // Default behaviour increase timeout of each subsequent retry
        // retrying after 2, 4, 8, 16, 32, 64.... seconds
        const time = Math.min(Math.pow(2, retries), 64) * 100;

        return await new Promise((resolve) => setTimeout(resolve, time));
      },
      shouldRetry() {
        return true;
      },
      retryAttempts: Infinity,
      url: wsLinkUrl,
      connectionParams: async () => {
        const token = await client.getToken();

        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  );

  // Log any GraphQL errors or network error that occurred
  const errorLink = getErrorLink();

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const persistedQueriesLink = createPersistedQueryLink({
    sha256,
  });

  return new ApolloClient({
    link: persistedQueriesLink.concat(from([errorLink, splitLink])),
    cache: new InMemoryCache(getInMemoryCacheConfig(preventInfinityPagination)),
    defaultOptions,
    connectToDevTools: enableApolloDevTools,
  });
};
