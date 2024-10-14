"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiDrawer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const react_1 = require("react");
const ChatDrawer_1 = require("../ChatDrawer");
const EmojiCategory_1 = require("./EmojiCategory/EmojiCategory");
const EmojiDrawer_module_css_1 = __importDefault(require("./EmojiDrawer.module.css"));
const _chat_classes_1 = require("@chat-classes");
(0, client_1.gql) `
  fragment EmojiDrawerChannel on ChannelChannel {
    id
    ...ChannelLogoChannel
  }
`;
function EmojiDrawer({ showDrawer, emojiList, emojisByChannel, noiceEmojis, className, onEmojiClicked, onOutsideClick, outsideClickExemptions, }) {
    const [emojiChannels, setEmojiChannels] = (0, react_1.useState)([]);
    const [lastUsedEmojis, setLastUsedEmojis] = (0, react_1.useState)(null);
    // Generate emojis only after toggle button is clicked to avoid unneeded stuff in DOM
    (0, react_1.useEffect)(() => {
        // Only fetch emojis when button is clicked
        if (!showDrawer) {
            return;
        }
        // Fetch last used emojis every time drawer is opened
        setLastUsedEmojis(() => {
            const emojis = _chat_classes_1.LastUsedEmojisLocalStorage.GetEmojis()
                .map((label) => ({ label, emoji: emojiList[label] }))
                .filter(({ emoji }) => !!emoji);
            if (!emojis.length) {
                return null;
            }
            return emojis;
        });
        setEmojiChannels((prev) => {
            if (prev.length) {
                return prev;
            }
            return emojisByChannel;
        });
    }, [showDrawer, emojiList, emojisByChannel]);
    const onEmojiClick = (emoji) => {
        _chat_classes_1.LastUsedEmojisLocalStorage.AddNewEmoji(emoji);
        onEmojiClicked(emoji);
    };
    return ((0, jsx_runtime_1.jsxs)(ChatDrawer_1.ChatDrawer, { className: className, outsideClickExemptions: outsideClickExemptions, showDrawer: showDrawer, onOutsideClick: onOutsideClick, children: [(0, jsx_runtime_1.jsx)("input", { className: EmojiDrawer_module_css_1.default.searchInput, placeholder: "Search for emojis (not functional)", type: "text", disabled: true }), lastUsedEmojis && ((0, jsx_runtime_1.jsx)(EmojiCategory_1.EmojiCategory, { emojis: lastUsedEmojis, title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(common_ui_1.CommonAssets.Icons.SpeedUp, { className: EmojiDrawer_module_css_1.default.speedupIcon }), " Recently used"] }), onEmojiClicked: onEmojiClick })), emojiChannels.map(({ channel, emojis }) => ((0, jsx_runtime_1.jsx)(EmojiCategory_1.EmojiCategory, { emojis: emojis, title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(common_ui_1.ChannelLogo, { channel: channel, size: "xs" }), channel.name] }), onEmojiClicked: onEmojiClick }, channel.name))), !!noiceEmojis.emojis.length && ((0, jsx_runtime_1.jsx)(EmojiCategory_1.EmojiCategory, { emojis: noiceEmojis.emojis, title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: EmojiDrawer_module_css_1.default.noiceLogoContainer, children: (0, jsx_runtime_1.jsx)(common_ui_1.NoiceLogo, { color: "spectrum", variant: "mark" }) }), noiceEmojis.title] }), onEmojiClicked: onEmojiClick }))] }));
}
exports.EmojiDrawer = EmojiDrawer;
//# sourceMappingURL=EmojiDrawer.js.map