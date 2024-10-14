"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCache = void 0;
function chatCache() {
    return {
        keyArgs: ['chatId'],
        read(existing) {
            return existing;
        },
        merge(_existing, incoming) {
            // All have been done in useChat hook
            return incoming;
        },
    };
}
exports.chatCache = chatCache;
//# sourceMappingURL=chat-cache.js.map