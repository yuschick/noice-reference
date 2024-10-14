import { ChatMessageFragment } from '@chat-gen';
interface Props {
    messages: ChatMessageFragment[];
    channelId?: string;
}
export declare function usePollChatProfiles({ messages, channelId }: Props): void;
export {};
