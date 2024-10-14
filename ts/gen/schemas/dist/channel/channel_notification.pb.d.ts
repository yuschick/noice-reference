import * as fm from "../fetch.pb";
import * as GoogleApiHttpbody from "../google/api/httpbody.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
export type LiveNotificationWorkflowEvent = {
    channelId?: string;
};
export type NotificationStatus = {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
};
export type NotificationSettings = {
    userId?: string;
    channelLiveNotification?: NotificationStatus;
};
export type GetNotificationSettingsRequest = {
    userId?: string;
};
export type UpdateNotificationSettingsParams = {
    userId?: string;
    channelLiveNotification?: NotificationStatus;
};
export type UpdateNotificationSettingsRequest = {
    body?: UpdateNotificationSettingsParams;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type UnsubscribeFromChannelNotificationsRequest = {
    token?: string;
};
export type FollowerNotificationSettings = {
    channelId?: string;
    userId?: string;
    channelLiveNotificationEnabled?: boolean;
};
export type GetFollowerNotificationSettingsRequest = {
    channelId?: string;
    userId?: string;
};
export type UpdateFollowerNotificationSettingsParams = {
    channelId?: string;
    userId?: string;
    channelLiveNotificationEnabled?: boolean;
};
export type UpdateFollowerNotificationSettingsRequest = {
    body?: UpdateFollowerNotificationSettingsParams;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export declare class ChannelNotificationService {
    static GetNotificationSettings(req: GetNotificationSettingsRequest, initReq?: fm.InitReq): Promise<NotificationSettings>;
    static UpdateNotificationSettings(req: UpdateNotificationSettingsRequest, initReq?: fm.InitReq): Promise<NotificationSettings>;
    static UnsubscribeFromChannelNotifications(req: UnsubscribeFromChannelNotificationsRequest, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody>;
    static GetFollowerNotificationSettings(req: GetFollowerNotificationSettingsRequest, initReq?: fm.InitReq): Promise<FollowerNotificationSettings>;
    static UpdateFollowerNotificationSettings(req: UpdateFollowerNotificationSettingsRequest, initReq?: fm.InitReq): Promise<FollowerNotificationSettings>;
}
//# sourceMappingURL=channel_notification.pb.d.ts.map