import { StoryHelpers } from '@noice-com/common-ui';
import type { Meta } from '@storybook/react';
import { ChatMessage } from './ChatMessage';
import { ApiEntityState, ChatModerationStatus } from '@chat-gen';
declare const meta: Meta<typeof ChatMessage>;
export default meta;
export declare const Default: {
    args: {
        chatMessage: {
            senderId: string;
            chatId: string;
            messageId: string;
            moderationStatus: ChatModerationStatus;
            state: ApiEntityState;
            createdAt: string;
            content: {
                content: {
                    text: string;
                    attachments: {
                        startIndex: number;
                        endIndex: number;
                        label: string;
                        source: string;
                        itemId: string;
                    }[];
                    __typename: string;
                };
            };
        };
        ownPlayerName: string;
        channelId: string;
    };
    parameters: {
        apolloClient: {
            mocks: StoryHelpers.Apollo.GraphqlMock<any>[];
        };
    };
};
export declare const WithBadges: {
    parameters: {
        apolloClient: {
            mocks: StoryHelpers.Apollo.GraphqlMock<any>[];
        };
    };
    args: {
        chatMessage: {
            senderId: string;
            chatId: string;
            messageId: string;
            moderationStatus: ChatModerationStatus;
            state: ApiEntityState;
            createdAt: string;
            content: {
                content: {
                    text: string;
                    attachments: {
                        startIndex: number;
                        endIndex: number;
                        label: string;
                        source: string;
                        itemId: string;
                    }[];
                    __typename: string;
                };
            };
        };
        ownPlayerName: string;
        channelId: string;
    };
};
export declare const Loading: {
    parameters: {};
    args: {
        chatMessage: {
            senderId: string;
            chatId: string;
            messageId: string;
            moderationStatus: ChatModerationStatus;
            state: ApiEntityState;
            createdAt: string;
            content: {
                content: {
                    text: string;
                    attachments: {
                        startIndex: number;
                        endIndex: number;
                        label: string;
                        source: string;
                        itemId: string;
                    }[];
                    __typename: string;
                };
            };
        };
        ownPlayerName: string;
        channelId: string;
    };
};
