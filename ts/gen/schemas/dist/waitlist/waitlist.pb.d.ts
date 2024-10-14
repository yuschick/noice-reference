import * as ApiCursor from "../api/cursor.pb";
import * as AuthAuth from "../auth/auth.pb";
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
export declare enum WaitlistUpdateEventOperation {
    OPERATION_UNSPECIFIED = "OPERATION_UNSPECIFIED",
    OPERATION_CREATED = "OPERATION_CREATED",
    OPERATION_DELETED = "OPERATION_DELETED"
}
export type WaitlistUpdateEvent = {
    operation?: WaitlistUpdateEventOperation;
    userId?: string;
    updatedAt?: string;
};
export type WaitlistUser = {
    userId?: string;
    signupOrigin?: AuthAuth.SignupOrigin;
    createdAt?: string;
};
export type ListWaitlistOriginsRequest = {};
export type ListWaitlistOriginsResponse = {
    origins?: AuthAuth.SignupOrigin[];
};
export type WaitlistFilterChannels = {
    channelIds?: string[];
};
type BaseWaitlistFilter = {};
export type WaitlistFilter = BaseWaitlistFilter & OneOf<{
    channelId: string;
    channels: WaitlistFilterChannels;
}>;
export type ListWaitlistUsersRequest = {
    filters?: WaitlistFilter[];
    cursor?: ApiCursor.Cursor;
};
export type ListWaitlistUsersResponse = {
    users?: WaitlistUser[];
    pageInfo?: ApiCursor.PageInfo;
    totalCount?: number;
};
export type DeleteWaitlistUserRequest = {
    userId?: string;
};
export type ChannelWaitlistSettings = {
    maxSignupsPerStream?: number;
    signupStreamDuration?: string;
};
export type GetChannelWaitlistSettingsRequest = {
    channelId?: string;
};
export type UpdateChannelWaitlistSettingsRequest = {
    channelId?: string;
    maxSignupsPerStream?: number;
    signupStreamDuration?: string;
};
export interface IWaitlistFilterFilterDelegate<C> {
    onChannelId(ctx: C, ev: string): void;
    onChannels(ctx: C, ev: WaitlistFilterChannels): void;
}
export declare function routeWaitlistFilterFilterDelegate<C>(ctx: C, val: WaitlistFilter, delegate: IWaitlistFilterFilterDelegate<C>): void;
export declare class WaitlistService {
    static ListWaitlistUsers(req: ListWaitlistUsersRequest, initReq?: fm.InitReq): Promise<ListWaitlistUsersResponse>;
    static DeleteWaitlistUser(req: DeleteWaitlistUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetChannelWaitlistSettings(req: GetChannelWaitlistSettingsRequest, initReq?: fm.InitReq): Promise<ChannelWaitlistSettings>;
    static ListWaitlistOrigins(req: ListWaitlistOriginsRequest, initReq?: fm.InitReq): Promise<ListWaitlistOriginsResponse>;
    static UpdateChannelWaitlistSettings(req: UpdateChannelWaitlistSettingsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=waitlist.pb.d.ts.map