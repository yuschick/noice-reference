import { Nullable } from '@noice-com/utils';
import { ChatMessageFragment } from '@chat-gen';
import { AutomodState, ChannelEventModel, ModerationMessageModel, MuteState } from '@chat-types';
interface HookResult {
    muteState: Nullable<MuteState>;
    automodState: Nullable<AutomodState>;
    messages: ChatMessageFragment[];
    moderationMessages: ModerationMessageModel[];
    channelEventMessages: ChannelEventModel[];
    loading: boolean;
    chatId: Nullable<string>;
    sendMessage(content: string, consentToModeration?: boolean): void;
    cancelModeratedMessage(): void;
}
export declare function useChat(chatId: Nullable<string>, channelId?: string): HookResult;
export {};
