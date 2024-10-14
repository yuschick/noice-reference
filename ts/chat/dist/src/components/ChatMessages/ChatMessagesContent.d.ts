import { Nullable } from '@noice-com/utils';
import { ChatMessagesProfileFragment } from '@chat-gen';
import { ChatMessageModel } from '@chat-types';
interface Props {
    channelId: string;
    me: Nullable<ChatMessagesProfileFragment>;
    loading: boolean;
    onReplyButtonClick?: (replyPlayerName: string) => void;
    combinedMessages: ChatMessageModel[];
}
export declare const ChatMessagesContent: ({ me, loading, onReplyButtonClick, combinedMessages, channelId, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
