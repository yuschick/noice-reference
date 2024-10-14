/// <reference types="react" />
import { LegacyChatMessageFragment } from '@chat-gen';
export interface MessageProps {
    channelId: string;
    chatMessage: LegacyChatMessageFragment;
    isOwnMessage?: boolean;
    ownPlayerName: string;
    onReplyButtonClick?: (replyPlayerName: string) => void;
}
export declare function ChatMessage({ channelId, chatMessage, ownPlayerName, isOwnMessage, onReplyButtonClick, }: MessageProps): import("react/jsx-runtime").JSX.Element;
export declare const ChatMessageMemo: import("react").NamedExoticComponent<MessageProps>;
