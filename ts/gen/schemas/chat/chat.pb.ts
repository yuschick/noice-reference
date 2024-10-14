/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AccessAccess from "../access/access.pb"
import * as ApiCursor from "../api/cursor.pb"
import * as ApiEntity from "../api/entity.pb"
import * as BadgeBadge from "../badge/badge.pb"
import * as ClassificationClassification from "../classification/classification.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufDuration from "../google/protobuf/duration.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as ProfileProfile from "../profile/profile.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum ChatRole {
  CHAT_ROLE_UNSPECIFIED = "CHAT_ROLE_UNSPECIFIED",
  CHAT_ROLE_MEMBER = "CHAT_ROLE_MEMBER",
  CHAT_ROLE_STREAMER = "CHAT_ROLE_STREAMER",
  CHAT_ROLE_MODERATOR = "CHAT_ROLE_MODERATOR",
  CHAT_ROLE_PLATFORM_MODERATOR = "CHAT_ROLE_PLATFORM_MODERATOR",
}

export enum ModerationStatus {
  MODERATION_STATUS_UNSPECIFIED = "MODERATION_STATUS_UNSPECIFIED",
  MODERATION_STATUS_APPROVED = "MODERATION_STATUS_APPROVED",
}

export enum AutomodLevel {
  AUTOMOD_LEVEL_UNSPECIFIED = "AUTOMOD_LEVEL_UNSPECIFIED",
  AUTOMOD_LEVEL_LOW = "AUTOMOD_LEVEL_LOW",
  AUTOMOD_LEVEL_HIGH = "AUTOMOD_LEVEL_HIGH",
}

export enum Reason {
  REASON_UNSPECIFIED = "REASON_UNSPECIFIED",
  REASON_SPAM = "REASON_SPAM",
  REASON_OTHER = "REASON_OTHER",
}

export enum AutomodDecision {
  AUTOMOD_DECISION_UNSPECIFIED = "AUTOMOD_DECISION_UNSPECIFIED",
  AUTOMOD_DECISION_ACCEPTED = "AUTOMOD_DECISION_ACCEPTED",
  AUTOMOD_DECISION_REJECTED = "AUTOMOD_DECISION_REJECTED",
}

export enum UserLabel {
  USER_LABEL_UNSPECIFIED = "USER_LABEL_UNSPECIFIED",
  USER_LABEL_STREAMER = "USER_LABEL_STREAMER",
  USER_LABEL_MODERATOR = "USER_LABEL_MODERATOR",
  USER_LABEL_STAFF = "USER_LABEL_STAFF",
  USER_LABEL_VIEWER = "USER_LABEL_VIEWER",
}

export enum ContentValidationErrorDetailsCause {
  CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
  CAUSE_GUIDELINES_VIOLATION = "CAUSE_GUIDELINES_VIOLATION",
  CAUSE_REQUIRES_MODERATION = "CAUSE_REQUIRES_MODERATION",
  CAUSE_TEMPORARY_MUTED = "CAUSE_TEMPORARY_MUTED",
  CAUSE_TEMPORARY_THROTTLED = "CAUSE_TEMPORARY_THROTTLED",
  CAUSE_SPAM = "CAUSE_SPAM",
}

export enum ModerationItemStatus {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  STATUS_PENDING = "STATUS_PENDING",
  STATUS_ALLOWED = "STATUS_ALLOWED",
  STATUS_DENIED = "STATUS_DENIED",
}

export type ChatCreatedEvent = {
  chat?: Chat
}

export type ChatDetails = {
  chatId?: string
  roles?: ChatRole[]
}


type BaseMessageContent = {
}

export type MessageContent = BaseMessageContent
  & OneOf<{ textContent: TextMessage; tombstone: Tombstone }>

export type Tombstone = {
}

export type TextMessageAttachment = {
  label?: string
  source?: string
  startIndex?: number
  endIndex?: number
  itemId?: string
}

export type TextMessageLink = {
  startIndex?: number
  endIndex?: number
  url?: string
}

