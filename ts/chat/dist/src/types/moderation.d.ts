import { Nullable } from '@noice-com/utils';
import { ChatTextMessageAttachment } from '@chat-gen';
export interface MuteState {
    muted: boolean;
    startTime: Nullable<number>;
    duration: Nullable<number>;
}
export declare enum ModerationMessageStatus {
    AutomodPending = "automod-pending",
    AutomodAccepted = "automod-accepted",
    AutomodDenied = "automod-denied",
    AutomodBlocked = "automod-blocked"
}
export interface ModerationMessageModel {
    id: string;
    time: Date;
    type: 'moderation';
    content: {
        id: string;
        status: ModerationMessageStatus;
    };
}
interface ChatMessageContent {
    text: string;
    attachments: ChatTextMessageAttachment[];
}
export interface AutomodState {
    messageContent: ChatMessageContent;
}
export {};
