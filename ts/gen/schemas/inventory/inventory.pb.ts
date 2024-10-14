/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as AttributeAttribute from "../attribute/attribute.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as ItemItem from "../item/item.pb"
import * as ReasonReason from "../reason/reason.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type InventoryUpdateEvent = {
  events?: InventoryEvent[]
}

export type ItemEntitlement = {
  itemId?: string
  itemCount?: string
}

export type ItemConsumption = {
  itemId?: string
  itemCount?: string
}


type BaseInventoryEvent = {
  id?: string
  userId?: string
  reason?: ReasonReason.Reason
}

export type InventoryEvent = BaseInventoryEvent
  & OneOf<{ entitlement: ItemEntitlement; consumption: ItemConsumption }>

export type InventoryItem = {
  itemId?: string
  itemCount?: string
}

export type GetInventoryItemRequest = {
  itemId?: string
}

export type ListUserInventoryRequestFilterAttributeFilter = {
  key?: string
  value?: AttributeAttribute.Attribute
}


type BaseListUserInventoryRequestFilter = {
}

export type ListUserInventoryRequestFilter = BaseListUserInventoryRequestFilter
  & OneOf<{ gameId: string; itemType: ItemItem.ItemType; seasonId: string; attribute: ListUserInventoryRequestFilterAttributeFilter }>

export type ListUserInventoryRequest = {
  filters?: ListUserInventoryRequestFilter[]
  userId?: string
  cursor?: ApiCursor.Cursor
}

export type ListUserInventoryResponse = {
  items?: InventoryItem[]
  pageInfo?: ApiCursor.PageInfo
}

export type ConsumeItemRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  consumptions?: ItemConsumption[]
}

export type ConsumeItemResponse = {
  items?: InventoryItem[]
}

export type BatchGetInventoryItemsRequest = {
  userId?: string
  itemIds?: string[]
}

export type BatchGetInventoryItemsResponse = {
  items?: InventoryItem[]
}

export type BatchListUserInventoryRequestFilterGroup = {
  filters?: ListUserInventoryRequestFilter[]
}

export type BatchListUserInventoryRequest = {
  filterGroups?: BatchListUserInventoryRequestFilterGroup[]
  userId?: string
  cursor?: ApiCursor.Cursor
}

export type BatchListUserInventoryResponse = {
  items?: InventoryItem[]
  pageInfo?: ApiCursor.PageInfo
}

export type AddEntitlementsRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  entitlements?: ItemEntitlement[]
}

export type AddEntitlementsResponse = {
  items?: InventoryItem[]
}

export type DeleteEntitlementsRequest = {
  userId?: string
  itemIds?: string[]
}

export type AddEntitlementGroupedBatchRequest = {
  userId?: string
  reason?: ReasonReason.Reason
  entitlements?: ItemEntitlement[]
}

export type AddEntitlementGroupedBatchResponse = {
  items?: InventoryItem[]
  events?: InventoryEvent[]
}

export type PublishInventoryEventsRequest = {
  userId?: string
  events?: InventoryEvent[]
}

export type PublishInventoryEventsResponse = {
}




export interface IInventoryEventEventDelegate<C> {
  onEntitlement(ctx: C, ev: ItemEntitlement): void
  onConsumption(ctx: C, ev: ItemConsumption): void
}

export function routeInventoryEventEventDelegate<C>(ctx: C, val: InventoryEvent, delegate: IInventoryEventEventDelegate<C>) {
  val?.entitlement && delegate.onEntitlement(ctx, val.entitlement)
  val?.consumption && delegate.onConsumption(ctx, val.consumption)
}




export interface IListUserInventoryRequestFilterFilterDelegate<C> {
  onGameId(ctx: C, ev: string): void
  onItemType(ctx: C, ev: ItemItem.ItemType): void
  onSeasonId(ctx: C, ev: string): void
  onAttribute(ctx: C, ev: ListUserInventoryRequestFilterAttributeFilter): void
}

export function routeListUserInventoryRequestFilterFilterDelegate<C>(ctx: C, val: ListUserInventoryRequestFilter, delegate: IListUserInventoryRequestFilterFilterDelegate<C>) {
  val?.gameId && delegate.onGameId(ctx, val.gameId)
  val?.itemType && delegate.onItemType(ctx, val.itemType)
  val?.seasonId && delegate.onSeasonId(ctx, val.seasonId)
  val?.attribute && delegate.onAttribute(ctx, val.attribute)
}

export class UserInventoryService {
  static ListUserInventory(req: ListUserInventoryRequest, initReq?: fm.InitReq): Promise<ListUserInventoryResponse> {
    return fm.fetchReq<ListUserInventoryRequest, ListUserInventoryResponse>(`/inventory.UserInventoryService/ListUserInventory`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchListUserInventory(req: BatchListUserInventoryRequest, initReq?: fm.InitReq): Promise<BatchListUserInventoryResponse> {
    return fm.fetchReq<BatchListUserInventoryRequest, BatchListUserInventoryResponse>(`/inventory.UserInventoryService/BatchListUserInventory`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetInventoryItem(req: GetInventoryItemRequest, initReq?: fm.InitReq): Promise<InventoryItem> {
    return fm.fetchReq<GetInventoryItemRequest, InventoryItem>(`/inventory.UserInventoryService/GetInventoryItem`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetInventoryItems(req: BatchGetInventoryItemsRequest, initReq?: fm.InitReq): Promise<BatchGetInventoryItemsResponse> {
    return fm.fetchReq<BatchGetInventoryItemsRequest, BatchGetInventoryItemsResponse>(`/v1/inventory/items:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}
export class UserInventoryAdminService {
  static ConsumeItem(req: ConsumeItemRequest, initReq?: fm.InitReq): Promise<ConsumeItemResponse> {
    return fm.fetchReq<ConsumeItemRequest, ConsumeItemResponse>(`/inventory.UserInventoryAdminService/ConsumeItem`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static AddEntitlements(req: AddEntitlementsRequest, initReq?: fm.InitReq): Promise<AddEntitlementsResponse> {
    return fm.fetchReq<AddEntitlementsRequest, AddEntitlementsResponse>(`/inventory.UserInventoryAdminService/AddEntitlements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteEntitlements(req: DeleteEntitlementsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteEntitlementsRequest, GoogleProtobufEmpty.Empty>(`/inventory.UserInventoryAdminService/DeleteEntitlements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static AddEntitlementGroupedBatch(req: AddEntitlementGroupedBatchRequest, initReq?: fm.InitReq): Promise<AddEntitlementGroupedBatchResponse> {
    return fm.fetchReq<AddEntitlementGroupedBatchRequest, AddEntitlementGroupedBatchResponse>(`/inventory.UserInventoryAdminService/AddEntitlementGroupedBatch`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static PublishInventoryEvents(req: PublishInventoryEventsRequest, initReq?: fm.InitReq): Promise<PublishInventoryEventsResponse> {
    return fm.fetchReq<PublishInventoryEventsRequest, PublishInventoryEventsResponse>(`/inventory.UserInventoryAdminService/PublishInventoryEvents`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}