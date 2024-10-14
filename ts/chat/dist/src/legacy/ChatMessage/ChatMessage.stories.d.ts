import { MessageProps } from './ChatMessage';
import { ApiEntityState, ChatModerationStatus } from '@chat-gen';
declare const _default: import("@storybook/types").ComponentAnnotations<import("@storybook/react/dist/types-0a347bb9").R, MessageProps>;
export default _default;
export declare const Default: {
    render: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, MessageProps>;
    args: {
        chatMessage: {
            senderId: string;
            chatId: string;
            messageId: string;
            moderationStatus: ChatModerationStatus;
            state: ApiEntityState;
            createdAt: string;
            sender: {
                userId: string;
                displayName: string;
                avatars: {
                    avatar2D: string;
                };
            };
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
    };
};
