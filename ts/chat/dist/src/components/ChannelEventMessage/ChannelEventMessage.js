"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEventMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const social_1 = require("@noice-com/social");
const react_1 = require("react");
const ChannelEventMessage_module_css_1 = __importDefault(require("./ChannelEventMessage.module.css"));
const _chat_gen_1 = require("@chat-gen");
function ChannelEventMessage({ channelId, content }) {
    var _a, _b, _c, _d, _e;
    const [showMiniProfile, setShowMiniProfile] = (0, react_1.useState)(false);
    const usernameButtonRef = (0, react_1.useRef)(null);
    const { userId } = (0, common_ui_1.useAuthenticatedUser)();
    const badge = (_c = (_b = (_a = content.user) === null || _a === void 0 ? void 0 : _a.badges) === null || _b === void 0 ? void 0 : _b.find((badge) => badge.type === _chat_gen_1.BadgeBadgeType.TypeChannelSubscriber)) !== null && _c !== void 0 ? _c : { type: _chat_gen_1.BadgeBadgeType.TypeChannelSubscriber, level: 1 };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: ChannelEventMessage_module_css_1.default.channelEventMessageWrapper, id: content.id, children: (0, jsx_runtime_1.jsxs)("div", { className: ChannelEventMessage_module_css_1.default.messageContentWrapper, children: [(0, jsx_runtime_1.jsxs)("div", { className: ChannelEventMessage_module_css_1.default.messageTitleWrapper, children: [content.type === 'subscription' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(social_1.UserBadge, { badge: badge, badgeSize: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "New Subscriber" })] })), content.type === 'bundle' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(common_ui_1.Icon, { icon: common_ui_1.CommonAssets.Icons.Card, size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Premium bundle purchase" })] })), content.type === 'creator-card' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(common_ui_1.Icon, { icon: common_ui_1.CommonAssets.Icons.Card, size: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "Creator Card purchase" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: ChannelEventMessage_module_css_1.default.messageContent, children: [content.user.userId ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: content.user.userId !== userId ? ((0, jsx_runtime_1.jsx)("button", { "aria-expanded": showMiniProfile ? 'true' : 'false', "aria-haspopup": "dialog", className: ChannelEventMessage_module_css_1.default.usernameButton, ref: usernameButtonRef, type: "button", onClick: () => setShowMiniProfile(!showMiniProfile), children: content.user.userTag })) : ((0, jsx_runtime_1.jsx)("span", { className: ChannelEventMessage_module_css_1.default.username, children: content.user.userTag })) })) : ((0, jsx_runtime_1.jsx)("span", { className: ChannelEventMessage_module_css_1.default.anonymousUsername, children: "Mysterious Stranger" })), content.type === 'bundle' &&
                                    (!((_d = content.creatorCardNames) === null || _d === void 0 ? void 0 : _d.length) ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: " purchased the Premium bundle." })) : (!!((_e = content.creatorCardNames) === null || _e === void 0 ? void 0 : _e.length) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', "purchased the Premium bundle and acquired", ' ', content.creatorCardNames.length > 1
                                                ? 'the Creator Cards '
                                                : 'the Creator Card ', (0, jsx_runtime_1.jsxs)("span", { className: ChannelEventMessage_module_css_1.default.creatorCardName, children: [content.creatorCardNames.join(', '), "!"] })] })))), content.type === 'creator-card' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', "purchased the Creator Card", ' ', (0, jsx_runtime_1.jsx)("span", { className: ChannelEventMessage_module_css_1.default.creatorCardName, children: content.creatorCardName }), "!"] })), content.type === 'subscription' && (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: " subscribed to the channel!" })] })] }) }), !!content.user.userId && ((0, jsx_runtime_1.jsx)(social_1.MiniProfilePortal, { anchor: usernameButtonRef, channelId: channelId, className: ChannelEventMessage_module_css_1.default.miniProfile, placement: "top", showMiniProfile: showMiniProfile, userId: content.user.userId, onClose: () => setShowMiniProfile(false) }))] }));
}
exports.ChannelEventMessage = ChannelEventMessage;
//# sourceMappingURL=ChannelEventMessage.js.map