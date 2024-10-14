import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleApiHttpbody from "../google/api/httpbody.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum ReportCaseStatus {
    REPORT_CASE_STATUS_UNSPECIFIED = "REPORT_CASE_STATUS_UNSPECIFIED",
    REPORT_CASE_STATUS_OPEN = "REPORT_CASE_STATUS_OPEN",
    REPORT_CASE_STATUS_CLOSED = "REPORT_CASE_STATUS_CLOSED"
}
export declare enum ReportCaseResolution {
    REPORT_CASE_RESOLUTION_UNSPECIFIED = "REPORT_CASE_RESOLUTION_UNSPECIFIED",
    REPORT_CASE_RESOLUTION_ALLOW_CONTENT = "REPORT_CASE_RESOLUTION_ALLOW_CONTENT",
    REPORT_CASE_RESOLUTION_REMOVE_CONTENT = "REPORT_CASE_RESOLUTION_REMOVE_CONTENT"
}
export declare enum ReportReason {
    REPORT_REASON_UNSPECIFIED = "REPORT_REASON_UNSPECIFIED",
    REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE = "REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE",
    REPORT_REASON_CHILD_SAFETY_DANGEROUS = "REPORT_REASON_CHILD_SAFETY_DANGEROUS",
    REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER = "REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER",
    REPORT_REASON_CHILD_SAFETY_CSE = "REPORT_REASON_CHILD_SAFETY_CSE",
    REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE = "REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE",
    REPORT_REASON_GRAPHIC_MEDIA_GORE = "REPORT_REASON_GRAPHIC_MEDIA_GORE",
    REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE = "REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE",
    REPORT_REASON_HARASSMENT = "REPORT_REASON_HARASSMENT",
    REPORT_REASON_HARASSMENT_BLACKMAIL = "REPORT_REASON_HARASSMENT_BLACKMAIL",
    REPORT_REASON_HARASSMENT_INCITEMENT = "REPORT_REASON_HARASSMENT_INCITEMENT",
    REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES = "REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES",
    REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL = "REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL",
    REPORT_REASON_HARASSMENT_STALKING = "REPORT_REASON_HARASSMENT_STALKING",
    REPORT_REASON_HATEFUL_BEHAVIOR = "REPORT_REASON_HATEFUL_BEHAVIOR",
    REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE = "REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE",
    REPORT_REASON_ILLEGAL_DRUGS = "REPORT_REASON_ILLEGAL_DRUGS",
    REPORT_REASON_ILLEGAL_MANIPULATION = "REPORT_REASON_ILLEGAL_MANIPULATION",
    REPORT_REASON_ILLEGAL_SPAM = "REPORT_REASON_ILLEGAL_SPAM",
    REPORT_REASON_ILLEGAL_ACTIVITY_SALE = "REPORT_REASON_ILLEGAL_ACTIVITY_SALE",
    REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS = "REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS",
    REPORT_REASON_IMPERSONATION = "REPORT_REASON_IMPERSONATION",
    REPORT_REASON_INAUTHENTIC_GAMEPLAY = "REPORT_REASON_INAUTHENTIC_GAMEPLAY",
    REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY = "REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY",
    REPORT_REASON_OFF_PLATFORM = "REPORT_REASON_OFF_PLATFORM",
    REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE = "REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE",
    REPORT_REASON_RESTRICTED_GAMES_MATURE = "REPORT_REASON_RESTRICTED_GAMES_MATURE",
    REPORT_REASON_SELF_HARM = "REPORT_REASON_SELF_HARM",
    REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT = "REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT",
    REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE = "REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE",
    REPORT_REASON_SPAM = "REPORT_REASON_SPAM",
    REPORT_REASON_SPAM_SUSPENSION_EVASION = "REPORT_REASON_SPAM_SUSPENSION_EVASION",
    REPORT_REASON_UNKNOWN = "REPORT_REASON_UNKNOWN",
    REPORT_REASON_VIOLENCE_EXTREMISM = "REPORT_REASON_VIOLENCE_EXTREMISM",
    REPORT_REASON_PLATFORM_RULES_VIOLATION = "REPORT_REASON_PLATFORM_RULES_VIOLATION"
}
export declare enum ReportContextUserTarget {
    TARGET_UNSPECIFIED = "TARGET_UNSPECIFIED",
    TARGET_NAME = "TARGET_NAME"
}
export declare enum ReportContextChannelTarget {
    TARGET_UNSPECIFIED = "TARGET_UNSPECIFIED",
    TARGET_NAME = "TARGET_NAME",
    TARGET_DESCRIPTION = "TARGET_DESCRIPTION"
}
export type CreateTicketRequest = {
    subject?: string;
    description?: string;
};
export type Article = {
    id?: string;
    locale?: string;
    title?: string;
    body?: string;
};
export type GetArticleRequest = {
    id?: string;
    locale?: string;
    attachmentBaseUrl?: string;
};
export type GetAttachmentRequest = {
    id?: string;
    locale?: string;
};
export type CreateZendeskTokenResponse = {
    token?: string;
};
export type ReportCase = {
    id?: string;
    createdAt?: string;
    status?: ReportCaseStatus;
    context?: ReportContext;
    closedBy?: string;
    closedAt?: string;
    moderatorComment?: string;
    resolution?: ReportCaseResolution;
    firstReporterId?: string;
    firstReason?: ReportReason;
    firstDescription?: string;
};
export type ReportCaseUpdateEvent = {
    reportCase?: ReportCase;
    updatedAt?: string;
};
export type Report = {
    id?: string;
    caseId?: string;
    userId?: string;
    createdAt?: string;
    reason?: ReportReason;
    context?: ReportContext;
    description?: string;
};
export type ReportContextUser = {
    userId?: string;
    target?: ReportContextUserTarget;
};
export type ReportContextChannel = {
    channelId?: string;
    target?: ReportContextChannelTarget;
};
export type ReportContextStream = {
    userId?: string;
    channelId?: string;
    streamId?: string;
    startAt?: string;
};
export type ReportContextChatMessage = {
    userId?: string;
    channelId?: string;
    chatId?: string;
    messageId?: string;
};
type BaseReportContext = {};
export type ReportContext = BaseReportContext & OneOf<{
    user: ReportContextUser;
    channel: ReportContextChannel;
    stream: ReportContextStream;
    chatMessage: ReportContextChatMessage;
}>;
export type CreateReportRequest = {
    reason?: ReportReason;
    description?: string;
    context?: ReportContext;
};
export type ReportsFilter = {
    caseId?: string;
};
export type ListReportsRequest = {
    filter?: ReportsFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListReportsResponse = {
    reports?: Report[];
    pageInfo?: ApiCursor.PageInfo;
};
export type GetReportCaseRequest = {
    id?: string;
};
export type BatchGetReportsRequest = {
    ids?: string[];
};
export type BatchGetReportsResponse = {
    reports?: Report[];
};
export type ResolveReportCaseRequest = {
    id?: string;
    resolution?: ReportCaseResolution;
};
export interface IReportContextValueDelegate<C> {
    onUser(ctx: C, ev: ReportContextUser): void;
    onChannel(ctx: C, ev: ReportContextChannel): void;
    onStream(ctx: C, ev: ReportContextStream): void;
    onChatMessage(ctx: C, ev: ReportContextChatMessage): void;
}
export declare function routeReportContextValueDelegate<C>(ctx: C, val: ReportContext, delegate: IReportContextValueDelegate<C>): void;
export declare class SupportService {
    static CreateTicket(req: CreateTicketRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetArticle(req: GetArticleRequest, initReq?: fm.InitReq): Promise<Article>;
    static GetAttachment(req: GetAttachmentRequest, entityNotifier?: fm.NotifyStreamEntityArrival<GoogleApiHttpbody.HttpBody>, initReq?: fm.InitReq): Promise<void>;
    static CreateZendeskToken(req: GoogleProtobufEmpty.Empty, initReq?: fm.InitReq): Promise<CreateZendeskTokenResponse>;
    static CreateReport(req: CreateReportRequest, initReq?: fm.InitReq): Promise<Report>;
    static ListReports(req: ListReportsRequest, initReq?: fm.InitReq): Promise<ListReportsResponse>;
    static GetReportCase(req: GetReportCaseRequest, initReq?: fm.InitReq): Promise<ReportCase>;
    static BatchGetReports(req: BatchGetReportsRequest, initReq?: fm.InitReq): Promise<BatchGetReportsResponse>;
    static ResolveReportCase(req: ResolveReportCaseRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=support.pb.d.ts.map