import { Nullable } from '@noice-com/utils';
import { ChatMessagesProfileFragment } from '@chat-gen';
import { ChatChannel } from '@chat-types';
interface Props {
    channelId: string;
    me: Nullable<ChatMessagesProfileFragment>;
    loading?: boolean;
    activeChannel: ChatChannel;
    onReplyButtonClick?: (replyPlayerName: string) => void;
}
export declare function ChatMessages({ me, loading: loadingProp, activeChannel, onReplyButtonClick, channelId, }: Props): import("react/jsx-runtime").JSX.Element;
export declare namespace ChatMessages {
    var fragments: {
        profile: import("@apollo/client").DocumentNode;
    };
}
export {};
