"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loading = exports.WithBadges = exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const social_1 = require("@noice-com/social");
const ChatMessage_1 = require("./ChatMessage");
const _chat_gen_1 = require("@chat-gen");
const meta = {
    title: 'ChatMessage',
    component: ChatMessage_1.ChatMessage,
    decorators: [
        (Story) => ((0, jsx_runtime_1.jsx)("div", { style: { width: '320px' }, children: (0, jsx_runtime_1.jsx)(Story, {}) })),
    ],
};
exports.default = meta;
const emojiList = {
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
const SENDER_ID = 'sender-id';
const CHANNEL_ID = 'channel-id';
exports.Default = {
    args: {
        chatMessage: {
            senderId: SENDER_ID,
            chatId: 'chat-id',
            messageId: 'message-id',
            moderationStatus: _chat_gen_1.ChatModerationStatus.ModerationStatusApproved,
            state: _chat_gen_1.ApiEntityState.EntityStateUnspecified,
            createdAt: new Date(Date.now() - 1000).toISOString(),
            content: {
                content: {
                    text: 'This is a :noice: message !! what is up :LUL: lol @Heta Cillum irure tempor velit irure dolore quis in culpa deserunt reprehenderit ad do quis.',
                    attachments: [
                        Object.assign(Object.assign({}, emojiList.noice), { startIndex: 10, endIndex: 16 }),
                        Object.assign(Object.assign({}, emojiList.LUL), { startIndex: 40, endIndex: 44 }),
                    ],
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    __typename: 'ChatTextMessage',
                },
            },
        },
        ownPlayerName: 'Heta',
        channelId: CHANNEL_ID,
    },
    parameters: common_ui_1.StoryHelpers.Apollo.addMocks([
        common_ui_1.StoryHelpers.Apollo.createMock(_chat_gen_1.ChatMessageSenderProfileDocument, { userId: SENDER_ID, channelId: CHANNEL_ID }, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            profile: Object.assign({ __typename: 'ProfileProfile' }, common_ui_1.StoryHelpers.getNewProfile()),
        }),
        common_ui_1.StoryHelpers.Apollo.createMock(social_1.MiniProfileDocument, { userId: SENDER_ID, channelId: CHANNEL_ID }, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            profile: Object.assign({ __typename: 'ProfileProfile' }, common_ui_1.StoryHelpers.getNewProfile()),
        }),
    ]),
};
const badges = [
    {
        type: _chat_gen_1.BadgeBadgeType.TypeChannelModerator,
    },
    {
        type: _chat_gen_1.BadgeBadgeType.TypeStreamer,
    },
];
exports.WithBadges = Object.assign(Object.assign({}, exports.Default), { parameters: common_ui_1.StoryHelpers.Apollo.addMocks([
        common_ui_1.StoryHelpers.Apollo.createMock(_chat_gen_1.ChatMessageSenderProfileDocument, { userId: SENDER_ID, channelId: CHANNEL_ID }, {
            profile: Object.assign(Object.assign({ 
                // eslint-disable-next-line @typescript-eslint/naming-convention
                __typename: 'ProfileProfile' }, common_ui_1.StoryHelpers.getNewProfile()), { badges }),
        }),
        common_ui_1.StoryHelpers.Apollo.createMock(social_1.MiniProfileDocument, { userId: SENDER_ID, channelId: CHANNEL_ID }, {
            profile: Object.assign(Object.assign({ 
                // eslint-disable-next-line @typescript-eslint/naming-convention
                __typename: 'ProfileProfile' }, common_ui_1.StoryHelpers.getNewProfile()), { badges }),
        }),
    ]) });
exports.Loading = Object.assign(Object.assign({}, exports.Default), { parameters: {} });
//# sourceMappingURL=ChatMessage.stories.js.map