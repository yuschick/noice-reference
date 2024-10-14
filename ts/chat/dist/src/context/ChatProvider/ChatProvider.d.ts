import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { ChatMessageFragment } from '@chat-gen';
import { AutomodState, ChannelEventModel, ChatBoosterRequest, ChatChannel, ModerationMessageModel, MuteState } from '@chat-types';
export interface ChatContextContent {
    chatId: Nullable<string>;
    messages: ChatMessageFragment[];
    moderationMessages: ModerationMessageModel[];
    channelEventMessages: ChannelEventModel[];
    loading: boolean;
    automodState: Nullable<AutomodState>;
    sendMessage(content: string, consentToModeration?: boolean): void;
    cancelModeratedMessage(): void;
}
interface ChatContextType {
    muteState: Nullable<MuteState>;
    streamChat: ChatContextContent;
    groupChat: ChatContextContent;
    boosterRequests: ChatBoosterRequest[];
}
type Props = WithChildren<{
    streamChatId: Nullable<string>;
    groupChatId?: string;
    channelId?: string;
}>;
export declare function ChatProvider({ streamChatId, groupChatId, channelId, children }: Props): import("react/jsx-runtime").JSX.Element;
export declare function useChatContext(): ChatContextType;
export declare function useActiveChannelChat(activeChannel: ChatChannel): ChatContextContent;
export {};