export type TextMessage = {
  text?: string
  attachments?: TextMessageAttachment[]
  links?: TextMessageLink[]
}

export type SenderInfo = {
  userId?: string
  username?: string
  avatar2D?: string
  preferredColor?: ProfileProfile.Color
  badges?: BadgeBadge.Badge[]
  label?: UserLabel
  roles?: ChatRole[]
}

export type ChatMessage = {
  chatId?: string
  messageId?: string
  senderId?: string
  username?: string
  content?: MessageContent
  createdAt?: string
  state?: ApiEntity.EntityState
  textClassification?: ClassificationClassification.TextClassification
  moderationStatus?: ModerationStatus
  senderInfo?: SenderInfo
}

export type HideMessage = {
  chatId?: string
  messageId?: string
}

export type UserMuted = {
  chatId?: string
  moderatorId?: string
  userId?: string
  duration?: string
  reason?: Reason
  description?: string
}

export type UserUnmuted = {
  chatId?: string
  moderatorId?: string
  userId?: string
}

export type UserBanned = {
  chatId?: string
  moderatorId?: string
  userId?: string
}

export type MessageDenied = {
  chatId?: string
  messageId?: string
  userId?: string
}

export type Ping = {
  seq?: number
}


type BaseChatEvent = {
  cid?: number
  chatId?: string
}

export type ChatEvent = BaseChatEvent
  & OneOf<{ chatDetails: ChatDetails; message: ChatMessage; hideMessage: HideMessage; userMuted: UserMuted; messageDenied: MessageDenied; userBanned: UserBanned; userUnmuted: UserUnmuted; ping: Ping }>

export type SendMessage = {
  chatId?: string
  content?: MessageContent
}

export type JoinChat = {
  target?: string
}

export type LeaveChat = {
  chatId?: string
}

export type ListMessagesRequest = {
  chatId?: string
  cursor?: ApiCursor.Cursor
}

export type ListMessagesResponse = {
  messages?: ChatMessage[]
  pageInfo?: ApiCursor.PageInfo
}

export type GetChatRequest = {
  target?: string
}

export type GetChatResponse = {
  chatId?: string
}

export type GetChatInfoRequest = {
  chatId?: string
}

export type Meta = {
  permits?: AccessAccess.Permit[]
  autoModLevel?: AutomodLevel
  attributes?: {[key: string]: string}
  autoModDefaultDecision?: AutomodDecision
}

export type Chat = {
  id?: string
  target?: string
  accessMeta?: Meta
}

export type CreateChatRequest = {
  target?: string
  accessMeta?: Meta
}

export type ChatMessageStreamRequest = {
  chatId?: string
}

export type SendMessageRequest = {
  chatId?: string
  content?: MessageContent
  consentToModeration?: boolean
}

export type SendMessageResponse = {
  messageId?: string
}

export type GetChatUserStatusRequest = {
  chatId?: string
  userId?: string
}

export type GetChatUserStatusResponse = {
  muted?: boolean
  muteDuration?: string
}

export type HideChatMessageRequest = {
  chatId?: string
  messageId?: string
}

export type ContentValidationErrorDetails = {
  cause?: ContentValidationErrorDetailsCause
}

export type MuteChatUserRequest = {
  chatId?: string
  userId?: string
  duration?: string
  reason?: Reason
  description?: string
}

export type UnmuteChatUserRequest = {
  chatId?: string
  userId?: string
}

export type ModerationItem = {
  id?: string
  chatMessage?: ChatMessage
  status?: ModerationItemStatus
  expiresAt?: string
  expired?: boolean
  reviewerId?: string
}

export type StreamAutoModQueueRequest = {
  chatId?: string
}

export type AutoModQueueEventAdd = {
  item?: ModerationItem
}

export type AutoModQueueEventUpdate = {
  item?: ModerationItem
}

export type AutoModQueueEventRemove = {
  id?: string
}


type BaseAutoModQueueEvent = {
}

export type AutoModQueueEvent = BaseAutoModQueueEvent
  & OneOf<{ add: AutoModQueueEventAdd; update: AutoModQueueEventUpdate; remove: AutoModQueueEventRemove }>

