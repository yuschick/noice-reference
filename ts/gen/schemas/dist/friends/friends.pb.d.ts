import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum FriendStatusUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_FRIEND_INVITATION = "UPDATE_TYPE_FRIEND_INVITATION",
    UPDATE_TYPE_INVITATION_ACCEPTED = "UPDATE_TYPE_INVITATION_ACCEPTED",
    UPDATE_TYPE_USER_UNFRIENDED = "UPDATE_TYPE_USER_UNFRIENDED",
    UPDATE_TYPE_USER_BLOCKED = "UPDATE_TYPE_USER_BLOCKED",
    UPDATE_TYPE_USER_UNBLOCKED = "UPDATE_TYPE_USER_UNBLOCKED",
    UPDATE_TYPE_INVITATION_CANCELLED = "UPDATE_TYPE_INVITATION_CANCELLED"
}
export declare enum FriendshipStatusStatus {
    STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
    STATUS_FRIEND = "STATUS_FRIEND",
    STATUS_FRIEND_REQUEST_SENT = "STATUS_FRIEND_REQUEST_SENT",
    STATUS_FRIEND_REQUEST_RECEIVED = "STATUS_FRIEND_REQUEST_RECEIVED",
    STATUS_BLOCKED = "STATUS_BLOCKED",
    STATUS_BLOCKED_BY = "STATUS_BLOCKED_BY"
}
export type User = {
    userId?: string;
    lastStatusChange?: string;
    activity?: Activity;
};
export type SendFriendRequestRequest = {
    userId?: string;
    friendId?: string;
};
export type SendFriendRequestResponse = {
    friendId?: string;
};
type BaseListFriendsRequestFilter = {};
export type ListFriendsRequestFilter = BaseListFriendsRequestFilter & OneOf<{
    isOnline: boolean;
    channelId: string;
    streamId: string;
}>;
export type ListFriendsRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
    filters?: ListFriendsRequestFilter[];
    priorityOrder?: boolean;
};
export type ListFriendsResponse = {
    users?: User[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListFriendRequestsRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListFriendRequestsResponse = {
    users?: User[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListSentFriendRequestsRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListSentFriendRequestsResponse = {
    users?: User[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListReceivedFriendRequestsRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListReceivedFriendRequestsResponse = {
    users?: User[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListBlockedUsersRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListBlockedUsersResponse = {
    users?: User[];
    pageInfo?: ApiCursor.PageInfo;
};
type BaseListMutuallyBlockedUsersRequestFilter = {};
export type ListMutuallyBlockedUsersRequestFilter = BaseListMutuallyBlockedUsersRequestFilter & OneOf<{
    channelId: string;
}>;
export type ListMutuallyBlockedUsersRequest = {
    userId?: string;
    filters?: ListMutuallyBlockedUsersRequestFilter[];
};
export type ListMutuallyBlockedUsersResponse = {
    users?: User[];
};
export type AddFriendRequest = {
    userId?: string;
    friendId?: string;
};
export type DeleteFriendRequest = {
    userId?: string;
    friendId?: string;
};
export type AcceptFriendRequestRequest = {
    userId?: string;
    friendId?: string;
};
export type AcceptFriendRequestResponse = {
    friendId?: string;
};
export type DeleteFriendRequestRequest = {
    userId?: string;
    friendId?: string;
};
export type BlockUserRequest = {
    userId?: string;
    blockedUserId?: string;
};
export type BlockUserResponse = {
    blockedUserId?: string;
};
export type UnblockUserRequest = {
    userId?: string;
    blockedUserId?: string;
};
export type UnblockUserResponse = {
    unblockedUserId?: string;
};
export type FriendStatusUpdateEvent = {
    actorUserId?: string;
    targetUserId?: string;
    type?: FriendStatusUpdateEventUpdateType;
};
export type Activity = {
    isOnline?: boolean;
    channelId?: string;
    streamId?: string;
};
export type FriendshipStatus = {
    status?: FriendshipStatusStatus;
    lastStatusChange?: string;
    activity?: Activity;
};
export type GetFriendshipStatusRequest = {
    userId?: string;
    friendIds?: string[];
};
export type GetFriendshipStatusResponse = {
    statuses?: FriendshipStatus[];
};
export type FriendsSettings = {
    disableFriendRequests?: boolean;
};
export type GetFriendsSettingsRequest = {
    userId?: string;
};
export type UpdateFriendsSettingsRequest = {
    userId?: string;
    body?: FriendsSettings;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type GetChannelActiveFriendsRequest = {
    userId?: string;
    channelIds?: string[];
};
export type ChannelFriends = {
    channelId?: string;
    users?: User[];
    totalCount?: string;
};
export type GetChannelActiveFriendsResponse = {
    channelFriends?: ChannelFriends[];
};
export interface IListFriendsRequestFilterFilterDelegate<C> {
    onIsOnline(ctx: C, ev: boolean): void;
    onChannelId(ctx: C, ev: string): void;
    onStreamId(ctx: C, ev: string): void;
}
export declare function routeListFriendsRequestFilterFilterDelegate<C>(ctx: C, val: ListFriendsRequestFilter, delegate: IListFriendsRequestFilterFilterDelegate<C>): void;
export interface IListMutuallyBlockedUsersRequestFilterFilterDelegate<C> {
    onChannelId(ctx: C, ev: string): void;
}
export declare function routeListMutuallyBlockedUsersRequestFilterFilterDelegate<C>(ctx: C, val: ListMutuallyBlockedUsersRequestFilter, delegate: IListMutuallyBlockedUsersRequestFilterFilterDelegate<C>): void;
export declare class FriendsService {
    static SendFriendRequest(req: SendFriendRequestRequest, initReq?: fm.InitReq): Promise<SendFriendRequestResponse>;
    static ListFriends(req: ListFriendsRequest, initReq?: fm.InitReq): Promise<ListFriendsResponse>;
    static ListSentFriendRequests(req: ListSentFriendRequestsRequest, initReq?: fm.InitReq): Promise<ListSentFriendRequestsResponse>;
    static ListReceivedFriendRequests(req: ListReceivedFriendRequestsRequest, initReq?: fm.InitReq): Promise<ListReceivedFriendRequestsResponse>;
    static ListBlockedUsers(req: ListBlockedUsersRequest, initReq?: fm.InitReq): Promise<ListBlockedUsersResponse>;
    static ListMutuallyBlockedUsers(req: ListMutuallyBlockedUsersRequest, initReq?: fm.InitReq): Promise<ListMutuallyBlockedUsersResponse>;
    static AddFriend(req: AddFriendRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteFriend(req: DeleteFriendRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static AcceptFriendRequest(req: AcceptFriendRequestRequest, initReq?: fm.InitReq): Promise<AcceptFriendRequestResponse>;
    static DeleteFriendRequest(req: DeleteFriendRequestRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static BlockUser(req: BlockUserRequest, initReq?: fm.InitReq): Promise<BlockUserResponse>;
    static UnblockUser(req: UnblockUserRequest, initReq?: fm.InitReq): Promise<UnblockUserResponse>;
    static GetFriendshipStatus(req: GetFriendshipStatusRequest, initReq?: fm.InitReq): Promise<GetFriendshipStatusResponse>;
    static GetFriendsSettings(req: GetFriendsSettingsRequest, initReq?: fm.InitReq): Promise<FriendsSettings>;
    static UpdateFriendsSettings(req: UpdateFriendsSettingsRequest, initReq?: fm.InitReq): Promise<FriendsSettings>;
    static GetChannelActiveFriends(req: GetChannelActiveFriendsRequest, initReq?: fm.InitReq): Promise<GetChannelActiveFriendsResponse>;
}
export {};
//# sourceMappingURL=friends.pb.d.ts.map