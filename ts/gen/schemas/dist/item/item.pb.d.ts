import * as ApiCursor from "../api/cursor.pb";
import * as AttributeAttribute from "../attribute/attribute.pb";
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
export declare enum ItemType {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    TYPE_DAILY_GOAL_CARD_SLOT = "TYPE_DAILY_GOAL_CARD_SLOT",
    TYPE_GAME_CARD = "TYPE_GAME_CARD",
    TYPE_UNLOCK = "TYPE_UNLOCK",
    TYPE_EMOTE = "TYPE_EMOTE",
    TYPE_EMOJI = "TYPE_EMOJI",
    TYPE_STREAMER_CARD = "TYPE_STREAMER_CARD",
    TYPE_SUBSCRIPTION = "TYPE_SUBSCRIPTION",
    TYPE_BOOTSTRAP = "TYPE_BOOTSTRAP",
    TYPE_AVATAR_ITEM = "TYPE_AVATAR_ITEM"
}
export type Item = {
    id?: string;
    type?: ItemType;
    name?: string;
    consumable?: boolean;
    attributes?: AttributeAttribute.AttributeMap;
    unlockItemId?: string;
    gameId?: string;
    seasonId?: string;
    channelId?: string;
    parentItemId?: string;
    disabled?: boolean;
    updatedAt?: string;
};
export type UserDefaultsItem = {
    itemId?: string;
    itemCount?: string;
    rev?: string;
};
export type UserDefaultsCurrency = {
    currencyId?: string;
    currencyAmount?: string;
    rev?: string;
};
export type UserDefaults = {
    items?: UserDefaultsItem[];
    currencies?: UserDefaultsCurrency[];
};
export type GetItemRequest = {
    id?: string;
};
export type GetItemResponse = {
    item?: Item;
};
export type BatchGetItemsRequest = {
    ids?: string[];
};
export type BatchGetItemsResponse = {
    items?: Item[];
};
export type ItemTotalCount = {
    total?: number;
    disabled?: number;
};
export type ListItemsRequestFilterAttribute = {
    name?: string;
    value?: AttributeAttribute.Attribute;
};
type BaseListItemsRequestFilter = {};
export type ListItemsRequestFilter = BaseListItemsRequestFilter & OneOf<{
    gameId: string;
    seasonId: string;
    channelId: string;
    itemType: ItemType;
    attribute: ListItemsRequestFilterAttribute;
    parentId: string;
}>;
export type ListItemsRequest = {
    filters?: ListItemsRequestFilter[];
    cursor?: ApiCursor.Cursor;
};
export type ListItemsResponse = {
    items?: Item[];
    pageInfo?: ApiCursor.PageInfo;
    count?: ItemTotalCount;
};
export type BatchListItemsRequest = {
    requests?: ListItemsRequest[];
};
export type BatchListItemsResponse = {
    responses?: ListItemsResponse[];
};
export type ItemCount = {
    type?: ItemType;
    count?: string;
};
export type ItemStat = {
    gameId?: string;
    counts?: ItemCount[];
};
export type ItemStats = {
    stats?: ItemStat[];
};
export type GetChannelItemStatsRequest = {
    channelId?: string;
};
export type BatchGetChannelItemStatsRequest = {
    channelIds?: string[];
};
export type BatchGetChannelItemStatsResponse = {
    stats?: ItemStats[];
};
export type ItemBootstrap = {
    itemId?: string;
    revision?: string;
    itemCount?: number;
};
export type CreateItemBootstrapRequest = {
    bootstrap?: ItemBootstrap;
};
export type ListItemBootstrapsRequest = {
    itemId?: string;
};
export type ListItemBootstrapsResponse = {
    bootstraps?: ItemBootstrap[];
};
export type UpdateItemBootstrapRequest = {
    body?: ItemBootstrap;
};
export type CreateItemRequest = {
    item?: Item;
};
export interface IListItemsRequestFilterFilterDelegate<C> {
    onGameId(ctx: C, ev: string): void;
    onSeasonId(ctx: C, ev: string): void;
    onChannelId(ctx: C, ev: string): void;
    onItemType(ctx: C, ev: ItemType): void;
    onAttribute(ctx: C, ev: ListItemsRequestFilterAttribute): void;
    onParentId(ctx: C, ev: string): void;
}
export declare function routeListItemsRequestFilterFilterDelegate<C>(ctx: C, val: ListItemsRequestFilter, delegate: IListItemsRequestFilterFilterDelegate<C>): void;
export declare class ItemService {
    static GetItem(req: GetItemRequest, initReq?: fm.InitReq): Promise<GetItemResponse>;
    static BatchGetItems(req: BatchGetItemsRequest, initReq?: fm.InitReq): Promise<BatchGetItemsResponse>;
    static ListItems(req: ListItemsRequest, initReq?: fm.InitReq): Promise<ListItemsResponse>;
    static GetChannelItemStats(req: GetChannelItemStatsRequest, initReq?: fm.InitReq): Promise<ItemStats>;
    static BatchGetChannelItemStats(req: BatchGetChannelItemStatsRequest, initReq?: fm.InitReq): Promise<BatchGetChannelItemStatsRequest>;
    static CreateItemBootstrap(req: CreateItemBootstrapRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdateItemBootstrap(req: UpdateItemBootstrapRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListItemBootstraps(req: ListItemBootstrapsRequest, initReq?: fm.InitReq): Promise<ListItemBootstrapsResponse>;
    static CreateItem(req: CreateItemRequest, initReq?: fm.InitReq): Promise<Item>;
}
export declare class ItemInternalService {
    static BatchListItems(req: BatchListItemsRequest, initReq?: fm.InitReq): Promise<BatchListItemsResponse>;
}
export {};
//# sourceMappingURL=item.pb.d.ts.map