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
const ChatMessage_1 = require("./ChatMessage");
const _chat_gen_1 = require("@chat-gen");
exports.default = {
    title: 'Chat/LegacyChatMessage',
    component: ChatMessage_1.ChatMessage,
    parameters: {},
    argTypes: {},
};
const Template = (_a) => {
    var args = __rest(_a, []);
    return (0, jsx_runtime_1.jsx)(ChatMessage_1.ChatMessage, Object.assign({}, args));
};
const emoteList = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LUL: {
        label: ':LUL:',
        source: `${NOICE.CDN_URL}/emotes/lul.png`,
        itemId: 'emoji-lul',
    },
    noice: {
        label: ':noice:',
        source: `${NOICE.CDN_URL}/emotes/noice.png`,
        itemId: 'emoji-noice',
    },
};
const EXAMPLE_PLAYER = 'player';
exports.Default = {
    render: Template,
    args: {
        chatMessage: {
            senderId: 'sender-id',
            chatId: 'chat-id',
            messageId: 'message-id',
            moderationStatus: _chat_gen_1.ChatModerationStatus.ModerationStatusApproved,
            state: _chat_gen_1.ApiEntityState.EntityStateUnspecified,
            createdAt: new Date(Date.now() - 1000).toISOString(),
            sender: {
                userId: EXAMPLE_PLAYER,
                displayName: 'Antti',
                avatars: {
                    avatar2D: 'https://placekitten.com/g/200/200',
                },
            },
            content: {
                content: {
                    text: 'This is a :noice: message !! what is up :LUL: lol @Heta',
                    attachments: [
                        Object.assign(Object.assign({}, emoteList.noice), { startIndex: 10, endIndex: 16 }),
                        Object.assign(Object.assign({}, emoteList.LUL), { startIndex: 40, endIndex: 44 }),
                    ],
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    __typename: 'ChatTextMessage',
                },
            },
        },
        ownPlayerName: 'Heta',
    },
};
//# sourceMappingURL=ChatMessage.stories.js.map