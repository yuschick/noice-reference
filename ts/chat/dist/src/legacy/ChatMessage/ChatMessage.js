"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageMemo = exports.ChatMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const social_1 = require("@noice-com/social");
const utils_1 = require("@noice-com/utils");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const hi_1 = require("react-icons/hi");
const ChatMessage_module_css_1 = __importDefault(require("./ChatMessage.module.css"));
function MentionComponent({ children }) {
    return (0, jsx_runtime_1.jsx)("span", Object.assign({ className: ChatMessage_module_css_1.default.mention }, { children: children }));
}
function ChatMessage({ channelId, chatMessage, ownPlayerName, isOwnMessage, onReplyButtonClick, }) {
    var _a;
    const [showMiniProfile, setShowMiniProfile] = (0, react_1.useState)(false);
    const { createdAt, senderId, sender: { displayName: senderPlayerName }, } = chatMessage;
    const message = common_ui_1.CommonUtils.getChatMessageText(chatMessage);
    const attachments = ((_a = chatMessage.content.content) === null || _a === void 0 ? void 0 : _a.__typename) === 'ChatTextMessage'
        ? chatMessage.content.content.attachments
        : [];
    const [relativeTime, setRelativeTime] = (0, react_1.useState)(null);
    const wrapper = (0, react_1.useRef)(null);
    const { messageNodes, mentionsMe } = (0, common_ui_1.useChatEmotesAndMentions)({
        message,
        attachments,
        ownPlayerName,
        MentionComponent,
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
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: (0, classnames_1.default)(ChatMessage_module_css_1.default.container, { [ChatMessage_module_css_1.default.mentionsMe]: mentionsMe }), ref: wrapper, onMouseEnter: () => setRelativeTime(utils_1.DateAndTimeUtils.getRelativeTime(new Date(createdAt).getTime())), onMouseLeave: () => setRelativeTime(null) }, { children: [(0, jsx_runtime_1.jsx)(common_ui_1.ProfileImage, { profile: chatMessage.sender, size: "sm" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: ChatMessage_module_css_1.default.textContainer }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: ChatMessage_module_css_1.default.playerName }, { children: [isOwnMessage ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ "aria-hidden": "true", className: ChatMessage_module_css_1.default.messageUsername, style: {
                                            color: common_ui_1.CommonUtils.getUserIdColor(senderId),
                                        } }, { children: senderPlayerName })), (0, jsx_runtime_1.jsx)(common_ui_1.VisuallyHidden, { children: "I say" })] })) : ((0, jsx_runtime_1.jsx)("button", Object.assign({ "aria-haspopup": "dialog", className: (0, classnames_1.default)(ChatMessage_module_css_1.default.messageUsername, ChatMessage_module_css_1.default.isOtherPlayer), style: {
                                    color: common_ui_1.CommonUtils.getUserIdColor(senderId),
                                }, type: "button", onClick: onAvatarClickCallback }, { children: senderPlayerName }))), ":", ' '] })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: ChatMessage_module_css_1.default.messageContent }, { children: [(0, jsx_runtime_1.jsxs)(common_ui_1.VisuallyHidden, { children: [senderPlayerName, " says"] }), common_ui_1.CommonUtils.isDeletedChatMessage(chatMessage) ? ((0, jsx_runtime_1.jsx)("span", Object.assign({ className: ChatMessage_module_css_1.default.deletedMessage }, { children: message }))) : (messageNodes)] })), !!relativeTime && (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: ChatMessage_module_css_1.default.timestamp }, { children: [relativeTime, " ago"] }))] })), !isOwnMessage && ((0, jsx_runtime_1.jsx)(common_ui_1.IconButton, { className: ChatMessage_module_css_1.default.replyButton, color: "green", icon: hi_1.HiReply, label: "Reply", size: "small", onClick: replyButtonClick })), (0, jsx_runtime_1.jsx)(social_1.MiniProfilePortal, { anchor: wrapper, placement: "left", reportContext: common_ui_1.CommonUtils.isDeletedChatMessage(chatMessage)
                    ? undefined
                    : {
                        chatId: chatMessage.chatId,
                        channelId,
                        messageId: chatMessage.messageId,
                    }, showMiniProfile: showMiniProfile, userId: senderId, onClose: () => setShowMiniProfile(false) })] })));
}
exports.ChatMessage = ChatMessage;
function chatPropsAreEqual(prevMessage, nextMessage) {
    var _a, _b;
    // if user changed display name
    if (prevMessage.chatMessage.sender.displayName !==
        nextMessage.chatMessage.sender.displayName) {
        return false;
    }
    // if user changed avatar
    if (((_a = prevMessage.chatMessage.sender.avatars) === null || _a === void 0 ? void 0 : _a.avatar2D) !==
        ((_b = nextMessage.chatMessage.sender.avatars) === null || _b === void 0 ? void 0 : _b.avatar2D)) {
        return false;
    }
    // If message content changed (e.g. moderation)
    const prevMessageText = common_ui_1.CommonUtils.getChatMessageText(prevMessage.chatMessage);
    const nextMessageText = common_ui_1.CommonUtils.getChatMessageText(nextMessage.chatMessage);
    if (prevMessageText !== nextMessageText) {
        return false;
    }
    return true;
}
exports.ChatMessageMemo = (0, react_1.memo)(ChatMessage, chatPropsAreEqual);
//# sourceMappingURL=ChatMessage.js.map