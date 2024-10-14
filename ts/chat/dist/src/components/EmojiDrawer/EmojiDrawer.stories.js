"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const addon_actions_1 = require("@storybook/addon-actions");
const EmojiDrawer_1 = require("./EmojiDrawer");
exports.default = {
    title: 'Emoji Drawer',
    component: EmojiDrawer_1.EmojiDrawer,
};
const Template = (_a) => {
    var args = __rest(_a, []);
    return (0, jsx_runtime_1.jsx)(EmojiDrawer_1.EmojiDrawer, Object.assign({}, args));
};
exports.Drawer = {
    render: Template,
    args: {
        showDrawer: true,
        onEmojiClicked: (0, addon_actions_1.action)('omEmojiClicked'),
        onOutsideClick: (0, addon_actions_1.action)('onOutsideClick'),
    },
};
//# sourceMappingURL=EmojiDrawer.stories.js.map