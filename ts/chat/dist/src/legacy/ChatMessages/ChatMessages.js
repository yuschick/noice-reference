"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessages = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const ChatMessages_module_css_1 = __importDefault(require("./ChatMessages.module.css"));
const ChatMessagesContent_1 = require("./ChatMessagesContent");
const _chat_context_1 = require("@chat-context");
const combineMessages = (messages, boosterRequests, moderationMessages) => {
    const chatMessages = messages.map((m) => ({
        id: m.messageId,
        time: new Date(m.createdAt),
        type: 'message',
        content: m,
    }));
    const boosters = boosterRequests.map((b) => ({
        id: b.id,
        time: b.time,
        type: 'booster',
        content: b,
    }));
    return (chatMessages
        .concat(boosters)
        .concat(moderationMessages)
        // sort combined messages in ascending order
        .sort((a, b) => a.time.getTime() - b.time.getTime()));
};
function ChatMessages({ me, loading: loadingProp, activeChannel, onReplyButtonClick, channelId, }) {
    const { moderationMessages, messages, loading: chatLoading, } = (0, _chat_context_1.useActiveChannelChat)(activeChannel);
    const { boosterRequests } = (0, _chat_context_1.useChatContext)();
    const loading = !!loadingProp || !!chatLoading;
    const combinedMessages = loading
        ? []
        : combineMessages(messages, boosterRequests, moderationMessages);
    const lastMessage = combinedMessages[combinedMessages.length - 1];
    return ((0, jsx_runtime_1.jsx)(common_ui_1.ChatWrapper, Object.assign({ className: ChatMessages_module_css_1.default.chatScrollContainer, latestMessage: lastMessage
            ? {
                messageId: lastMessage.id,
                sentByLocalPlayer: lastMessage.type === 'message'
                    ? lastMessage.content.senderId === (me === null || me === void 0 ? void 0 : me.userId)
                    : lastMessage.content.id === (me === null || me === void 0 ? void 0 : me.userId),
            }
            : null }, { children: (0, jsx_runtime_1.jsx)(ChatMessagesContent_1.ChatMessagesContent, { channelId: channelId, combinedMessages: combinedMessages, loading: loading, me: me, onReplyButtonClick: onReplyButtonClick }) })));
}
exports.ChatMessages = ChatMessages;
ChatMessages.fragments = {
    profile: (0, client_1.gql) `
    fragment LegacyChatMessagesProfile on ProfileProfile {
      userId
      displayName
      ...ProfileImageProfile
    }
  `,
};
//# sourceMappingURL=ChatMessages.js.map