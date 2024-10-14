/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as AttributeAttribute from "../attribute/attribute.pb"
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

export enum ItemType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  TYPE_DAILY_GOAL_CARD_SLOT = "TYPE_DAILY_GOAL_CARD_SLOT",
  TYPE_GAME_CARD = "TYPE_GAME_CARD",
  TYPE_UNLOCK = "TYPE_UNLOCK",
  TYPE_EMOTE = "TYPE_EMOTE",
  TYPE_EMOJI = "TYPE_EMOJI",
  TYPE_STREAMER_CARD = "TYPE_STREAMER_CARD",
  TYPE_SUBSCRIPTION = "TYPE_SUBSCRIPTION",
  TYPE_BOOTSTRAP = "TYPE_BOOTSTRAP",
  TYPE_AVATAR_ITEM = "TYPE_AVATAR_ITEM",
}

export type Item = {
  id?: string
  type?: ItemType
  name?: string
  consumable?: boolean
  attributes?: AttributeAttribute.AttributeMap
  unlockItemId?: string
  gameId?: string
  seasonId?: string
  channelId?: string
  parentItemId?: string
  disabled?: boolean
  updatedAt?: string
}

export type UserDefaultsItem = {
  itemId?: string
  itemCount?: string
  rev?: string
}

export type UserDefaultsCurrency = {
  currencyId?: string
  currencyAmount?: string
  rev?: string
}

export type UserDefaults = {
  items?: UserDefaultsItem[]
  currencies?: UserDefaultsCurrency[]
}

export type GetItemRequest = {
  id?: string
}

export type GetItemResponse = {
  item?: Item
}

export type BatchGetItemsRequest = {
  ids?: string[]
}

export type BatchGetItemsResponse = {
  items?: Item[]
}

export type ItemTotalCount = {
  total?: number
  disabled?: number
}

export type ListItemsRequestFilterAttribute = {
  name?: string
  value?: AttributeAttribute.Attribute
}


type BaseListItemsRequestFilter = {
}

export type ListItemsRequestFilter = BaseListItemsRequestFilter
  & OneOf<{ gameId: string; seasonId: string; channelId: string; itemType: ItemType; attribute: ListItemsRequestFilterAttribute; parentId: string }>

export type ListItemsRequest = {
  filters?: ListItemsRequestFilter[]
  cursor?: ApiCursor.Cursor
}

export type ListItemsResponse = {
  items?: Item[]
  pageInfo?: ApiCursor.PageInfo
  count?: ItemTotalCount
}

export type BatchListItemsRequest = {
  requests?: ListItemsRequest[]
}

export type BatchListItemsResponse = {
  responses?: ListItemsResponse[]
}

export type ItemCount = {
  type?: ItemType
  count?: string
}

export type ItemStat = {
  gameId?: string
  counts?: ItemCount[]
}

export type ItemStats = {
  stats?: ItemStat[]
}

export type GetChannelItemStatsRequest = {
  channelId?: string
}

export type BatchGetChannelItemStatsRequest = {
  channelIds?: string[]
}

export type BatchGetChannelItemStatsResponse = {
  stats?: ItemStats[]
}

export type ItemBootstrap = {
  itemId?: string
  revision?: string
  itemCount?: number
}

export type CreateItemBootstrapRequest = {
  bootstrap?: ItemBootstrap
}

export type ListItemBootstrapsRequest = {
  itemId?: string
}

export type ListItemBootstrapsResponse = {
  bootstraps?: ItemBootstrap[]
}

export type UpdateItemBootstrapRequest = {
  body?: ItemBootstrap
}

export type DeleteItemBootstrapRequest = {
  itemId?: string
  revision?: string
}

export type CreateItemRequest = {
  item?: Item
}

export type ExpandItemRequest = {
  id?: string
}

export type ExpandItemResponse = {
  items?: Item[]
}

export type BatchExpandItemsRequest = {
  ids?: string[]
}

export type BatchExpandItemsResponse = {
  items?: Item[]
}

export type ItemBootstraps = {
  configs?: ItemBootstrapConfig[]
}

export type ItemBootstrapConfig = {
  gameId?: string
  seasonId?: string
  channelId?: string
  itemId?: string
  revision?: string
  itemCount?: number
}




