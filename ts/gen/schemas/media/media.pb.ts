/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum MediaType {
  MEDIA_TYPE_UNSPECIFIED = "MEDIA_TYPE_UNSPECIFIED",
  MEDIA_TYPE_IMAGE = "MEDIA_TYPE_IMAGE",
  MEDIA_TYPE_VIDEO = "MEDIA_TYPE_VIDEO",
  MEDIA_TYPE_3D_MODEL = "MEDIA_TYPE_3D_MODEL",
}

export enum UploadMediaRequestDoneStatus {
  DONE_STATUS_UNSPECIFIED = "DONE_STATUS_UNSPECIFIED",
  DONE_STATUS_CLIENT_FAILURE = "DONE_STATUS_CLIENT_FAILURE",
  DONE_STATUS_UPLOAD_COMPLETE = "DONE_STATUS_UPLOAD_COMPLETE",
}

export type MediaReferenceCreatedEvent = {
  reference?: MediaReference
  updatedAt?: string
}

export type MediaReferenceDeletedEvent = {
  reference?: MediaReference
  updatedAt?: string
}

export type MediaReference = {
  mediaId?: string
  resourceType?: string
  resourceId?: string
  namespace?: string
}

export type Media = {
  id?: string
  type?: MediaType
  userId?: string
  url?: string
  createdAt?: string
}

export type UploadToken = {
  type?: MediaType
  resourceType?: string
  resourceId?: string
  keepOld?: boolean
  constraints?: UploadConstraint[]
  namespace?: string
  mediaId?: string
  cacheControl?: string
}


type BaseUploadConstraint = {
}

export type UploadConstraint = BaseUploadConstraint
  & OneOf<{ minWidth: string; maxWidth: string; minHeight: string; maxHeight: string; maxFileSizeBytes: string }>

export type CreateUploadTokenRequest = {
  type?: MediaType
  resourceType?: string
  resourceId?: string
  keepOld?: boolean
  constraints?: UploadConstraint[]
  namespace?: string
  mediaId?: string
  cacheControl?: string
}

export type CreateUploadTokenResponse = {
  token?: string
}

export type CreateMediaReferenceRequest = {
  mediaId?: string
  resourceType?: string
  resourceId?: string
  namespace?: string
}

export type DeleteMediaReferenceRequest = {
  mediaId?: string
  resourceType?: string
  resourceId?: string
  namespace?: string
}

export type GetMediaRequest = {
  id?: string
}

export type MediaOptions = {
  width?: string
  height?: string
}

export type BatchGetMediaUrlRequest = {
  urls?: string[]
  options?: MediaOptions
}

export type BatchGetMediaUrlResponse = {
  urls?: string[]
}

export type ListMediaRequest = {
  userId?: string
  cursor?: ApiCursor.Cursor
}

export type ListMediaResponse = {
  medias?: Media[]
  pageInfo?: ApiCursor.PageInfo
}

export type FileMeta = {
  fileName?: string
  contentType?: string
}


type BaseUploadMediaRequest = {
}

export type UploadMediaRequest = BaseUploadMediaRequest
  & OneOf<{ token: string; meta: FileMeta; data: Uint8Array; done: UploadMediaRequestDoneStatus }>




export interface IUploadConstraintConstraintDelegate<C> {
  onMinWidth(ctx: C, ev: string): void
  onMaxWidth(ctx: C, ev: string): void
  onMinHeight(ctx: C, ev: string): void
  onMaxHeight(ctx: C, ev: string): void
  onMaxFileSizeBytes(ctx: C, ev: string): void
}

export function routeUploadConstraintConstraintDelegate<C>(ctx: C, val: UploadConstraint, delegate: IUploadConstraintConstraintDelegate<C>) {
  val?.minWidth && delegate.onMinWidth(ctx, val.minWidth)
  val?.maxWidth && delegate.onMaxWidth(ctx, val.maxWidth)
  val?.minHeight && delegate.onMinHeight(ctx, val.minHeight)
  val?.maxHeight && delegate.onMaxHeight(ctx, val.maxHeight)
  val?.maxFileSizeBytes && delegate.onMaxFileSizeBytes(ctx, val.maxFileSizeBytes)
}




export interface IUploadMediaRequestContentDelegate<C> {
  onToken(ctx: C, ev: string): void
  onMeta(ctx: C, ev: FileMeta): void
  onData(ctx: C, ev: Uint8Array): void
  onDone(ctx: C, ev: UploadMediaRequestDoneStatus): void
}

export function routeUploadMediaRequestContentDelegate<C>(ctx: C, val: UploadMediaRequest, delegate: IUploadMediaRequestContentDelegate<C>) {
  val?.token && delegate.onToken(ctx, val.token)
  val?.meta && delegate.onMeta(ctx, val.meta)
  val?.data && delegate.onData(ctx, val.data)
  val?.done && delegate.onDone(ctx, val.done)
}

export class MediaService {
  static CreateUploadToken(req: CreateUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateUploadTokenResponse> {
    return fm.fetchReq<CreateUploadTokenRequest, CreateUploadTokenResponse>(`/v1/mediaUploadTokens`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UploadMedia(initReq?: fm.InitReq): Promise<fm.ClientStreamingCall<UploadMediaRequest>> {
    return fm.clientStreamingRequest<UploadMediaRequest, Media>(`/v1/media`, {...initReq})
  }
  static CreateMediaReference(req: CreateMediaReferenceRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreateMediaReferenceRequest, GoogleProtobufEmpty.Empty>(`/v1/media/${req["mediaId"]}/references`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteMediaReference(req: DeleteMediaReferenceRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteMediaReferenceRequest, GoogleProtobufEmpty.Empty>(`/v1/media/${req["mediaId"]}/references`, {...initReq, method: "DELETE"})
  }
  static GetMedia(req: GetMediaRequest, initReq?: fm.InitReq): Promise<Media> {
    return fm.fetchReq<GetMediaRequest, Media>(`/v1/media/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetMediaUrl(req: BatchGetMediaUrlRequest, initReq?: fm.InitReq): Promise<BatchGetMediaUrlResponse> {
    return fm.fetchReq<BatchGetMediaUrlRequest, BatchGetMediaUrlResponse>(`/v1/media:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListMedia(req: ListMediaRequest, initReq?: fm.InitReq): Promise<ListMediaResponse> {
    return fm.fetchReq<ListMediaRequest, ListMediaResponse>(`/v1/users/${req["userId"]}/media?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}