"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockedUserMessageDeletion = void 0;
const client_1 = require("@apollo/client");
const social_1 = require("@noice-com/social");
const react_1 = require("react");
const _chat_gen_1 = require("@chat-gen");
function useBlockedUserMessageDeletion(chatId, channelId) {
    const client = (0, client_1.useApolloClient)();
    const events = (0, social_1.useSocialPackageEvents)();
    const deleteBlockedUsersMessages = (0, react_1.useCallback)((blockedUserId) => {
        if (!chatId || !channelId) {
            return;
        }
        client.cache.updateQuery({
            query: _chat_gen_1.ChatHistoryDocument,
            variables: {
                chatId,
                channelId,
                cursor: { last: 100 },
            },
        }, (data) => {
            var _a, _b;
            // Remove all messages that the blocked user has sent
            return Object.assign(Object.assign({}, data), { chatMessages: Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.chatMessages), { messages: (_b = (_a = data === null || data === void 0 ? void 0 : data.chatMessages) === null || _a === void 0 ? void 0 : _a.messages.filter((message) => message.senderId !== blockedUserId)) !== null && _b !== void 0 ? _b : [] }) });
        });
    }, [channelId, chatId, client.cache]);
    (0, react_1.useEffect)(() => {
        events.addListener('onProfileBlocked', deleteBlockedUsersMessages);
        return () => {
            events.removeListener('onProfileBlocked', deleteBlockedUsersMessages);
        };
    }, [events, deleteBlockedUsersMessages]);
}
exports.useBlockedUserMessageDeletion = useBlockedUserMessageDeletion;
//# sourceMappingURL=useBlockedUserMessageDeletion.hook.js.map