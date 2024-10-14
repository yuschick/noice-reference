import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as ItemItem from "../item/item.pb";
import * as ReasonReason from "../reason/reason.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type InventoryUpdateEvent = {
    events?: InventoryEvent[];
};
export type ItemEntitlement = {
    itemId?: string;
    itemCount?: string;
};
export type ItemConsumption = {
    itemId?: string;
    itemCount?: string;
};
type BaseInventoryEvent = {
    id?: string;
    userId?: string;
    reason?: ReasonReason.Reason;
};
export type InventoryEvent = BaseInventoryEvent & OneOf<{
    entitlement: ItemEntitlement;
    consumption: ItemConsumption;
}>;
export type InventoryItem = {
    itemId?: string;
    itemCount?: string;
};
export type GetInventoryItemRequest = {
    itemId?: string;
};
type BaseListUserInventoryRequestFilter = {};
export type ListUserInventoryRequestFilter = BaseListUserInventoryRequestFilter & OneOf<{
    gameId: string;
    itemType: ItemItem.ItemType;
    seasonId: string;
}>;
export type ListUserInventoryRequest = {
    filters?: ListUserInventoryRequestFilter[];
    userId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListUserInventoryResponse = {
    items?: InventoryItem[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ConsumeItemRequest = {
    userId?: string;
    reason?: ReasonReason.Reason;
    consumptions?: ItemConsumption[];
};
export type ConsumeItemResponse = {
    items?: InventoryItem[];
};
export type BatchGetInventoryItemsRequest = {
    userId?: string;
    itemIds?: string[];
};
export type BatchGetInventoryItemsResponse = {
    items?: InventoryItem[];
};
export type AddEntitlementsRequest = {
    userId?: string;
    reason?: ReasonReason.Reason;
    entitlements?: ItemEntitlement[];
};
export type AddEntitlementsResponse = {
    items?: InventoryItem[];
};
export type DeleteEntitlementsRequest = {
    userId?: string;
    itemIds?: string[];
};
export type AddEntitlementGroupedBatchRequest = {
    userId?: string;
    reason?: ReasonReason.Reason;
    entitlements?: ItemEntitlement[];
};
export type AddEntitlementGroupedBatchResponse = {
    items?: InventoryItem[];
    events?: InventoryEvent[];
};
export type PublishInventoryEventsRequest = {
    userId?: string;
    events?: InventoryEvent[];
};
export type PublishInventoryEventsResponse = {};
export interface IInventoryEventEventDelegate<C> {
    onEntitlement(ctx: C, ev: ItemEntitlement): void;
    onConsumption(ctx: C, ev: ItemConsumption): void;
}
export declare function routeInventoryEventEventDelegate<C>(ctx: C, val: InventoryEvent, delegate: IInventoryEventEventDelegate<C>): void;
export interface IListUserInventoryRequestFilterFilterDelegate<C> {
    onGameId(ctx: C, ev: string): void;
    onItemType(ctx: C, ev: ItemItem.ItemType): void;
    onSeasonId(ctx: C, ev: string): void;
}
export declare function routeListUserInventoryRequestFilterFilterDelegate<C>(ctx: C, val: ListUserInventoryRequestFilter, delegate: IListUserInventoryRequestFilterFilterDelegate<C>): void;
export declare class UserInventoryService {
    static ListUserInventory(req: ListUserInventoryRequest, initReq?: fm.InitReq): Promise<ListUserInventoryResponse>;
    static GetInventoryItem(req: GetInventoryItemRequest, initReq?: fm.InitReq): Promise<InventoryItem>;
    static BatchGetInventoryItems(req: BatchGetInventoryItemsRequest, initReq?: fm.InitReq): Promise<BatchGetInventoryItemsResponse>;
}
export declare class UserInventoryAdminService {
    static ConsumeItem(req: ConsumeItemRequest, initReq?: fm.InitReq): Promise<ConsumeItemResponse>;
    static AddEntitlements(req: AddEntitlementsRequest, initReq?: fm.InitReq): Promise<AddEntitlementsResponse>;
    static DeleteEntitlements(req: DeleteEntitlementsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static AddEntitlementGroupedBatch(req: AddEntitlementGroupedBatchRequest, initReq?: fm.InitReq): Promise<AddEntitlementGroupedBatchResponse>;
    static PublishInventoryEvents(req: PublishInventoryEventsRequest, initReq?: fm.InitReq): Promise<PublishInventoryEventsResponse>;
}
export {};
//# sourceMappingURL=inventory.pb.d.ts.map