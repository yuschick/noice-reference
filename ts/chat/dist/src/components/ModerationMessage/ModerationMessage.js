"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ModerationMessage_module_css_1 = __importDefault(require("./ModerationMessage.module.css"));
const _chat_types_1 = require("@chat-types");
const statusTest = {
    [_chat_types_1.ModerationMessageStatus.AutomodAccepted]: 'Mods have allowed your message.',
    [_chat_types_1.ModerationMessageStatus.AutomodPending]: 'Your message is being checked by mods and has not been sent to chat.',
    [_chat_types_1.ModerationMessageStatus.AutomodBlocked]: 'Noice has blocked your message because it may violate the Noice Community Guidelines.',
    [_chat_types_1.ModerationMessageStatus.AutomodDenied]: 'Mods have denied your message.',
};
const sender = {
    [_chat_types_1.ModerationMessageStatus.AutomodAccepted]: 'Automod',
    [_chat_types_1.ModerationMessageStatus.AutomodPending]: 'Automod',
    [_chat_types_1.ModerationMessageStatus.AutomodBlocked]: undefined,
    [_chat_types_1.ModerationMessageStatus.AutomodDenied]: 'Automod',
};
function ModerationMessage({ status }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: ModerationMessage_module_css_1.default.wrapper, children: [sender[status] && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: ModerationMessage_module_css_1.default.sender, children: sender[status] }), ":", ' '] })), statusTest[status]] }));
}
exports.ModerationMessage = ModerationMessage;
//# sourceMappingURL=ModerationMessage.js.map