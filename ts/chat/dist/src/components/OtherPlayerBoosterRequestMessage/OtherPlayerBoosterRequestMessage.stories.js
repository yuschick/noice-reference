"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const OtherPlayerBoosterRequestMessage_1 = require("./OtherPlayerBoosterRequestMessage");
exports.default = {
    title: 'Chat/Other Player Booster Request Message',
    component: OtherPlayerBoosterRequestMessage_1.OtherPlayerBoosterRequestMessage,
};
const Template = (args) => ((0, jsx_runtime_1.jsx)("div", { style: { width: '320px' }, children: (0, jsx_runtime_1.jsx)(OtherPlayerBoosterRequestMessage_1.OtherPlayerBoosterRequestMessage, Object.assign({}, args)) }));
exports.Default = {
    render: Template,
    args: {
        profile: common_ui_1.StoryHelpers.getNewProfile(),
    },
};
//# sourceMappingURL=OtherPlayerBoosterRequestMessage.stories.js.map