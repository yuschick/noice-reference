"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const ChatMessageAvatar_module_css_1 = __importDefault(require("./ChatMessageAvatar.module.css"));
function ChatMessageAvatar({ className, isOwnMessage, loadingProfile, miniProfileOpen, onAvatarClick, profile, }) {
    if (loadingProfile) {
        return (0, jsx_runtime_1.jsx)(common_ui_1.ProfileImage.Loading, { size: "xs" });
    }
    if (isOwnMessage) {
        return ((0, jsx_runtime_1.jsx)(common_ui_1.ProfileImage, { profile: profile, size: "xs" }));
    }
    return ((0, jsx_runtime_1.jsx)("button", { "aria-expanded": miniProfileOpen ? 'true' : 'false', "aria-haspopup": "dialog", className: (0, classnames_1.default)(className, ChatMessageAvatar_module_css_1.default.button), onClick: onAvatarClick, children: (0, jsx_runtime_1.jsx)(common_ui_1.ProfileImage, { profile: profile, size: "xs" }) }));
}
exports.ChatMessageAvatar = ChatMessageAvatar;
//# sourceMappingURL=ChatMessageAvatar.js.map