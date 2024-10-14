import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as InventoryInventory from "../inventory/inventory.pb";
import * as RarityRarity from "../rarity/rarity.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum AssetType {
    ASSET_TYPE_UNSPECIFIED = "ASSET_TYPE_UNSPECIFIED",
    ASSET_TYPE_VIDEO = "ASSET_TYPE_VIDEO",
    ASSET_TYPE_THUMBNAIL = "ASSET_TYPE_THUMBNAIL"
}
export declare enum HighScoringCardTimingsSpeed {
    SPEED_UNSPECIFIED = "SPEED_UNSPECIFIED",
    SPEED_SLOWEST = "SPEED_SLOWEST",
    SPEED_SLOW = "SPEED_SLOW",
    SPEED_DEFAULT = "SPEED_DEFAULT",
    SPEED_FAST = "SPEED_FAST",
    SPEED_FASTEST = "SPEED_FASTEST"
}
export declare enum StreamerCardUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_UPDATED = "UPDATE_TYPE_UPDATED",
    UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED"
}
export type CardLevelUpEvent = {
    userId?: string;
    cardId?: string;
    oldLevel?: number;
    newLevel?: number;
    seasonId?: string;
};
export type LevelMultipliers = {
    multiplierMinPoints?: number;
    multiplierMaxPoints?: number;
    multiplierAon?: number;
};
export type Progression = {
    duplicates?: string[];
};
export type ProgressionConfig = {
    levels?: {
        [key: string]: Progression;
    };
    multipliers?: LevelMultipliers[];
};
export type DuplicateRequirements = {
    levels?: {
        [key: string]: Progression;
    };
};
export type HighScoringCardConfig = {
    cardRarity?: RarityRarity.Rarity;
    percentageOfMaxRequired?: number;
    streamerCardPercentageOfMaxRequired?: number;
    soloMultiplier?: number;
};
export type HighScoringCardTimings = {
    speed?: HighScoringCardTimingsSpeed;
    ghostWaitTime?: string;
    cooldownBetweenCardScores?: string;
};
export type ListGameCardsRequest = {
    gameId?: string;
    channelId?: string;
    userId?: string;
    seasonId?: string;
};
export type ListGameCardsResponse = {
    cards?: Game_logicGame_logic.Card[];
};
export type BatchGetGameCardsRequest = {
    cardIds?: string[];
};
export type BatchGetGameCardsResponse = {
    cards?: Game_logicGame_logic.Card[];
};
export type GetProgressionConfigRequest = {};
export type GetProgressionConfigResponse = {
    config?: ProgressionConfig;
};
export type GetHighScoringCardsConfigRequest = {};
export type GetHighScoringCardsConfigResponse = {
    configs?: HighScoringCardConfig[];
    timings?: HighScoringCardTimings[];
};
export type InventoryGetGameCardsRequest = {
    items?: InventoryInventory.InventoryItem[];
    channelId?: string;
};
export type InventoryGetGameCardsResponse = {
    cards?: Game_logicGame_logic.Card[];
};
export type ListGameCardsConfigsRequest = {
    cardIds?: string[];
};
export type ListGameCardsConfigsResponse = {
    cards?: Game_logicGame_logic.Card[];
};
export type GetGameCardConfigByFamilyIdRequest = {
    familyId?: string;
    seasonId?: string;
};
export type GetBoosterRequest = {
    id?: number;
};
export type ListBoostersRequest = {};
export type ListBoostersResponse = {
    boosters?: Game_logicGame_logic.Booster[];
};
export type StreamerCardSelectedEvent = {
    userId?: string;
    channelId?: string;
    streamerCardId?: string;
    familyId?: string;
};
export type StreamerCardUpdateEvent = {
    streamerCard?: Game_logicGame_logic.StreamerCard;
    updatedAt?: string;
    type?: StreamerCardUpdateEventUpdateType;
};
export type BatchGetStreamerCardsRequest = {
    streamerCardIds?: string[];
};
export type BatchGetStreamerCardsResponse = {
    cards?: Game_logicGame_logic.StreamerCard[];
};
type BaseListStreamerCardsRequestFilter = {};
export type ListStreamerCardsRequestFilter = BaseListStreamerCardsRequestFilter & OneOf<{
    channelId: string;
    familyId: string;
    gameId: string;
}>;
export type ListStreamerCardsRequest = {
    filters?: ListStreamerCardsRequestFilter[];
    cursor?: ApiCursor.Cursor;
};
export type ListStreamerCardsResponse = {
    cards?: Game_logicGame_logic.StreamerCard[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListInventoryStreamerCardsRequest = {
    channelId?: string;
    userId?: string;
    familyId?: string;
};
export type ListInventoryStreamerCardsResponse = {
    cards?: Game_logicGame_logic.StreamerCard[];
};
export type SetStreamerCardSelectionRequest = {
    streamerCardId?: string;
};
export type SetStreamerCardSelectionResponse = {};
export type GetStreamerCardSelectionRequest = {
    channelId?: string;
    familyId?: string;
};
export type GetStreamerCardSelectionResponse = {
    card?: Game_logicGame_logic.StreamerCard;
};
export type ListStreamerCardSelectionsRequest = {
    familyId?: string;
};
export type ListStreamerCardSelectionsResponse = {
    cards?: Game_logicGame_logic.StreamerCard[];
};
export type UnsetStreamerCardSelectionRequest = {
    channelId?: string;
    familyId?: string;
};
export type UnsetStreamerCardSelectionResponse = {};
export type GetStreamerCardRequest = {
    id?: string;
};
export type CreateStreamerCardDraftRequest = {
    channelId?: string;
    gameId?: string;
    familyId?: string;
    name?: string;
};
export type StreamerCardDraftUpdate = {
    channelId?: string;
    cardId?: string;
    gameId?: string;
    familyId?: string;
    name?: string;
};
export type UpdateStreamerCardDraftRequest = {
    body?: StreamerCardDraftUpdate;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type DeleteStreamerCardDraftRequest = {
    channelId?: string;
    cardId?: string;
};
export type PublishStreamerCardDraftRequest = {
    channelId?: string;
    cardId?: string;
};
type BaseListStreamerCardDraftsRequestFilter = {};
export type ListStreamerCardDraftsRequestFilter = BaseListStreamerCardDraftsRequestFilter & OneOf<{
    familyId: string;
    gameId: string;
}>;
export type ListStreamerCardDraftsRequest = {
    channelId?: string;
    filters?: ListStreamerCardDraftsRequestFilter[];
    cursor?: ApiCursor.Cursor;
};
export type ListStreamerCardDraftsResponse = {
    cards?: Game_logicGame_logic.StreamerCard[];
    pageInfo?: ApiCursor.PageInfo;
};
export type CreateStreamerCardAssetUploadTokenRequest = {
    channelId?: string;
    cardId?: string;
    assetType?: AssetType;
};
export type CreateStreamerCardAssetUploadTokenResponse = {
    token?: string;
};
export interface IListStreamerCardsRequestFilterFilterDelegate<C> {
    onChannelId(ctx: C, ev: string): void;
    onFamilyId(ctx: C, ev: string): void;
    onGameId(ctx: C, ev: string): void;
}
export declare function routeListStreamerCardsRequestFilterFilterDelegate<C>(ctx: C, val: ListStreamerCardsRequestFilter, delegate: IListStreamerCardsRequestFilterFilterDelegate<C>): void;
export interface IListStreamerCardDraftsRequestFilterFilterDelegate<C> {
    onFamilyId(ctx: C, ev: string): void;
    onGameId(ctx: C, ev: string): void;
}
export declare function routeListStreamerCardDraftsRequestFilterFilterDelegate<C>(ctx: C, val: ListStreamerCardDraftsRequestFilter, delegate: IListStreamerCardDraftsRequestFilterFilterDelegate<C>): void;
export declare class GameCardService {
    static ListGameCards(req: ListGameCardsRequest, initReq?: fm.InitReq): Promise<ListGameCardsResponse>;
    static InventoryGetGameCards(req: InventoryGetGameCardsRequest, initReq?: fm.InitReq): Promise<InventoryGetGameCardsResponse>;
    static BatchGetGameCards(req: BatchGetGameCardsRequest, initReq?: fm.InitReq): Promise<BatchGetGameCardsResponse>;
    static GetProgressionConfig(req: GetProgressionConfigRequest, initReq?: fm.InitReq): Promise<GetProgressionConfigResponse>;
    static GetHighScoringCardsConfig(req: GetHighScoringCardsConfigRequest, initReq?: fm.InitReq): Promise<GetHighScoringCardsConfigResponse>;
}
export declare class GameCardAdminService {
    static GetGameCardConfigByFamilyId(req: GetGameCardConfigByFamilyIdRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Card>;
    static ListGameCardsConfigs(req: ListGameCardsConfigsRequest, initReq?: fm.InitReq): Promise<ListGameCardsConfigsResponse>;
}
export declare class BoosterService {
    static GetBooster(req: GetBoosterRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Booster>;
    static ListBoosters(req: ListBoostersRequest, initReq?: fm.InitReq): Promise<ListBoostersResponse>;
}
export declare class StreamerCardService {
    static BatchGetStreamerCards(req: BatchGetStreamerCardsRequest, initReq?: fm.InitReq): Promise<BatchGetStreamerCardsResponse>;
    static ListStreamerCards(req: ListStreamerCardsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardsResponse>;
    static ListInventoryStreamerCards(req: ListInventoryStreamerCardsRequest, initReq?: fm.InitReq): Promise<ListInventoryStreamerCardsResponse>;
    static GetStreamerCardSelection(req: GetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<GetStreamerCardSelectionResponse>;
    static ListStreamerCardSelections(req: ListStreamerCardSelectionsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardSelectionsResponse>;
    static SetStreamerCardSelection(req: SetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<SetStreamerCardSelectionResponse>;
    static UnsetStreamerCardSelection(req: UnsetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<UnsetStreamerCardSelectionResponse>;
    static GetStreamerCard(req: GetStreamerCardRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard>;
    static CreateStreamerCardDraft(req: CreateStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard>;
    static UpdateStreamerCardDraft(req: UpdateStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard>;
    static DeleteStreamerCardDraft(req: DeleteStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static PublishStreamerCardDraft(req: PublishStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListStreamerCardDrafts(req: ListStreamerCardDraftsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardDraftsResponse>;
    static CreateStreamerCardAssetUploadToken(req: CreateStreamerCardAssetUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateStreamerCardAssetUploadTokenResponse>;
}
export {};
//# sourceMappingURL=game_card.pb.d.ts.map