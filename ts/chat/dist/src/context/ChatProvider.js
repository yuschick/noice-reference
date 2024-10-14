"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveChannelChat = exports.useChatContext = exports.ChatProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ChatAPIProvider_1 = require("./ChatAPIProvider/ChatAPIProvider");
const _chat_hooks_1 = require("@chat-hooks");
const ChatContext = (0, react_1.createContext)(null);
function ChatProvider({ streamChatId, groupChatId, channelId, children }) {
    const [muteState, setMuteState] = (0, react_1.useState)(null);
    (0, _chat_hooks_1.useBlockedUserMessageDeletion)(streamChatId);
    (0, _chat_hooks_1.useBlockedUserMessageDeletion)(groupChatId !== null && groupChatId !== void 0 ? groupChatId : null);
    const { boosterRequests, emitAPIEvent } = (0, ChatAPIProvider_1.useChatAPIInternal)();
    // Force type to match the context type
    const streamChat = (0, _chat_hooks_1.useChat)(streamChatId, channelId);
    const groupChat = (0, _chat_hooks_1.useChat)(groupChatId !== null && groupChatId !== void 0 ? groupChatId : null, channelId);
    (0, react_1.useEffect)(() => {
        setMuteState(streamChat.muteState);
    }, [setMuteState, streamChat.muteState]);
    (0, react_1.useEffect)(() => {
        emitAPIEvent('onTeamChatMessagesAmountChange', groupChat.messages.length);
    }, [groupChat.messages.length, emitAPIEvent]);
    return ((0, jsx_runtime_1.jsx)(ChatContext.Provider, { value: { muteState, streamChat, groupChat, boosterRequests }, children: children }));
}
exports.ChatProvider = ChatProvider;
function useChatContext() {
    const context = (0, react_1.useContext)(ChatContext);
    if (!context) {
        throw new Error('Trying to access chat context without ChatProvider');
    }
    return context;
}
exports.useChatContext = useChatContext;
function useActiveChannelChat(activeChannel) {
    const { streamChat, groupChat } = useChatContext();
    const context = activeChannel === 'stream' ? streamChat : groupChat;
    return context;
}
exports.useActiveChannelChat = useActiveChannelChat;
//# sourceMappingURL=ChatProvider.js.map