"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloClient = void 0;
const client_1 = require("@apollo/client");
const context_1 = require("@apollo/client/link/context");
const subscriptions_1 = require("@apollo/client/link/subscriptions");
const utilities_1 = require("@apollo/client/utilities");
const graphql_ws_1 = require("graphql-ws");
const onError_1 = require("./onError");
const paginations_1 = require("./paginations");
const getInMemoryCacheConfig = (preventInfinityPagination) => {
    let infinityPaginationQueryFields = {};
    if (!preventInfinityPagination) {
        infinityPaginationQueryFields = {
            channels: (0, paginations_1.channelPagination)(),
            channelBannedUsers: (0, paginations_1.channelBannedUsersPagination)(),
            profiles: (0, paginations_1.profilePagination)(),
            channelPrivilegedUsers: (0, paginations_1.channelPrivilegedUsersPagination)(),
            userChannelBans: (0, paginations_1.userChannelBansPagination)(),
            search: (0, paginations_1.searchPagination)(),
            friends: (0, paginations_1.friendsPagination)(),
            userChannelSubscriptions: (0, paginations_1.subscriptionsPagination)(),
            channelEmojis: (0, paginations_1.channelEmojisPagination)(),
        };
    }
    return {
        /* eslint-disable @typescript-eslint/naming-convention */
        typePolicies: {
            Query: {
                fields: Object.assign(Object.assign({}, infinityPaginationQueryFields), { chatMessages: (0, paginations_1.chatCache)(), channelModerationSettings: (0, paginations_1.channelModerationSettingsCache)(), booster: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'GameLogicBooster',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, channel: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'ChannelChannel',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, emoji: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'EmojiEmoji',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, game: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'GameGame',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, payment: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'PaymentPayment',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, profile: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'ProfileProfile',
                                userId: args === null || args === void 0 ? void 0 : args.userId,
                            });
                        },
                    }, season: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'GameSeason',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, sellableItem: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'SellableItemSellableItem',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, stream: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'ChannelStream',
                                streamId: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    }, streamerCard: {
                        read(_existing, { args, toReference }) {
                            return toReference({
                                __typename: 'GameLogicStreamerCard',
                                id: args === null || args === void 0 ? void 0 : args.id,
                            });
                        },
                    } }),
            },
            ProfileProfile: {
                keyFields: ['userId'],
                fields: {
                    friendshipStatus: {
                        merge: true,
                    },
                    badges: {
                        merge(existing = [], incoming = []) {
                            return [...existing, ...incoming].reduce((acc, curr) => [
                                // Filter existing same type badge
                                ...acc.filter((item) => (item === null || item === void 0 ? void 0 : item.type) !== curr.type),
                                // Add new badge
                                curr,
                            ], []);
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
            GoalCardGoalCardSlotProgress: {
                merge: true,
            },
            ItemItem: {
                keyFields: (object) => {
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
                keyFields: (object) => {
                    var _a, _b;
                    if (((_b = (_a = object.leveling) === null || _a === void 0 ? void 0 : _a.progressToNextLevel) !== null && _b !== void 0 ? _b : -1) < 0) {
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
                        merge(existing, incoming) {
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
            },
        },
        /* eslint-enable @typescript-eslint/naming-convention */
    };
};
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
    },
};
const createApolloClient = ({ client, httpLinkUrl, wsLinkUrl, preventInfinityPagination, enableApolloDevTools, customLinkConnectionRetryWait, onLogout, }) => {
    const httpLink = (0, client_1.createHttpLink)({
        uri: httpLinkUrl,
    });
    const authLink = (0, context_1.setContext)((_, { headers }) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield client.getToken();
        return {
            headers: Object.assign(Object.assign({}, headers), { authorization: token ? `Bearer ${token}` : '' }),
        };
    }));
    const wsLink = new subscriptions_1.GraphQLWsLink((0, graphql_ws_1.createClient)({
        retryWait(retries) {
            return __awaiter(this, void 0, void 0, function* () {
                if (customLinkConnectionRetryWait) {
                    return yield customLinkConnectionRetryWait(retries);
                }
                // Default behaviour increase timeout of each subsequent retry
                // retrying after 2, 4, 8, 16, 32, 64.... seconds
                const time = Math.min(Math.pow(2, retries), 64) * 100;
                return yield new Promise((resolve) => setTimeout(resolve, time));
            });
        },
        shouldRetry() {
            return true;
        },
        retryAttempts: Infinity,
        url: wsLinkUrl,
        connectionParams: () => __awaiter(void 0, void 0, void 0, function* () {
            const token = yield client.getToken();
            return {
                authorization: token ? `Bearer ${token}` : '',
            };
        }),
    }));
    // Log any GraphQL errors or network error that occurred
    const errorLink = (0, onError_1.getErrorLink)(client, onLogout);
    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    const splitLink = (0, client_1.split)(({ query }) => {
        const definition = (0, utilities_1.getMainDefinition)(query);
        return (definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription');
    }, wsLink, authLink.concat(httpLink));
    return new client_1.ApolloClient({
        link: (0, client_1.from)([errorLink, splitLink]),
        cache: new client_1.InMemoryCache(getInMemoryCacheConfig(preventInfinityPagination)),
        defaultOptions,
        connectToDevTools: enableApolloDevTools,
    });
};
exports.createApolloClient = createApolloClient;
//# sourceMappingURL=create-apollo-client.js.map