"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessagesContent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const ChatMessage_1 = require("../ChatMessage");
const ChatMessages_module_css_1 = __importDefault(require("./ChatMessages.module.css"));
const _chat_components_1 = require("@chat-components");
const _chat_gen_1 = require("@chat-gen");
const _chat_types_1 = require("@chat-types");
const ChatMessagesContent = ({ me, loading, onReplyButtonClick, combinedMessages, channelId, }) => {
    return loading ? ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: ChatMessages_module_css_1.default.loadingWrapper }, { children: (0, jsx_runtime_1.jsx)(common_ui_1.LoadingSpinner, {}) }))) : ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: ChatMessages_module_css_1.default.wrapper }, { children: me &&
            combinedMessages.map(({ id, type, content }) => {
                if (type !== 'message' && type !== 'booster' && type !== 'moderation') {
                    return null;
                }
                if (type === 'message') {
                    return ((0, jsx_runtime_1.jsxs)("div", { children: [me.userId === content.senderId &&
                                content.moderationStatus ===
                                    _chat_gen_1.ChatModerationStatus.ModerationStatusApproved && ((0, jsx_runtime_1.jsx)(_chat_components_1.ModerationMessage, { status: common_ui_1.ModerationMessageStatus.AutomodAccepted })), (0, jsx_runtime_1.jsx)(ChatMessage_1.ChatMessageMemo, { channelId: channelId, chatMessage: content, isOwnMessage: me.userId === content.senderId, ownPlayerName: me.displayName, onReplyButtonClick: onReplyButtonClick })] }, id));
                }
                if (type === 'moderation') {
                    return ((0, jsx_runtime_1.jsx)(_chat_components_1.ModerationMessage, { status: content.status }, id));
                }
                if (content.type === _chat_types_1.ChatBoosterRequestType.LOCAL) {
                    return ((0, jsx_runtime_1.jsx)(_chat_components_1.LocalPlayerBoosterRequestMessage, { profile: content.content.profile }, content.id));
                }
                if (content.type === _chat_types_1.ChatBoosterRequestType.OTHER) {
                    return ((0, jsx_runtime_1.jsx)(_chat_components_1.OtherPlayerBoosterRequestMessage, { profile: content.content.profile }, content.id));
                }
                return null;
            }) })));
};
exports.ChatMessagesContent = ChatMessagesContent;
//# sourceMappingURL=ChatMessagesContent.js.map