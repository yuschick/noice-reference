/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"

export enum UserDataTaskStatus {
  USER_DATA_TASK_STATUS_UNSPECIFIED = "USER_DATA_TASK_STATUS_UNSPECIFIED",
  USER_DATA_TASK_STATUS_SCHEDULED = "USER_DATA_TASK_STATUS_SCHEDULED",
  USER_DATA_TASK_STATUS_STARTED = "USER_DATA_TASK_STATUS_STARTED",
  USER_DATA_TASK_STATUS_IN_PROGRESS = "USER_DATA_TASK_STATUS_IN_PROGRESS",
  USER_DATA_TASK_STATUS_COMPLETE = "USER_DATA_TASK_STATUS_COMPLETE",
  USER_DATA_TASK_STATUS_FAILED = "USER_DATA_TASK_STATUS_FAILED",
}

export type ExportUserDataRequest = {
}

export type ExportUserDataResponse = {
  taskId?: string
}

export type DeleteUserDataRequest = {
  userId?: string
  gracePeriod?: string
}

export type DeleteUserDataResponse = {
  taskId?: string
}

export type CancelDeletionRequest = {
  userId?: string
}

export type UserDeletionScheduledEvent = {
  userId?: string
  taskId?: string
}

export type UserDeletionCancelledEvent = {
  userId?: string
  taskId?: string
}

export type ExportUserDataRequestEvent = {
  userId?: string
  taskId?: string
  bucketUrl?: string
}

export type DeleteUserDataRequestEvent = {
  userId?: string
  taskId?: string
}

export type UserDataExportStatusEvent = {
  taskId?: string
  status?: UserDataTaskStatus
  serviceName?: string
  dataPaths?: string[]
}

export type UserDataDeletionStatusEvent = {
  taskId?: string
  status?: UserDataTaskStatus
  serviceName?: string
}

export type UserDataExportCompleteEvent = {
  taskId?: string
  userId?: string
  dataUrl?: string
}

export class PrivacyService {
  static ExportUserData(req: ExportUserDataRequest, initReq?: fm.InitReq): Promise<ExportUserDataResponse> {
    return fm.fetchReq<ExportUserDataRequest, ExportUserDataResponse>(`/v1/privacy:export_user_data`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteUserData(req: DeleteUserDataRequest, initReq?: fm.InitReq): Promise<DeleteUserDataResponse> {
    return fm.fetchReq<DeleteUserDataRequest, DeleteUserDataResponse>(`/v1/privacy:delete_user_data`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CancelDeletion(req: CancelDeletionRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CancelDeletionRequest, GoogleProtobufEmpty.Empty>(`/v1/privacy:cancel_deletion`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}