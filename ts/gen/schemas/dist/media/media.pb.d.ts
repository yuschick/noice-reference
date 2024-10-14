import * as ApiCursor from "../api/cursor.pb";
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
export declare enum MediaType {
    MEDIA_TYPE_UNSPECIFIED = "MEDIA_TYPE_UNSPECIFIED",
    MEDIA_TYPE_IMAGE = "MEDIA_TYPE_IMAGE",
    MEDIA_TYPE_VIDEO = "MEDIA_TYPE_VIDEO",
    MEDIA_TYPE_3D_MODEL = "MEDIA_TYPE_3D_MODEL"
}
export declare enum UploadMediaRequestDoneStatus {
    DONE_STATUS_UNSPECIFIED = "DONE_STATUS_UNSPECIFIED",
    DONE_STATUS_CLIENT_FAILURE = "DONE_STATUS_CLIENT_FAILURE",
    DONE_STATUS_UPLOAD_COMPLETE = "DONE_STATUS_UPLOAD_COMPLETE"
}
export type MediaReferenceCreatedEvent = {
    reference?: MediaReference;
    updatedAt?: string;
};
export type MediaReferenceDeletedEvent = {
    reference?: MediaReference;
    updatedAt?: string;
};
export type MediaReference = {
    mediaId?: string;
    resourceType?: string;
    resourceId?: string;
    namespace?: string;
};
export type Media = {
    id?: string;
    type?: MediaType;
    userId?: string;
    url?: string;
    createdAt?: string;
};
export type UploadToken = {
    type?: MediaType;
    resourceType?: string;
    resourceId?: string;
    keepOld?: boolean;
    constraints?: UploadConstraint[];
    namespace?: string;
    mediaId?: string;
    cacheControl?: string;
};
type BaseUploadConstraint = {};
export type UploadConstraint = BaseUploadConstraint & OneOf<{
    minWidth: string;
    maxWidth: string;
    minHeight: string;
    maxHeight: string;
    maxFileSizeBytes: string;
}>;
export type CreateUploadTokenRequest = {
    type?: MediaType;
    resourceType?: string;
    resourceId?: string;
    keepOld?: boolean;
    constraints?: UploadConstraint[];
    namespace?: string;
    mediaId?: string;
    cacheControl?: string;
};
export type CreateUploadTokenResponse = {
    token?: string;
};
export type CreateMediaReferenceRequest = {
    mediaId?: string;
    resourceType?: string;
    resourceId?: string;
    namespace?: string;
};
export type DeleteMediaReferenceRequest = {
    mediaId?: string;
    resourceType?: string;
    resourceId?: string;
    namespace?: string;
};
export type GetMediaRequest = {
    id?: string;
};
export type MediaOptions = {
    width?: string;
    height?: string;
};
export type BatchGetMediaUrlRequest = {
    urls?: string[];
    options?: MediaOptions;
};
export type BatchGetMediaUrlResponse = {
    urls?: string[];
};
export type ListMediaRequest = {
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListMediaResponse = {
    medias?: Media[];
    pageInfo?: ApiCursor.PageInfo;
};
export type FileMeta = {
    fileName?: string;
    contentType?: string;
};
type BaseUploadMediaRequest = {};
export type UploadMediaRequest = BaseUploadMediaRequest & OneOf<{
    token: string;
    meta: FileMeta;
    data: Uint8Array;
    done: UploadMediaRequestDoneStatus;
}>;
export interface IUploadConstraintConstraintDelegate<C> {
    onMinWidth(ctx: C, ev: string): void;
    onMaxWidth(ctx: C, ev: string): void;
    onMinHeight(ctx: C, ev: string): void;
    onMaxHeight(ctx: C, ev: string): void;
    onMaxFileSizeBytes(ctx: C, ev: string): void;
}
export declare function routeUploadConstraintConstraintDelegate<C>(ctx: C, val: UploadConstraint, delegate: IUploadConstraintConstraintDelegate<C>): void;
export interface IUploadMediaRequestContentDelegate<C> {
    onToken(ctx: C, ev: string): void;
    onMeta(ctx: C, ev: FileMeta): void;
    onData(ctx: C, ev: Uint8Array): void;
    onDone(ctx: C, ev: UploadMediaRequestDoneStatus): void;
}
export declare function routeUploadMediaRequestContentDelegate<C>(ctx: C, val: UploadMediaRequest, delegate: IUploadMediaRequestContentDelegate<C>): void;
export declare class MediaService {
    static CreateUploadToken(req: CreateUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateUploadTokenResponse>;
    static UploadMedia(initReq?: fm.InitReq): Promise<fm.ClientStreamingCall<UploadMediaRequest>>;
    static CreateMediaReference(req: CreateMediaReferenceRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteMediaReference(req: DeleteMediaReferenceRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetMedia(req: GetMediaRequest, initReq?: fm.InitReq): Promise<Media>;
    static BatchGetMediaUrl(req: BatchGetMediaUrlRequest, initReq?: fm.InitReq): Promise<BatchGetMediaUrlResponse>;
    static ListMedia(req: ListMediaRequest, initReq?: fm.InitReq): Promise<ListMediaResponse>;
}
export {};
//# sourceMappingURL=media.pb.d.ts.map