export type AutomodDecisionEvent = {
  userId?: string
  chatId?: string
  reviewerId?: string
  timestamp?: string
  messageContent?: MessageContent
  decision?: AutomodDecision
  messageId?: string
}

export type AllowModerationItemRequest = {
  chatId?: string
  moderationItemId?: string
}

export type DenyModerationItemRequest = {
  chatId?: string
  moderationItemId?: string
}

export type ClearModerationItemRequest = {
  chatId?: string
  moderationItemId?: string
}

export type GetMessageContextRequest = {
  chatId?: string
  messageId?: string
}

export type GetMessageContextResponse = {
  messages?: ChatMessage[]
  channelName?: string
  chatName?: string
}

export type ListChatUsersRequest = {
  chatId?: string
  userLabel?: UserLabel
  sortBy?: string
  limit?: string
}

export type ChatUser = {
  userId?: string
  label?: UserLabel
  senderInfo?: SenderInfo
}

export type ListChatUsersResponse = {
  users?: ChatUser[]
}




export interface IMessageContentContentDelegate<C> {
  onTextContent(ctx: C, ev: TextMessage): void
  onTombstone(ctx: C, ev: Tombstone): void
}

export function routeMessageContentContentDelegate<C>(ctx: C, val: MessageContent, delegate: IMessageContentContentDelegate<C>) {
  val?.textContent && delegate.onTextContent(ctx, val.textContent)
  val?.tombstone && delegate.onTombstone(ctx, val.tombstone)
}




export interface IChatEventEventDelegate<C> {
  onChatDetails(ctx: C, ev: ChatDetails): void
  onMessage(ctx: C, ev: ChatMessage): void
  onHideMessage(ctx: C, ev: HideMessage): void
  onUserMuted(ctx: C, ev: UserMuted): void
  onMessageDenied(ctx: C, ev: MessageDenied): void
  onUserBanned(ctx: C, ev: UserBanned): void
  onUserUnmuted(ctx: C, ev: UserUnmuted): void
  onPing(ctx: C, ev: Ping): void
}

export function routeChatEventEventDelegate<C>(ctx: C, val: ChatEvent, delegate: IChatEventEventDelegate<C>) {
  val?.chatDetails && delegate.onChatDetails(ctx, val.chatDetails)
  val?.message && delegate.onMessage(ctx, val.message)
  val?.hideMessage && delegate.onHideMessage(ctx, val.hideMessage)
  val?.userMuted && delegate.onUserMuted(ctx, val.userMuted)
  val?.messageDenied && delegate.onMessageDenied(ctx, val.messageDenied)
  val?.userBanned && delegate.onUserBanned(ctx, val.userBanned)
  val?.userUnmuted && delegate.onUserUnmuted(ctx, val.userUnmuted)
  val?.ping && delegate.onPing(ctx, val.ping)
}




export interface IAutoModQueueEventEventDelegate<C> {
  onAdd(ctx: C, ev: AutoModQueueEventAdd): void
  onUpdate(ctx: C, ev: AutoModQueueEventUpdate): void
  onRemove(ctx: C, ev: AutoModQueueEventRemove): void
}

export function routeAutoModQueueEventEventDelegate<C>(ctx: C, val: AutoModQueueEvent, delegate: IAutoModQueueEventEventDelegate<C>) {
  val?.add && delegate.onAdd(ctx, val.add)
  val?.update && delegate.onUpdate(ctx, val.update)
  val?.remove && delegate.onRemove(ctx, val.remove)
}

