import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export declare enum UserDataTaskStatus {
    USER_DATA_TASK_STATUS_UNSPECIFIED = "USER_DATA_TASK_STATUS_UNSPECIFIED",
    USER_DATA_TASK_STATUS_SCHEDULED = "USER_DATA_TASK_STATUS_SCHEDULED",
    USER_DATA_TASK_STATUS_STARTED = "USER_DATA_TASK_STATUS_STARTED",
    USER_DATA_TASK_STATUS_IN_PROGRESS = "USER_DATA_TASK_STATUS_IN_PROGRESS",
    USER_DATA_TASK_STATUS_COMPLETE = "USER_DATA_TASK_STATUS_COMPLETE",
    USER_DATA_TASK_STATUS_FAILED = "USER_DATA_TASK_STATUS_FAILED"
}
export type ExportUserDataRequest = {};
export type ExportUserDataResponse = {
    taskId?: string;
};
export type DeleteUserDataRequest = {
    userId?: string;
    gracePeriod?: string;
};
export type DeleteUserDataResponse = {
    taskId?: string;
};
export type CancelDeletionRequest = {
    userId?: string;
};
export type UserDeletionScheduledEvent = {
    userId?: string;
    taskId?: string;
};
export type UserDeletionCancelledEvent = {
    userId?: string;
    taskId?: string;
};
export type ExportUserDataRequestEvent = {
    userId?: string;
    taskId?: string;
    bucketUrl?: string;
};
export type DeleteUserDataRequestEvent = {
    userId?: string;
    taskId?: string;
};
export type UserDataExportStatusEvent = {
    taskId?: string;
    status?: UserDataTaskStatus;
    serviceName?: string;
    dataPaths?: string[];
};
export type UserDataDeletionStatusEvent = {
    taskId?: string;
    status?: UserDataTaskStatus;
    serviceName?: string;
};
export type UserDataExportCompleteEvent = {
    taskId?: string;
    userId?: string;
    dataUrl?: string;
};
export declare class PrivacyService {
    static ExportUserData(req: ExportUserDataRequest, initReq?: fm.InitReq): Promise<ExportUserDataResponse>;
    static DeleteUserData(req: DeleteUserDataRequest, initReq?: fm.InitReq): Promise<DeleteUserDataResponse>;
    static CancelDeletion(req: CancelDeletionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=privacy.pb.d.ts.map