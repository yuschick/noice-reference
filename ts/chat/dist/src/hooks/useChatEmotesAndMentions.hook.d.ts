import { ReactNode } from 'react';
import { UseChatEmotesAndMentionsAttachmentFragment } from '@chat-gen';
interface Props {
    message: string;
    attachments?: UseChatEmotesAndMentionsAttachmentFragment[];
    ownPlayerName: string;
    mentionClassName?: string;
    emojiClassName?: string;
}
interface HookResult {
    messageNodes: ReactNode[];
    mentionsMe: boolean;
}
export declare function useChatEmotesAndMentions({ message, attachments, ownPlayerName, mentionClassName, emojiClassName, }: Props): HookResult;
export declare namespace useChatEmotesAndMentions {
    var fragments: {
        attachment: import("@apollo/client").DocumentNode;
    };
}
export {};
