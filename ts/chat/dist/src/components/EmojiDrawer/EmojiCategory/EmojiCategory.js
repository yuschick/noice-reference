"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiCategory = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ChatEmoji_1 = require("../../ChatEmoji");
const EmojiCategory_module_css_1 = __importDefault(require("./EmojiCategory.module.css"));
function EmojiCategory({ title, emojis, onEmojiClicked }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: EmojiCategory_module_css_1.default.categoryContainer, children: [(0, jsx_runtime_1.jsx)("div", { className: EmojiCategory_module_css_1.default.categoryTitle, children: title }), (0, jsx_runtime_1.jsx)("div", { className: EmojiCategory_module_css_1.default.emojiContainer, children: emojis.map(({ label, emoji }) => ((0, jsx_runtime_1.jsx)("button", { "aria-label": emoji.label, className: EmojiCategory_module_css_1.default.emojiButton, type: "button", onClick: () => onEmojiClicked(label), children: (0, jsx_runtime_1.jsx)(ChatEmoji_1.ChatEmoji, { emoji: emoji.label, source: emoji.source }) }, label))) })] }));
}
exports.EmojiCategory = EmojiCategory;
//# sourceMappingURL=EmojiCategory.js.map