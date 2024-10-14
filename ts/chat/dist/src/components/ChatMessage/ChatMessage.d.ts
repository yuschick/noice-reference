/// <reference types="react" />
import { ChatMessageFragment } from '@chat-gen';
export interface MessageProps {
    className?: string;
    channelId: string;
    chatMessage: ChatMessageFragment;
    isOwnMessage?: boolean;
    ownPlayerName: string;
    onReplyButtonClick?: (replyPlayerName: string) => void;
}
export declare function ChatMessage({ className, channelId, chatMessage, ownPlayerName, isOwnMessage, onReplyButtonClick, }: MessageProps): import("react/jsx-runtime").JSX.Element | null;
export declare const ChatMessageMemo: import("react").NamedExoticComponent<MessageProps>;
