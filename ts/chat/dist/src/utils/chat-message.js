"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeletedChatMessage = void 0;
const _chat_gen_1 = require("@chat-gen");
const isDeletedChatMessage = (chatMessage) => {
    var _a, _b;
    return ((_b = (_a = chatMessage.content) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.__typename) === 'ChatTombstone' ||
        chatMessage.state === _chat_gen_1.ApiEntityState.EntityStateBlocked;
};
exports.isDeletedChatMessage = isDeletedChatMessage;
//# sourceMappingURL=chat-message.js.map