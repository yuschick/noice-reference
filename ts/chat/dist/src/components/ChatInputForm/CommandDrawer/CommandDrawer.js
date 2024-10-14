"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDrawer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = __importDefault(require("classnames"));
const ChatDrawer_1 = require("../../ChatDrawer");
const CommandDrawer_module_css_1 = __importDefault(require("./CommandDrawer.module.css"));
function CommandDrawer({ className, commands, onCommandClick, onMouseEnter, activeCommand, showDrawer, }) {
    return ((0, jsx_runtime_1.jsx)(ChatDrawer_1.ChatDrawer, { className: className, showDrawer: showDrawer, children: commands.map(({ id, name, iconUrl, chatCommand }) => ((0, jsx_runtime_1.jsxs)("button", { className: (0, classnames_1.default)(CommandDrawer_module_css_1.default.button, { [CommandDrawer_module_css_1.default.active]: id === activeCommand }), onClick: () => {
                onCommandClick(id);
            }, onMouseEnter: () => {
                onMouseEnter(id);
            }, children: [(0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("span", { className: CommandDrawer_module_css_1.default.title, children: chatCommand }), (0, jsx_runtime_1.jsxs)("span", { className: CommandDrawer_module_css_1.default.description, children: ["Trigger ", name] })] }), (0, jsx_runtime_1.jsx)("span", { className: CommandDrawer_module_css_1.default.imageContainer, children: (0, jsx_runtime_1.jsx)("img", { alt: name, className: CommandDrawer_module_css_1.default.image, src: iconUrl }) })] }, id))) }));
}
exports.CommandDrawer = CommandDrawer;
//# sourceMappingURL=CommandDrawer.js.map