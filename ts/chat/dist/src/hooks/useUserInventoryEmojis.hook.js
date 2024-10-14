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
exports.useUserInventoryEmojis = void 0;
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const react_1 = require("react");
const _chat_gen_1 = require("@chat-gen");
(0, client_1.gql) `
  fragment UserInventoryEmojisEmoji on EmojiEmoji {
    id
    label
    image
    channelId
  }

  query UserInventoryEmojis($userId: ID) {
    inventory(userId: $userId, filters: { itemType: TYPE_EMOJI }) {
      items {
        itemId
        item {
          id
          details {
            ...UserInventoryEmojisEmoji
          }
        }
      }
    }
  }

  fragment UserInventoryEmojisChannel on ChannelChannel {
    id
    ...EmojiDrawerChannel
  }

  query UserInventoryEmojisChannels($channelIds: [String!]) {
    getChannels(channelIds: $channelIds) {
      channels {
        ...UserInventoryEmojisChannel
      }
    }
  }
`;
function useUserInventoryEmojis() {
    const { userId } = (0, common_ui_1.useAuthenticatedUser)();
    const client = (0, common_ui_1.useClient)();
    const [getChannels] = (0, _chat_gen_1.useUserInventoryEmojisChannelsLazyQuery)();
    const [hookResult, setHookResult] = (0, react_1.useState)({
        emojis: [],
        emojiList: {},
        emojisByChannel: [],
        noiceEmojis: { title: 'Noice', emojis: [] },
    });
    const { refetch: refetchEmojis } = (0, _chat_gen_1.useUserInventoryEmojisQuery)({
        variables: { userId },
        onCompleted: (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const channelIds = [];
            const emojiList = {};
            const emojis = [];
            const noiceEmojis = { title: 'Noice', emojis: [] };
            const emojisByChannelId = {};
            (_a = data.inventory) === null || _a === void 0 ? void 0 : _a.items.forEach((item) => {
                const emoji = item.item.details;
                if ((emoji === null || emoji === void 0 ? void 0 : emoji.__typename) !== 'EmojiEmoji') {
                    return;
                }
                const label = `:${emoji.label}:`;
                const emojiDef = {
                    itemId: emoji.id,
                    label,
                    source: emoji.image,
                };
                emojis.push(emojiDef);
                emojiList[label] = emojiDef;
                if (emoji.channelId && !channelIds.includes(emoji.channelId)) {
                    channelIds.push(emoji.channelId);
                }
                // Noice emojis' channelId is an empty string
                if (!emoji.channelId) {
                    noiceEmojis.emojis.push({ label, emoji: emojiDef });
                    return;
                }
                // We have channelId for the emote, add it to the
                // mapping based on channelId to be used later
                emojisByChannelId[emoji.channelId]
                    ? emojisByChannelId[emoji.channelId].push({ label, emoji: emojiDef })
                    : (emojisByChannelId[emoji.channelId] = [{ label, emoji: emojiDef }]);
            });
            const { data: channelsData } = yield getChannels({ variables: { channelIds } });
            const emojisByChannel = [];
            (_b = channelsData === null || channelsData === void 0 ? void 0 : channelsData.getChannels) === null || _b === void 0 ? void 0 : _b.channels.forEach((channel) => {
                const channelEmojis = emojisByChannelId[channel.id];
                if (!channelEmojis) {
                    return;
                }
                emojisByChannel.push({ channel, emojis: channelEmojis });
            });
            setHookResult({ emojis, emojiList, emojisByChannel, noiceEmojis });
        }),
    });
    (0, react_1.useEffect)(() => {
        return client.NotificationService.notifications({
            onInventoryUpdate: () => refetchEmojis(),
        });
    }, [client, refetchEmojis]);
    return hookResult;
}
exports.useUserInventoryEmojis = useUserInventoryEmojis;
//# sourceMappingURL=useUserInventoryEmojis.hook.js.map