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
exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const addon_actions_1 = require("@storybook/addon-actions");
const ChatInputForm_1 = require("./ChatInputForm");
exports.default = {
    title: 'Chat Input Form',
    component: ChatInputForm_1.ChatInputForm,
};
const Template = (_a) => {
    var args = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)("div", { style: { width: '250px' }, children: (0, jsx_runtime_1.jsx)(ChatInputForm_1.ChatInputForm, Object.assign({}, args)) }));
};
exports.Default = {
    render: Template,
    args: {
        sendMessage: (0, addon_actions_1.action)('sendMessage'),
        placeholder: 'Placeholder',
    },
};
//# sourceMappingURL=ChatInputForm.stories.js.map