/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as ItemItem from "../item/item.pb"
export type Emoji = {
  id?: string
  name?: string
  label?: string
  prefabName?: string
  imageUrl?: string
  channelId?: string
  disabled?: boolean
}

export type GetEmojiRequest = {
  id?: string
}

export type BatchGetEmojisRequest = {
  ids?: string[]
}

export type BatchGetEmojisResponse = {
  emojis?: Emoji[]
}

export type CreateEmojiUploadTokenRequest = {
  itemId?: string
}

export type CreateEmojiUploadTokenResponse = {
  token?: string
}

export type CreateChannelEmojiRequest = {
  channelId?: string
  label?: string
}

export type UpdateChannelEmojiParams = {
  id?: string
  channelId?: string
  label?: string
  disabled?: boolean
}

export type UpdateChannelEmojiRequest = {
  body?: UpdateChannelEmojiParams
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type DeleteChannelEmojiRequest = {
  id?: string
  channelId?: string
}

export type ListChannelEmojisRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
  includeDisabled?: boolean
  includeCount?: boolean
}

export type ListChannelEmojisResponse = {
  emojis?: Emoji[]
  pageInfo?: ApiCursor.PageInfo
  count?: ItemItem.ItemTotalCount
}

export type CreatePlatformEmojiRequest = {
  label?: string
}

export type UpdatePlatformEmojiParams = {
  id?: string
  label?: string
  disabled?: boolean
}

export type UpdatePlatformEmojiRequest = {
  body?: UpdatePlatformEmojiParams
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type DeletePlatformEmojiRequest = {
  id?: string
}

export type ListPlatformEmojisRequest = {
  cursor?: ApiCursor.Cursor
  includeDisabled?: boolean
  includeCount?: boolean
}

export type ListPlatformEmojisResponse = {
  emojis?: Emoji[]
  pageInfo?: ApiCursor.PageInfo
  count?: ItemItem.ItemTotalCount
}

export class EmojiService {
  static CreateEmojiUploadToken(req: CreateEmojiUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateEmojiUploadTokenResponse> {
    return fm.fetchReq<CreateEmojiUploadTokenRequest, CreateEmojiUploadTokenResponse>(`/v1/emojis:uploadToken`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetEmoji(req: GetEmojiRequest, initReq?: fm.InitReq): Promise<Emoji> {
    return fm.fetchReq<GetEmojiRequest, Emoji>(`/v1/emojis/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetEmojis(req: BatchGetEmojisRequest, initReq?: fm.InitReq): Promise<BatchGetEmojisResponse> {
    return fm.fetchReq<BatchGetEmojisRequest, BatchGetEmojisResponse>(`/v1/emojis:batchGet`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class ChannelEmojiService {
  static CreateChannelEmoji(req: CreateChannelEmojiRequest, initReq?: fm.InitReq): Promise<Emoji> {
    return fm.fetchReq<CreateChannelEmojiRequest, Emoji>(`/v2/channels/${req["channelId"]}/emojis`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateChannelEmoji(req: UpdateChannelEmojiRequest, initReq?: fm.InitReq): Promise<Emoji> {
    return fm.fetchReq<UpdateChannelEmojiRequest, Emoji>(`/v2/channels/${req["body"]["channelId"]}/emojis/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static DeleteChannelEmoji(req: DeleteChannelEmojiRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteChannelEmojiRequest, GoogleProtobufEmpty.Empty>(`/v2/channels/${req["channelId"]}/emojis/${req["id"]}`, {...initReq, method: "DELETE"})
  }
  static ListChannelEmojis(req: ListChannelEmojisRequest, initReq?: fm.InitReq): Promise<ListChannelEmojisResponse> {
    return fm.fetchReq<ListChannelEmojisRequest, ListChannelEmojisResponse>(`/v2/channels/${req["channelId"]}/emojis?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
}
export class PlatformEmojiService {
  static CreatePlatformEmoji(req: CreatePlatformEmojiRequest, initReq?: fm.InitReq): Promise<Emoji> {
    return fm.fetchReq<CreatePlatformEmojiRequest, Emoji>(`/v2/emojis`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdatePlatformEmoji(req: UpdatePlatformEmojiRequest, initReq?: fm.InitReq): Promise<Emoji> {
    return fm.fetchReq<UpdatePlatformEmojiRequest, Emoji>(`/v2/emojis/${req["body"]["id"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static DeletePlatformEmoji(req: DeletePlatformEmojiRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeletePlatformEmojiRequest, GoogleProtobufEmpty.Empty>(`/v2/emojis/${req["id"]}`, {...initReq, method: "DELETE"})
  }
  static ListPlatformEmojis(req: ListPlatformEmojisRequest, initReq?: fm.InitReq): Promise<ListPlatformEmojisResponse> {
    return fm.fetchReq<ListPlatformEmojisRequest, ListPlatformEmojisResponse>(`/v2/emojis?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}