export class ChatService {
  static CreateChat(req: CreateChatRequest, initReq?: fm.InitReq): Promise<Chat> {
    return fm.fetchReq<CreateChatRequest, Chat>(`/v1/chats`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChat(req: GetChatRequest, initReq?: fm.InitReq): Promise<GetChatResponse> {
    return fm.fetchReq<GetChatRequest, GetChatResponse>(`/chat.ChatService/GetChat`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetChatInfo(req: GetChatInfoRequest, initReq?: fm.InitReq): Promise<Chat> {
    return fm.fetchReq<GetChatInfoRequest, Chat>(`/chat.ChatService/GetChatInfo`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListChatUsers(req: ListChatUsersRequest, initReq?: fm.InitReq): Promise<ListChatUsersResponse> {
    return fm.fetchReq<ListChatUsersRequest, ListChatUsersResponse>(`/v1/chats/${req["chatId"]}/chatUsers?${fm.renderURLSearchParams(req, ["chatId"])}`, {...initReq, method: "GET"})
  }
  static ListMessages(req: ListMessagesRequest, initReq?: fm.InitReq): Promise<ListMessagesResponse> {
    return fm.fetchReq<ListMessagesRequest, ListMessagesResponse>(`/v1/chats/${req["chatId"]}/messages?${fm.renderURLSearchParams(req, ["chatId"])}`, {...initReq, method: "GET"})
  }
  static ChatMessageStream(req: ChatMessageStreamRequest, entityNotifier?: fm.NotifyStreamEntityArrival<ChatEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<ChatMessageStreamRequest, ChatEvent>(`/v1/chats/${req["chatId"]}/messages:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<ChatMessageStreamRequest, ChatEvent>(`/v1/chats/${req["chatId"]}/messages:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static SendChatMessage(req: SendMessageRequest, initReq?: fm.InitReq): Promise<SendMessageResponse> {
    return fm.fetchReq<SendMessageRequest, SendMessageResponse>(`/v1/chats/${req["chatId"]}/messages`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class ChatModerationService {
  static GetChatUserStatus(req: GetChatUserStatusRequest, initReq?: fm.InitReq): Promise<GetChatUserStatusResponse> {
    return fm.fetchReq<GetChatUserStatusRequest, GetChatUserStatusResponse>(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:chatStatus?${fm.renderURLSearchParams(req, ["chatId", "userId"])}`, {...initReq, method: "GET"})
  }
  static HideChatMessage(req: HideChatMessageRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<HideChatMessageRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/messages/${req["messageId"]}:hide`, {...initReq, method: "PUT"})
  }
  static MuteChatUser(req: MuteChatUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<MuteChatUserRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:mute`, {...initReq, method: "PUT"})
  }
  static UnmuteChatUser(req: UnmuteChatUserRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UnmuteChatUserRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/users/${req["userId"]}:unmute`, {...initReq, method: "PUT"})
  }
  static StreamAutoModQueue(req: StreamAutoModQueueRequest, entityNotifier?: fm.NotifyStreamEntityArrival<AutoModQueueEvent>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<StreamAutoModQueueRequest, AutoModQueueEvent>(`/v1/chats/${req["chatId"]}/automod:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, {...initReq, method: "GET"})
    }
    return fm.fetchStreamingRequest<StreamAutoModQueueRequest, AutoModQueueEvent>(`/v1/chats/${req["chatId"]}/automod:stream?${fm.renderURLSearchParams(req, ["chatId"])}`, entityNotifier, {...initReq, method: "GET"})
  }
  static AllowModerationItem(req: AllowModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AllowModerationItemRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}:allow`, {...initReq, method: "PUT"})
  }
  static DenyModerationItem(req: DenyModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DenyModerationItemRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}:deny`, {...initReq, method: "PUT"})
  }
  static ClearModerationItem(req: ClearModerationItemRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<ClearModerationItemRequest, GoogleProtobufEmpty.Empty>(`/v1/chats/${req["chatId"]}/automod/${req["moderationItemId"]}`, {...initReq, method: "DELETE"})
  }
  static GetMessageContext(req: GetMessageContextRequest, initReq?: fm.InitReq): Promise<GetMessageContextResponse> {
    return fm.fetchReq<GetMessageContextRequest, GetMessageContextResponse>(`/v1/chats/${req["chatId"]}/messages/${req["messageId"]}/context?${fm.renderURLSearchParams(req, ["chatId", "messageId"])}`, {...initReq, method: "GET"})
  }
}