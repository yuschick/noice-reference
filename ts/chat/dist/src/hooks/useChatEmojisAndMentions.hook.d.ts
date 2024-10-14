import { ReactNode } from 'react';
import { UseChatEmojisAndMentionsAttachmentFragment } from '@chat-gen';
interface Props {
    message: string;
    attachments?: UseChatEmojisAndMentionsAttachmentFragment[];
    ownPlayerName: string;
    mentionClassName?: string;
    emojiClassName?: string;
}
interface HookResult {
    messageNodes: ReactNode[];
    mentionsMe: boolean;
}
export declare function useChatEmojisAndMentions({ message, attachments, ownPlayerName, mentionClassName, emojiClassName, }: Props): HookResult;
export declare namespace useChatEmojisAndMentions {
    var fragments: {
        attachment: import("@apollo/client").DocumentNode;
    };
}
export {};
