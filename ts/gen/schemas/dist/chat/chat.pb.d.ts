import * as AccessAccess from "../access/access.pb";
import * as ApiCursor from "../api/cursor.pb";
import * as ApiEntity from "../api/entity.pb";
import * as ClassificationClassification from "../classification/classification.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ChatRole {
    CHAT_ROLE_UNSPECIFIED = "CHAT_ROLE_UNSPECIFIED",
    CHAT_ROLE_MEMBER = "CHAT_ROLE_MEMBER",
    CHAT_ROLE_STREAMER = "CHAT_ROLE_STREAMER",
    CHAT_ROLE_MODERATOR = "CHAT_ROLE_MODERATOR",
    CHAT_ROLE_PLATFORM_MODERATOR = "CHAT_ROLE_PLATFORM_MODERATOR"
}
export declare enum ModerationStatus {
    MODERATION_STATUS_UNSPECIFIED = "MODERATION_STATUS_UNSPECIFIED",
    MODERATION_STATUS_APPROVED = "MODERATION_STATUS_APPROVED"
}
export declare enum AutomodLevel {
    AUTOMOD_LEVEL_UNSPECIFIED = "AUTOMOD_LEVEL_UNSPECIFIED",
    AUTOMOD_LEVEL_LOW = "AUTOMOD_LEVEL_LOW",
    AUTOMOD_LEVEL_HIGH = "AUTOMOD_LEVEL_HIGH"
}
export declare enum Reason {
    REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
    REASON_SPAM = "REASON_SPAM",
    REASON_OTHER = "REASON_OTHER"
}
export declare enum AutomodDecision {
    AUTOMOD_DECISION_UNSPECIFIED = "AUTOMOD_DECISION_UNSPECIFIED",
    AUTOMOD_DECISION_ACCEPTED = "AUTOMOD_DECISION_ACCEPTED",
    AUTOMOD_DECISION_REJECTED = "AUTOMOD_DECISION_REJECTED"
}
export declare enum UserLabel {
    USER_LABEL_UNSPECIFIED = "USER_LABEL_UNSPECIFIED",
    USER_LABEL_STREAMER = "USER_LABEL_STREAMER",
    USER_LABEL_MODERATOR = "USER_LABEL_MODERATOR",
    USER_LABEL_STAFF = "USER_LABEL_STAFF",
    USER_LABEL_VIEWER = "USER_LABEL_VIEWER"
}
export declare enum ContentValidationErrorDetailsCause {
    CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
    CAUSE_GUIDELINES_VIOLATION = "CAUSE_GUIDELINES_VIOLATION",
    CAUSE_REQUIRES_MODERATION = "CAUSE_REQUIRES_MODERATION"
}
export declare enum ModerationItemStatus {
    STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
    STATUS_PENDING = "STATUS_PENDING",
    STATUS_ALLOWED = "STATUS_ALLOWED",
    STATUS_DENIED = "STATUS_DENIED"
}
export type ChatCreatedEvent = {
    chat?: Chat;
};
export type ChatDetails = {
    chatId?: string;
    roles?: ChatRole[];
};
type BaseMessageContent = {};
export type MessageContent = BaseMessageContent & OneOf<{
    textContent: TextMessage;
    tombstone: Tombstone;
}>;
export type Tombstone = {};
export type TextMessageAttachment = {
    label?: string;
    source?: string;
    startIndex?: number;
    endIndex?: number;
    itemId?: string;
};
export type TextMessageLink = {
    startIndex?: number;
    endIndex?: number;
    url?: string;
};
export type TextMessage = {
    text?: string;
    attachments?: TextMessageAttachment[];
    links?: TextMessageLink[];
};
export type ChatMessage = {
    chatId?: string;
    messageId?: string;
    senderId?: string;
    username?: string;
    content?: MessageContent;
    createdAt?: string;
    state?: ApiEntity.EntityState;
    textClassification?: ClassificationClassification.TextClassification;
    moderationStatus?: ModerationStatus;
};
export type HideMessage = {
    chatId?: string;
    messageId?: string;
};
export type UserMuted = {
    chatId?: string;
    moderatorId?: string;
    userId?: string;
    duration?: string;
    reason?: Reason;
    description?: string;
};
export type UserUnmuted = {
    chatId?: string;
    moderatorId?: string;
    userId?: string;
};
export type UserBanned = {
    chatId?: string;
    moderatorId?: string;
    userId?: string;
};
export type MessageDenied = {
    chatId?: string;
    messageId?: string;
    userId?: string;
};
type BaseChatEvent = {
    cid?: number;
    chatId?: string;
};
export type ChatEvent = BaseChatEvent & OneOf<{
    chatDetails: ChatDetails;
    message: ChatMessage;
    hideMessage: HideMessage;
    userMuted: UserMuted;
    messageDenied: MessageDenied;
    userBanned: UserBanned;
    userUnmuted: UserUnmuted;
}>;
export type SendMessage = {
    chatId?: string;
    content?: MessageContent;
};
export type JoinChat = {
    target?: string;
};
export type LeaveChat = {
    chatId?: string;
};
export type ListMessagesRequest = {
    chatId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListMessagesResponse = {
    messages?: ChatMessage[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GetChatRequest = {
    target?: string;
};
export type GetChatResponse = {
    chatId?: string;
};
export type Meta = {
    permits?: AccessAccess.Permit[];
    autoModLevel?: AutomodLevel;
    attributes?: {
        [key: string]: string;
    };
    autoModDefaultDecision?: AutomodDecision;
};
export type Chat = {
    id?: string;
    target?: string;
    accessMeta?: Meta;
};
export type CreateChatRequest = {
    target?: string;
    accessMeta?: Meta;
};
export type ChatMessageStreamRequest = {
    chatId?: string;
};
export type SendMessageRequest = {
    chatId?: string;
    content?: MessageContent;
    consentToModeration?: boolean;
};
export type SendMessageResponse = {};
export type GetChatUserStatusRequest = {
    chatId?: string;
    userId?: string;
};
export type GetChatUserStatusResponse = {
    muted?: boolean;
    muteDuration?: string;
};
export type HideChatMessageRequest = {
    chatId?: string;
    messageId?: string;
};
export type ContentValidationErrorDetails = {
    cause?: ContentValidationErrorDetailsCause;
};
export type MuteChatUserRequest = {
    chatId?: string;
    userId?: string;
    duration?: string;
    reason?: Reason;
    description?: string;
};
export type UnmuteChatUserRequest = {
    chatId?: string;
    userId?: string;
};
export type ModerationItem = {
    id?: string;
    chatMessage?: ChatMessage;
    status?: ModerationItemStatus;
    expiresAt?: string;
    expired?: boolean;
    reviewerId?: string;
};
export type StreamAutoModQueueRequest = {
    chatId?: string;
};
export type AutoModQueueEventAdd = {
    item?: ModerationItem;
};
export type AutoModQueueEventUpdate = {
    item?: ModerationItem;
};
export type AutoModQueueEventRemove = {
    id?: string;
};
type BaseAutoModQueueEvent = {};
export type AutoModQueueEvent = BaseAutoModQueueEvent & OneOf<{
    add: AutoModQueueEventAdd;
    update: AutoModQueueEventUpdate;
    remove: AutoModQueueEventRemove;
}>;
export type AutomodDecisionEvent = {
    userId?: string;
    chatId?: string;
    reviewerId?: string;
    timestamp?: string;
    messageContent?: MessageContent;
    decision?: AutomodDecision;
    messageId?: string;
};
export type AllowModerationItemRequest = {
    chatId?: string;
    moderationItemId?: string;
};
export type DenyModerationItemRequest = {
    chatId?: string;
    moderationItemId?: string;
};
export type ClearModerationItemRequest = {
    chatId?: string;
    moderationItemId?: string;
};
export type GetMessageContextRequest = {
    chatId?: string;
    messageId?: string;
};
export type GetMessageContextResponse = {
    messages?: ChatMessage[];
    channelName?: string;
    chatName?: string;
};
export type ListChatUsersRequest = {
    chatId?: string;
    userLabel?: UserLabel;
    sortBy?: string;
    limit?: string;
};
export type ChatUser = {
    userId?: string;
    label?: UserLabel;
};
export type ListChatUsersResponse = {
    users?: ChatUser[];
};
export interface IMessageContentContentDelegate<C> {
    onTextContent(ctx: C, ev: TextMessage): void;
    onTombstone(ctx: C, ev: Tombstone): void;
}
export declare function routeMessageContentContentDelegate<C>(ctx: C, val: MessageContent, delegate: IMessageContentContentDelegate<C>): void;
export interface IChatEventEventDelegate<C> {
    onChatDetails(ctx: C, ev: ChatDetails): void;
    onMessage(ctx: C, ev: ChatMessage): void;
    onHideMessage(ctx: C, ev: HideMessage): void;
    onUserMuted(ctx: C, ev: UserMuted): void;
    onMessageDenied(ctx: C, ev: MessageDenied): void;
    onUserBanned(ctx: C, ev: UserBanned): void;
    onUserUnmuted(ctx: C, ev: UserUnmuted): void;
}
export declare function routeChatEventEventDelegate<C>(ctx: C, val: ChatEvent, delegate: IChatEventEventDelegate<C>): void;
export interface IAutoModQueueEventEventDelegate<C> {
    onAdd(ctx: C, ev: AutoModQueueEventAdd): void;
    onUpdate(ctx: C, ev: AutoModQueueEventUpdate): void;
    onRemove(ctx: C, ev: AutoModQueueEventRemove): void;
}
export declare function routeAutoModQueueEventEventDelegate<C>(ctx: C, val: AutoModQueueEvent, delegate: IAutoModQueueEventEventDelegate<C>): void;
export declare class ChatService {
    static CreateChat(req: CreateChatRequest, initReq?: fm.InitReq): Promise<Chat>;
    static GetChat(req: GetChatRequest, initReq?: fm.InitReq): Promise<GetChatResponse>;
    static ListChatUsers(req: ListChatUsersRequest, initReq?: fm.InitReq): Promise<ListChatUsersResponse>;
    static ListMessages(req: ListMessagesRequest, initReq?: fm.InitReq): Promise<ListMessagesResponse>;
    static ChatMessageStream(req: ChatMessageStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChatEvent>, initReq?: fm.InitReq): Promise<void>;
    static SendChatMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<SendMessageResponse>;
}
export declare class ChatModerationService {
    static GetChatUserStatus(req: GetChatUserStatusRequest, initReq?: fm.InitReq): Promise<GetChatUserStatusResponse>;
    static HideChatMessage(req: HideChatMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static MuteChatUser(req: MuteChatUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UnmuteChatUser(req: UnmuteChatUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static StreamAutoModQueue(req: StreamAutoModQueueRequest, entityNotifier?: fm.NotifyStreamEntityArrival<AutoModQueueEvent>, initReq?: fm.InitReq): Promise<void>;
    static AllowModerationItem(req: AllowModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DenyModerationItem(req: DenyModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ClearModerationItem(req: ClearModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetMessageContext(req: GetMessageContextRequest, initReq?: fm.InitReq): Promise<GetMessageContextResponse>;
}
export {};
//# sourceMappingURL=chat.pb.d.ts.map