"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const ModerationMessage_1 = require("./ModerationMessage");
const _chat_types_1 = require("@chat-types");
exports.default = {
    title: 'ModerationMessage',
    component: ModerationMessage_1.ModerationMessage,
    argTypes: {},
};
exports.Default = {
    args: {
        status: _chat_types_1.ModerationMessageStatus.AutomodPending,
    },
};
//# sourceMappingURL=ModerationMessage.stories.js.map