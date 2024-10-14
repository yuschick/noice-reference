"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatChannelEvents = void 0;
const client_1 = require("@apollo/client");
const apollo_client_utils_1 = require("@noice-com/apollo-client-utils");
const common_ui_1 = require("@noice-com/common-ui");
const react_1 = require("react");
const _chat_gen_1 = require("@chat-gen");
(0, client_1.gql) `
  subscription ChatChannelEventsSubscription($channelId: ID!) {
    channelEventsSubscribe(channelId: $channelId) {
      channelId
      createdAt
      id

      content {
        content {
          ... on ChannelSubscriptionPurchase {
            userId
            tier
            user {
              badges(channel_id: $channelId) {
                ...MiniProfileBadge
              }
              userId
              userTag
              ...MiniProfile
            }
          }
        }

        content {
          ... on ChannelBundlePurchase {
            bundleName
            userId
            streamerCards {
              id
              channelId
              name
            }
            user {
              badges(channel_id: $channelId) {
                ...MiniProfileBadge
              }
              userId
              userTag
              ...MiniProfile
            }
          }
        }

        content {
          ... on ChannelStreamerCardPurchase {
            streamerCard {
              id
              name
              channelId
            }
            userId
            user {
              badges(channel_id: $channelId) {
                ...MiniProfileBadge
              }
              userId
              userTag
              ...MiniProfile
            }
          }
        }
      }
    }
  }
`;
function useChatChannelEvents({ channelId }) {
    const [spendingHighlightsEnabled] = (0, common_ui_1.useBooleanFeatureFlag)('enabledSpendingHighlights');
    const [channelEventMessages, setChannelEventMessages] = (0, react_1.useState)([]);
    (0, apollo_client_utils_1.useRestartingSubscription)(_chat_gen_1.ChatChannelEventsSubscriptionDocument, {
        variables: {
            channelId: channelId,
        },
        skip: !channelId || !spendingHighlightsEnabled,
        onData({ data }) {
            var _a, _b, _c, _d, _e;
            const content = (_a = data.data) === null || _a === void 0 ? void 0 : _a.channelEventsSubscribe;
            const event = (_c = (_b = data.data) === null || _b === void 0 ? void 0 : _b.channelEventsSubscribe) === null || _c === void 0 ? void 0 : _c.content.content;
            if (!(event === null || event === void 0 ? void 0 : event.__typename) || !content) {
                return;
            }
            if (event.__typename === 'ChannelSubscriptionPurchase') {
                const badge = (_e = (_d = event.user) === null || _d === void 0 ? void 0 : _d.badges) === null || _e === void 0 ? void 0 : _e.find((badge) => badge.type === _chat_gen_1.BadgeBadgeType.TypeChannelSubscriber);
                setChannelEventMessages((prev) => {
                    var _a, _b, _c, _d, _e;
                    return [
                        ...prev,
                        {
                            id: content.id,
                            channelId: content.channelId,
                            time: new Date(content.createdAt),
                            type: 'channel-event',
                            content: {
                                id: content.id,
                                type: 'subscription',
                                user: event.user
                                    ? Object.assign(Object.assign({}, event.user), { badge: Object.assign(Object.assign({}, (_a = event.user) === null || _a === void 0 ? void 0 : _a.badges), { level: (_b = badge === null || badge === void 0 ? void 0 : badge.level) !== null && _b !== void 0 ? _b : 1, type: (_c = badge === null || badge === void 0 ? void 0 : badge.type) !== null && _c !== void 0 ? _c : _chat_gen_1.BadgeBadgeType.TypeChannelSubscriber }), userTag: (_e = (_d = event.user) === null || _d === void 0 ? void 0 : _d.userTag) !== null && _e !== void 0 ? _e : 'Mysterious Stranger' }) : {},
                            },
                        },
                    ];
                });
                return;
            }
            if (event.__typename === 'ChannelBundlePurchase') {
                setChannelEventMessages((prev) => {
                    var _a, _b, _c;
                    return [
                        ...prev,
                        {
                            id: content.id,
                            channelId: content.channelId,
                            time: new Date(content.createdAt),
                            type: 'channel-event',
                            content: {
                                bundleName: event.bundleName,
                                creatorCardNames: (_a = event.streamerCards) === null || _a === void 0 ? void 0 : _a.map((card) => card.name),
                                id: content.id,
                                type: 'bundle',
                                user: event.user
                                    ? Object.assign(Object.assign({}, event.user), { userTag: (_c = (_b = event.user) === null || _b === void 0 ? void 0 : _b.userTag) !== null && _c !== void 0 ? _c : 'Mysterious Stranger' }) : {},
                            },
                        },
                    ];
                });
                return;
            }
            if (event.__typename === 'ChannelStreamerCardPurchase') {
                setChannelEventMessages((prev) => {
                    var _a, _b, _c;
                    return [
                        ...prev,
                        {
                            id: content.id,
                            channelId: content.channelId,
                            time: new Date(content.createdAt),
                            type: 'channel-event',
                            content: {
                                creatorCardName: (_a = event.streamerCard) === null || _a === void 0 ? void 0 : _a.name,
                                id: content.id,
                                type: 'creator-card',
                                user: event.user
                                    ? Object.assign(Object.assign({}, event.user), { userTag: (_c = (_b = event.user) === null || _b === void 0 ? void 0 : _b.userTag) !== null && _c !== void 0 ? _c : 'Mysterious Stranger' }) : {},
                            },
                        },
                    ];
                });
                return;
            }
            return;
        },
    });
    return {
        channelEventMessages,
    };
}
exports.useChatChannelEvents = useChatChannelEvents;
//# sourceMappingURL=useChatChannelEvents.hook.js.map