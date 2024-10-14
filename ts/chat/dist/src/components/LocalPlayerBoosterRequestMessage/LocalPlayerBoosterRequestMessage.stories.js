"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const LocalPlayerBoosterRequestMessage_1 = require("./LocalPlayerBoosterRequestMessage");
exports.default = {
    title: 'Local Player Booster Request Message',
    component: LocalPlayerBoosterRequestMessage_1.LocalPlayerBoosterRequestMessage,
};
const Template = (args) => ((0, jsx_runtime_1.jsx)("div", { style: { width: '320px' }, children: (0, jsx_runtime_1.jsx)(LocalPlayerBoosterRequestMessage_1.LocalPlayerBoosterRequestMessage, Object.assign({}, args)) }));
exports.Default = {
    render: Template,
    args: {
        profile: common_ui_1.StoryHelpers.getNewProfile(),
    },
};
//# sourceMappingURL=LocalPlayerBoosterRequestMessage.stories.js.map