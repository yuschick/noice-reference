import { Nullable } from '@noice-com/utils';
import { LegacyChatMessageModel } from '../types';
import { ChatMessagesProfileFragment } from '@chat-gen';
interface Props {
    channelId: string;
    me: Nullable<ChatMessagesProfileFragment>;
    loading: boolean;
    onReplyButtonClick?: (replyPlayerName: string) => void;
    combinedMessages: LegacyChatMessageModel[];
}
export declare const ChatMessagesContent: ({ me, loading, onReplyButtonClick, combinedMessages, channelId, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
