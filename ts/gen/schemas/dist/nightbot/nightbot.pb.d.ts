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
export declare enum Badge {
    BADGE_UNSPECIFIED = "BADGE_UNSPECIFIED",
    BADGE_NOICE_STAFF = "BADGE_NOICE_STAFF",
    BADGE_PLATFORM_MODERATOR = "BADGE_PLATFORM_MODERATOR",
    BADGE_STREAMER = "BADGE_STREAMER",
    BADGE_CHANNEL_MODERATOR = "BADGE_CHANNEL_MODERATOR",
    BADGE_SUBSCRIBER = "BADGE_SUBSCRIBER",
    BADGE_FOLLOWER = "BADGE_FOLLOWER"
}
export type UserInfo = {
    userId?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    channelId?: string;
    email?: string;
};
export type GetUserInfoRequest = {};
export type EnableNightbotRequest = {
    channelId?: string;
};
export type JoinChannelRequest = {
    channelId?: string;
};
export type LeaveChannelRequest = {
    channelId?: string;
};
export type ChannelInfo = {
    channelId?: string;
    name?: string;
    title?: string;
    enabled?: boolean;
    logoUrl?: string;
};
export type GetChannelInfoRequest = {
    channelId?: string;
};
export type SendMessageRequest = {
    channelId?: string;
    content?: string;
};
export type DeleteMessageRequest = {
    channelId?: string;
    messageId?: string;
};
export type ChatUser = {
    userId?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    badges?: Badge[];
    followedAt?: string;
};
export type ChatMessage = {
    user?: ChatUser;
    channelId?: string;
    messageId?: string;
    content?: string;
    timestamp?: string;
    emotes?: string[];
};
export type Ping = {};
type BaseChatEvent = {};
export type ChatEvent = BaseChatEvent & OneOf<{
    message: ChatMessage;
    ping: Ping;
}>;
export type EventStreamRequest = {};
export type BanUserRequest = {
    channelId?: string;
    userId?: string;
    reason?: string;
    duration?: string;
};
type BaseUserIdentity = {};
export type UserIdentity = BaseUserIdentity & OneOf<{
    userId: string;
    username: string;
}>;
export type GetChatUserRequest = {
    channelId?: string;
    identity?: UserIdentity;
};
export type UpdateChannelInfoRequest = {
    channelId?: string;
    title?: string;
};
export interface IChatEventEventDelegate<C> {
    onMessage(ctx: C, ev: ChatMessage): void;
    onPing(ctx: C, ev: Ping): void;
}
export declare function routeChatEventEventDelegate<C>(ctx: C, val: ChatEvent, delegate: IChatEventEventDelegate<C>): void;
export interface IUserIdentityIdentityDelegate<C> {
    onUserId(ctx: C, ev: string): void;
    onUsername(ctx: C, ev: string): void;
}
export declare function routeUserIdentityIdentityDelegate<C>(ctx: C, val: UserIdentity, delegate: IUserIdentityIdentityDelegate<C>): void;
export declare class NightbotService {
    static GetUserInfo(req: GetUserInfoRequest, initReq?: fm.InitReq): Promise<UserInfo>;
    static EnableNightbot(req: EnableNightbotRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static JoinChannel(req: JoinChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static LeaveChannel(req: LeaveChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetChannelInfo(req: GetChannelInfoRequest, initReq?: fm.InitReq): Promise<ChannelInfo>;
    static UpdateChannelInfo(req: UpdateChannelInfoRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetChatUser(req: GetChatUserRequest, initReq?: fm.InitReq): Promise<ChatUser>;
    static EventStream(req: EventStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChatEvent>, initReq?: fm.InitReq): Promise<void>;
    static SendMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteMessage(req: DeleteMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static BanUser(req: BanUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=nightbot.pb.d.ts.map