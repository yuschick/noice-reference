"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEmoji = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const ChatEmoji_module_css_1 = __importDefault(require("./ChatEmoji.module.css"));
function ChatEmoji({ emoji, source, disableTooltip, className }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)(ChatEmoji_module_css_1.default.wrapper, className), title: disableTooltip ? undefined : emoji, children: (0, jsx_runtime_1.jsx)(common_ui_1.Image, { alt: emoji, className: ChatEmoji_module_css_1.default.emoji, src: source }) }));
}
exports.ChatEmoji = ChatEmoji;
//# sourceMappingURL=ChatEmoji.js.map