"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDrawer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const ChatDrawer_module_css_1 = __importDefault(require("./ChatDrawer.module.css"));
const CHAT_DRAWER_CLOSING_TIME = 150;
function ChatDrawer({ children, className, onOutsideClick, outsideClickExemptions = [], showDrawer, }) {
    const drawerRef = (0, react_1.useRef)(null);
    const handleOutsideClick = () => {
        onOutsideClick === null || onOutsideClick === void 0 ? void 0 : onOutsideClick();
    };
    (0, common_ui_1.useOnOutsideClick)(drawerRef, handleOutsideClick, {
        exempt: [...outsideClickExemptions, 'portals'],
    });
    return ((0, jsx_runtime_1.jsx)(common_ui_1.MountTransition, { duration: "--chat-drawer-closing-time", isShown: showDrawer, transitionClassName: ChatDrawer_module_css_1.default.opened, children: (0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)(className, ChatDrawer_module_css_1.default.container), ref: drawerRef, style: {
                '--chat-drawer-closing-time': `${CHAT_DRAWER_CLOSING_TIME}ms`,
            }, children: (0, jsx_runtime_1.jsx)("div", { className: ChatDrawer_module_css_1.default.drawerPopup, children: (0, jsx_runtime_1.jsx)("div", { className: ChatDrawer_module_css_1.default.drawerInner, children: children }) }) }) }));
}
exports.ChatDrawer = ChatDrawer;
//# sourceMappingURL=ChatDrawer.js.map