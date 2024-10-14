"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageMemo = exports.ChatMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const social_1 = require("@noice-com/social");
const utils_1 = require("@noice-com/utils");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const hi_1 = require("react-icons/hi");
const ChatMessage_module_css_1 = __importDefault(require("./ChatMessage.module.css"));
const ChatMessageAvatar_1 = require("./ChatMessageAvatar/ChatMessageAvatar");
const _chat_gen_1 = require("@chat-gen");
const _chat_hooks_1 = require("@chat-hooks");
const _chat_utils_1 = require("@chat-utils");
(0, client_1.gql) `
  query ChatMessageSenderProfile($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      ...ChatMessageSenderProfile
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }
`;
function ChatMessage({ className, channelId, chatMessage, ownPlayerName, isOwnMessage, onReplyButtonClick, }) {
    var _a, _b, _c, _d, _e;
    const [showMiniProfile, setShowMiniProfile] = (0, react_1.useState)(false);
    const { createdAt, senderId } = chatMessage;
    const message = (0, _chat_utils_1.getChatMessageText)(chatMessage);
    const attachments = ((_a = chatMessage.content.content) === null || _a === void 0 ? void 0 : _a.__typename) === 'ChatTextMessage'
        ? chatMessage.content.content.attachments
        : [];
    const [relativeTime, setRelativeTime] = (0, react_1.useState)(null);
    const wrapper = (0, react_1.useRef)(null);
    const { data } = (0, _chat_gen_1.useChatMessageSenderProfileQuery)({
        variables: {
            userId: senderId,
            channelId,
        },
        fetchPolicy: 'cache-first',
    });
    const senderPlayerName = (_c = (_b = data === null || data === void 0 ? void 0 : data.profile) === null || _b === void 0 ? void 0 : _b.userTag) !== null && _c !== void 0 ? _c : '';
    const loadingProfile = !data;
    const { messageNodes, mentionsMe } = (0, _chat_hooks_1.useChatEmojisAndMentions)({
        message,
        attachments,
        ownPlayerName,
        mentionClassName: ChatMessage_module_css_1.default.mention,
        emojiClassName: ChatMessage_module_css_1.default.emoji,
    });
    const replyButtonClick = () => {
        if (!onReplyButtonClick) {
            return;
        }
        onReplyButtonClick(senderPlayerName);
    };
    const onAvatarClickCallback = () => {
        if (isOwnMessage) {
            return;
        }
        setShowMiniProfile((prev) => !prev);
    };
    if (!(data === null || data === void 0 ? void 0 : data.profile)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)(ChatMessage_module_css_1.default.container, className, {
            [ChatMessage_module_css_1.default.mentionsMe]: mentionsMe,
        }), id: chatMessage.messageId, ref: wrapper, onMouseEnter: () => setRelativeTime(utils_1.DateAndTimeUtils.getRelativeTime(new Date(createdAt).getTime())), children: [(0, jsx_runtime_1.jsx)(ChatMessageAvatar_1.ChatMessageAvatar, { className: ChatMessage_module_css_1.default.avatar, isOwnMessage: !!isOwnMessage, loadingProfile: loadingProfile, miniProfileOpen: showMiniProfile, profile: data.profile, onAvatarClick: onAvatarClickCallback }), (0, jsx_runtime_1.jsxs)("div", { className: ChatMessage_module_css_1.default.textContainer, children: [loadingProfile ? ((0, jsx_runtime_1.jsx)(common_ui_1.LoadingSkeleton, { height: 14 })) : ((0, jsx_runtime_1.jsx)("div", { className: ChatMessage_module_css_1.default.playerName, children: isOwnMessage ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!!((_d = data === null || data === void 0 ? void 0 : data.profile) === null || _d === void 0 ? void 0 : _d.badges.length) && ((0, jsx_runtime_1.jsx)("div", { className: ChatMessage_module_css_1.default.badges, children: (0, social_1.sortBadges)(data.profile.badges).map((badge, index) => ((0, jsx_runtime_1.jsx)(social_1.UserBadge, { badge: badge, className: ChatMessage_module_css_1.default.badge }, index))) })), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: ChatMessage_module_css_1.default.messageUsername, style: {
                                        color: common_ui_1.CommonUtils.getUserIdColor(senderId),
                                    }, children: senderPlayerName }), (0, jsx_runtime_1.jsx)(common_ui_1.VisuallyHidden, { children: "I say" })] })) : (!loadingProfile && ((0, jsx_runtime_1.jsxs)("button", { "aria-expanded": showMiniProfile ? 'true' : 'false', "aria-haspopup": "dialog", className: (0, classnames_1.default)(ChatMessage_module_css_1.default.messageUsername, ChatMessage_module_css_1.default.isOtherPlayer), style: {
                                color: common_ui_1.CommonUtils.getUserIdColor(senderId),
                            }, type: "button", onClick: onAvatarClickCallback, children: [!!((_e = data === null || data === void 0 ? void 0 : data.profile) === null || _e === void 0 ? void 0 : _e.badges.length) && ((0, jsx_runtime_1.jsx)("div", { className: ChatMessage_module_css_1.default.badges, children: (0, social_1.sortBadges)(data.profile.badges).map((badge, index) => ((0, jsx_runtime_1.jsx)(social_1.UserBadge, { badge: badge, className: ChatMessage_module_css_1.default.badge }, index))) })), senderPlayerName] }))) })), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": true, children: ": " }), (0, jsx_runtime_1.jsxs)("span", { className: ChatMessage_module_css_1.default.messageContent, children: [(0, jsx_runtime_1.jsxs)(common_ui_1.VisuallyHidden, { children: [senderPlayerName, " says"] }), (0, _chat_utils_1.isDeletedChatMessage)(chatMessage) ? ((0, jsx_runtime_1.jsx)("span", { className: ChatMessage_module_css_1.default.deletedMessage, children: message })) : (messageNodes)] }), (0, jsx_runtime_1.jsxs)("span", { className: ChatMessage_module_css_1.default.timestamp, children: [relativeTime, " ago"] })] }), !isOwnMessage && ((0, jsx_runtime_1.jsx)("div", { className: ChatMessage_module_css_1.default.replyButton, children: (0, jsx_runtime_1.jsx)(common_ui_1.IconButton, { icon: hi_1.HiReply, label: "Reply", size: "xs", variant: "cta", onClick: replyButtonClick }) })), (0, jsx_runtime_1.jsx)(social_1.MiniProfilePortal, { anchor: wrapper, channelId: channelId, className: ChatMessage_module_css_1.default.miniProfile, placement: "top", reportContext: (0, _chat_utils_1.isDeletedChatMessage)(chatMessage)
                    ? undefined
                    : {
                        chatId: chatMessage.chatId,
                        channelId,
                        messageId: chatMessage.messageId,
                    }, showMiniProfile: showMiniProfile, userId: senderId, onClose: () => setShowMiniProfile(false) })] }));
}
exports.ChatMessage = ChatMessage;
function chatPropsAreEqual(prevMessage, nextMessage) {
    // If message content changed (e.g. moderation)
    const prevMessageText = (0, _chat_utils_1.getChatMessageText)(prevMessage.chatMessage);
    const nextMessageText = (0, _chat_utils_1.getChatMessageText)(nextMessage.chatMessage);
    if (prevMessageText !== nextMessageText) {
        return false;
    }
    return true;
}
exports.ChatMessageMemo = (0, react_1.memo)(ChatMessage, chatPropsAreEqual);
//# sourceMappingURL=ChatMessage.js.map