export interface IListItemsRequestFilterFilterDelegate<C> {
  onGameId(ctx: C, ev: string): void
  onSeasonId(ctx: C, ev: string): void
  onChannelId(ctx: C, ev: string): void
  onItemType(ctx: C, ev: ItemType): void
  onAttribute(ctx: C, ev: ListItemsRequestFilterAttribute): void
  onParentId(ctx: C, ev: string): void
}

export function routeListItemsRequestFilterFilterDelegate<C>(ctx: C, val: ListItemsRequestFilter, delegate: IListItemsRequestFilterFilterDelegate<C>) {
  val?.gameId && delegate.onGameId(ctx, val.gameId)
  val?.seasonId && delegate.onSeasonId(ctx, val.seasonId)
  val?.channelId && delegate.onChannelId(ctx, val.channelId)
  val?.itemType && delegate.onItemType(ctx, val.itemType)
  val?.attribute && delegate.onAttribute(ctx, val.attribute)
  val?.parentId && delegate.onParentId(ctx, val.parentId)
}

export class ItemService {
  static GetItem(req: GetItemRequest, initReq?: fm.InitReq): Promise<GetItemResponse> {
    return fm.fetchReq<GetItemRequest, GetItemResponse>(`/v1/items/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchGetItems(req: BatchGetItemsRequest, initReq?: fm.InitReq): Promise<BatchGetItemsResponse> {
    return fm.fetchReq<BatchGetItemsRequest, BatchGetItemsResponse>(`/v1/items:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListItems(req: ListItemsRequest, initReq?: fm.InitReq): Promise<ListItemsResponse> {
    return fm.fetchReq<ListItemsRequest, ListItemsResponse>(`/v1/items?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetChannelItemStats(req: GetChannelItemStatsRequest, initReq?: fm.InitReq): Promise<ItemStats> {
    return fm.fetchReq<GetChannelItemStatsRequest, ItemStats>(`/item.ItemService/GetChannelItemStats`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetChannelItemStats(req: BatchGetChannelItemStatsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelItemStatsRequest> {
    return fm.fetchReq<BatchGetChannelItemStatsRequest, BatchGetChannelItemStatsRequest>(`/item.ItemService/BatchGetChannelItemStats`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CreateItemBootstrap(req: CreateItemBootstrapRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CreateItemBootstrapRequest, GoogleProtobufEmpty.Empty>(`/v1/items/${req["bootstrap"]["itemId"]}/bootstraps`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateItemBootstrap(req: UpdateItemBootstrapRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UpdateItemBootstrapRequest, GoogleProtobufEmpty.Empty>(`/v1/items/${req["body"]["itemId"]}/bootstraps/${req["body"]["revision"]}`, {...initReq, method: "POST", body: JSON.stringify(req["body"])})
  }
  static DeleteItemBootstrap(req: DeleteItemBootstrapRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteItemBootstrapRequest, GoogleProtobufEmpty.Empty>(`/v1/items/${req["itemId"]}/bootstraps/${req["revision"]}`, {...initReq, method: "DELETE"})
  }
  static ListItemBootstraps(req: ListItemBootstrapsRequest, initReq?: fm.InitReq): Promise<ListItemBootstrapsResponse> {
    return fm.fetchReq<ListItemBootstrapsRequest, ListItemBootstrapsResponse>(`/v1/itemBootstraps?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static CreateItem(req: CreateItemRequest, initReq?: fm.InitReq): Promise<Item> {
    return fm.fetchReq<CreateItemRequest, Item>(`/v1/items`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ExpandItem(req: ExpandItemRequest, initReq?: fm.InitReq): Promise<ExpandItemResponse> {
    return fm.fetchReq<ExpandItemRequest, ExpandItemResponse>(`/v1/items/${req["id"]}:expand?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static BatchExpandItems(req: BatchExpandItemsRequest, initReq?: fm.InitReq): Promise<BatchExpandItemsResponse> {
    return fm.fetchReq<BatchExpandItemsRequest, BatchExpandItemsResponse>(`/v1/items:batchExpand?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}
export class ItemInternalService {
  static BatchListItems(req: BatchListItemsRequest, initReq?: fm.InitReq): Promise<BatchListItemsResponse> {
    return fm.fetchReq<BatchListItemsRequest, BatchListItemsResponse>(`/item.ItemInternalService/BatchListItems`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}