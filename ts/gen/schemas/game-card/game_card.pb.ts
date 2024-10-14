/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as InventoryInventory from "../inventory/inventory.pb"
import * as RarityRarity from "../rarity/rarity.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum AssetType {
  ASSET_TYPE_UNSPECIFIED = "ASSET_TYPE_UNSPECIFIED",
  ASSET_TYPE_VIDEO = "ASSET_TYPE_VIDEO",
  ASSET_TYPE_THUMBNAIL = "ASSET_TYPE_THUMBNAIL",
}

export enum HighScoringCardTimingsSpeed {
  SPEED_UNSPECIFIED = "SPEED_UNSPECIFIED",
  SPEED_SLOWEST = "SPEED_SLOWEST",
  SPEED_SLOW = "SPEED_SLOW",
  SPEED_DEFAULT = "SPEED_DEFAULT",
  SPEED_FAST = "SPEED_FAST",
  SPEED_FASTEST = "SPEED_FASTEST",
}

export enum StreamerCardUpdateEventUpdateType {
  UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
  UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
  UPDATE_TYPE_UPDATED = "UPDATE_TYPE_UPDATED",
  UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED",
}

export type CardLevelUpEvent = {
  userId?: string
  cardId?: string
  oldLevel?: number
  newLevel?: number
  seasonId?: string
}

export type LevelMultipliers = {
  multiplierMinPoints?: number
  multiplierMaxPoints?: number
  multiplierAon?: number
}

export type Progression = {
  duplicates?: string[]
}

export type ProgressionConfig = {
  levels?: {[key: string]: Progression}
  multipliers?: LevelMultipliers[]
}

export type DuplicateRequirements = {
  levels?: {[key: string]: Progression}
}

export type HighScoringCardConfig = {
  cardRarity?: RarityRarity.Rarity
  percentageOfMaxRequired?: number
  streamerCardPercentageOfMaxRequired?: number
  soloMultiplier?: number
}

export type HighScoringCardTimings = {
  speed?: HighScoringCardTimingsSpeed
  ghostWaitTime?: string
  cooldownBetweenCardScores?: string
}

export type ListGameCardsRequest = {
  gameId?: string
  channelId?: string
  userId?: string
  seasonId?: string
}

export type ListGameCardsResponse = {
  cards?: Game_logicGame_logic.Card[]
}

export type BatchGetGameCardsRequest = {
  cardIds?: string[]
}

export type BatchGetGameCardsResponse = {
  cards?: Game_logicGame_logic.Card[]
}

export type GetProgressionConfigRequest = {
}

export type GetProgressionConfigResponse = {
  config?: ProgressionConfig
}

export type GetHighScoringCardsConfigRequest = {
}

export type GetHighScoringCardsConfigResponse = {
  configs?: HighScoringCardConfig[]
  timings?: HighScoringCardTimings[]
}

export type InventoryGetGameCardsRequest = {
  items?: InventoryInventory.InventoryItem[]
  channelId?: string
}

export type InventoryGetGameCardsResponse = {
  cards?: Game_logicGame_logic.Card[]
}

export type ListGameCardsConfigsRequest = {
  cardIds?: string[]
}

export type ListGameCardsConfigsResponse = {
  cards?: Game_logicGame_logic.Card[]
}

export type GetGameCardConfigByFamilyIdRequest = {
  familyId?: string
  seasonId?: string
}

export type GetBoosterRequest = {
  id?: number
}

export type ListBoostersRequest = {
}

export type ListBoostersResponse = {
  boosters?: Game_logicGame_logic.Booster[]
}

export type StreamerCardSelectedEvent = {
  userId?: string
  channelId?: string
  streamerCardId?: string
  familyId?: string
}

export type StreamerCardUpdateEvent = {
  streamerCard?: Game_logicGame_logic.StreamerCard
  updatedAt?: string
  type?: StreamerCardUpdateEventUpdateType
}

export type BatchGetStreamerCardsRequest = {
  streamerCardIds?: string[]
}

export type BatchGetStreamerCardsResponse = {
  cards?: Game_logicGame_logic.StreamerCard[]
}


type BaseListStreamerCardsRequestFilter = {
}

export type ListStreamerCardsRequestFilter = BaseListStreamerCardsRequestFilter
  & OneOf<{ channelId: string; familyId: string; gameId: string }>

export type ListStreamerCardsRequest = {
  filters?: ListStreamerCardsRequestFilter[]
  cursor?: ApiCursor.Cursor
}

export type ListStreamerCardsResponse = {
  cards?: Game_logicGame_logic.StreamerCard[]
  pageInfo?: ApiCursor.PageInfo
}

export type ListInventoryStreamerCardsRequest = {
  channelId?: string
  userId?: string
  familyId?: string
}

export type ListInventoryStreamerCardsResponse = {
  cards?: Game_logicGame_logic.StreamerCard[]
}

export type SetStreamerCardSelectionRequest = {
  streamerCardId?: string
}

export type SetStreamerCardSelectionResponse = {
}

export type GetStreamerCardSelectionRequest = {
  channelId?: string
  familyId?: string
}

export type GetStreamerCardSelectionResponse = {
  card?: Game_logicGame_logic.StreamerCard
}

export type ListStreamerCardSelectionsRequest = {
  familyId?: string
}

export type ListStreamerCardSelectionsResponse = {
  cards?: Game_logicGame_logic.StreamerCard[]
}

export type UnsetStreamerCardSelectionRequest = {
  channelId?: string
  familyId?: string
}

export type UnsetStreamerCardSelectionResponse = {
}

export type GetStreamerCardRequest = {
  id?: string
}

export type CreateStreamerCardDraftRequest = {
  channelId?: string
  gameId?: string
  familyId?: string
  name?: string
}

export type StreamerCardDraftUpdate = {
  channelId?: string
  cardId?: string
  gameId?: string
  familyId?: string
  name?: string
}

export type UpdateStreamerCardDraftRequest = {
  body?: StreamerCardDraftUpdate
  updateMask?: GoogleProtobufField_mask.FieldMask
}

export type DeleteStreamerCardDraftRequest = {
  channelId?: string
  cardId?: string
}

export type PublishStreamerCardDraftRequest = {
  channelId?: string
  cardId?: string
}


type BaseListStreamerCardDraftsRequestFilter = {
}

export type ListStreamerCardDraftsRequestFilter = BaseListStreamerCardDraftsRequestFilter
  & OneOf<{ familyId: string; gameId: string }>

export type ListStreamerCardDraftsRequest = {
  channelId?: string
  filters?: ListStreamerCardDraftsRequestFilter[]
  cursor?: ApiCursor.Cursor
}

export type ListStreamerCardDraftsResponse = {
  cards?: Game_logicGame_logic.StreamerCard[]
  pageInfo?: ApiCursor.PageInfo
}

export type CreateStreamerCardAssetUploadTokenRequest = {
  channelId?: string
  cardId?: string
  assetType?: AssetType
}

export type CreateStreamerCardAssetUploadTokenResponse = {
  token?: string
}




export interface IListStreamerCardsRequestFilterFilterDelegate<C> {
  onChannelId(ctx: C, ev: string): void
  onFamilyId(ctx: C, ev: string): void
  onGameId(ctx: C, ev: string): void
}

export function routeListStreamerCardsRequestFilterFilterDelegate<C>(ctx: C, val: ListStreamerCardsRequestFilter, delegate: IListStreamerCardsRequestFilterFilterDelegate<C>) {
  val?.channelId && delegate.onChannelId(ctx, val.channelId)
  val?.familyId && delegate.onFamilyId(ctx, val.familyId)
  val?.gameId && delegate.onGameId(ctx, val.gameId)
}




export interface IListStreamerCardDraftsRequestFilterFilterDelegate<C> {
  onFamilyId(ctx: C, ev: string): void
  onGameId(ctx: C, ev: string): void
}

export function routeListStreamerCardDraftsRequestFilterFilterDelegate<C>(ctx: C, val: ListStreamerCardDraftsRequestFilter, delegate: IListStreamerCardDraftsRequestFilterFilterDelegate<C>) {
  val?.familyId && delegate.onFamilyId(ctx, val.familyId)
  val?.gameId && delegate.onGameId(ctx, val.gameId)
}

export class GameCardService {
  static ListGameCards(req: ListGameCardsRequest, initReq?: fm.InitReq): Promise<ListGameCardsResponse> {
    return fm.fetchReq<ListGameCardsRequest, ListGameCardsResponse>(`/v1/gamecards?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static InventoryGetGameCards(req: InventoryGetGameCardsRequest, initReq?: fm.InitReq): Promise<InventoryGetGameCardsResponse> {
    return fm.fetchReq<InventoryGetGameCardsRequest, InventoryGetGameCardsResponse>(`/v1/inventory/items:getGameCards`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetGameCards(req: BatchGetGameCardsRequest, initReq?: fm.InitReq): Promise<BatchGetGameCardsResponse> {
    return fm.fetchReq<BatchGetGameCardsRequest, BatchGetGameCardsResponse>(`/v1/gamecards:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetProgressionConfig(req: GetProgressionConfigRequest, initReq?: fm.InitReq): Promise<GetProgressionConfigResponse> {
    return fm.fetchReq<GetProgressionConfigRequest, GetProgressionConfigResponse>(`/game_card.GameCardService/GetProgressionConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetHighScoringCardsConfig(req: GetHighScoringCardsConfigRequest, initReq?: fm.InitReq): Promise<GetHighScoringCardsConfigResponse> {
    return fm.fetchReq<GetHighScoringCardsConfigRequest, GetHighScoringCardsConfigResponse>(`/game_card.GameCardService/GetHighScoringCardsConfig`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class GameCardAdminService {
  static GetGameCardConfigByFamilyId(req: GetGameCardConfigByFamilyIdRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Card> {
    return fm.fetchReq<GetGameCardConfigByFamilyIdRequest, Game_logicGame_logic.Card>(`/game_card.GameCardAdminService/GetGameCardConfigByFamilyId`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListGameCardsConfigs(req: ListGameCardsConfigsRequest, initReq?: fm.InitReq): Promise<ListGameCardsConfigsResponse> {
    return fm.fetchReq<ListGameCardsConfigsRequest, ListGameCardsConfigsResponse>(`/game_card.GameCardAdminService/ListGameCardsConfigs`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class BoosterService {
  static GetBooster(req: GetBoosterRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.Booster> {
    return fm.fetchReq<GetBoosterRequest, Game_logicGame_logic.Booster>(`/game_card.BoosterService/GetBooster`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListBoosters(req: ListBoostersRequest, initReq?: fm.InitReq): Promise<ListBoostersResponse> {
    return fm.fetchReq<ListBoostersRequest, ListBoostersResponse>(`/game_card.BoosterService/ListBoosters`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class StreamerCardService {
  static BatchGetStreamerCards(req: BatchGetStreamerCardsRequest, initReq?: fm.InitReq): Promise<BatchGetStreamerCardsResponse> {
    return fm.fetchReq<BatchGetStreamerCardsRequest, BatchGetStreamerCardsResponse>(`/v1/streamerCards:batchGet?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static ListStreamerCards(req: ListStreamerCardsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardsResponse> {
    return fm.fetchReq<ListStreamerCardsRequest, ListStreamerCardsResponse>(`/v1/streamerCards`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListInventoryStreamerCards(req: ListInventoryStreamerCardsRequest, initReq?: fm.InitReq): Promise<ListInventoryStreamerCardsResponse> {
    return fm.fetchReq<ListInventoryStreamerCardsRequest, ListInventoryStreamerCardsResponse>(`/game_card.StreamerCardService/ListInventoryStreamerCards`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetStreamerCardSelection(req: GetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<GetStreamerCardSelectionResponse> {
    return fm.fetchReq<GetStreamerCardSelectionRequest, GetStreamerCardSelectionResponse>(`/game_card.StreamerCardService/GetStreamerCardSelection`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListStreamerCardSelections(req: ListStreamerCardSelectionsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardSelectionsResponse> {
    return fm.fetchReq<ListStreamerCardSelectionsRequest, ListStreamerCardSelectionsResponse>(`/game_card.StreamerCardService/ListStreamerCardSelections`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetStreamerCardSelection(req: SetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<SetStreamerCardSelectionResponse> {
    return fm.fetchReq<SetStreamerCardSelectionRequest, SetStreamerCardSelectionResponse>(`/game_card.StreamerCardService/SetStreamerCardSelection`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UnsetStreamerCardSelection(req: UnsetStreamerCardSelectionRequest, initReq?: fm.InitReq): Promise<UnsetStreamerCardSelectionResponse> {
    return fm.fetchReq<UnsetStreamerCardSelectionRequest, UnsetStreamerCardSelectionResponse>(`/game_card.StreamerCardService/UnsetStreamerCardSelection`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetStreamerCard(req: GetStreamerCardRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard> {
    return fm.fetchReq<GetStreamerCardRequest, Game_logicGame_logic.StreamerCard>(`/v1/streamerCards/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static CreateStreamerCardDraft(req: CreateStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard> {
    return fm.fetchReq<CreateStreamerCardDraftRequest, Game_logicGame_logic.StreamerCard>(`/v1/channels/${req["channelId"]}/streamerCardDrafts`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateStreamerCardDraft(req: UpdateStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<Game_logicGame_logic.StreamerCard> {
    return fm.fetchReq<UpdateStreamerCardDraftRequest, Game_logicGame_logic.StreamerCard>(`/v1/channels/${req["body"]["channelId"]}/streamerCardDrafts/${req["body"]["cardId"]}`, {...initReq, method: "PATCH", body: JSON.stringify(req["body"])})
  }
  static DeleteStreamerCardDraft(req: DeleteStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteStreamerCardDraftRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/streamerCardDrafts/${req["cardId"]}`, {...initReq, method: "DELETE"})
  }
  static PublishStreamerCardDraft(req: PublishStreamerCardDraftRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<PublishStreamerCardDraftRequest, GoogleProtobufEmpty.Empty>(`/v1/channels/${req["channelId"]}/streamerCardDrafts/${req["cardId"]}:publish`, {...initReq, method: "POST"})
  }
  static ListStreamerCardDrafts(req: ListStreamerCardDraftsRequest, initReq?: fm.InitReq): Promise<ListStreamerCardDraftsResponse> {
    return fm.fetchReq<ListStreamerCardDraftsRequest, ListStreamerCardDraftsResponse>(`/v1/channels/${req["channelId"]}/streamerCardDrafts?${fm.renderURLSearchParams(req, ["channelId"])}`, {...initReq, method: "GET"})
  }
  static CreateStreamerCardAssetUploadToken(req: CreateStreamerCardAssetUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateStreamerCardAssetUploadTokenResponse> {
    return fm.fetchReq<CreateStreamerCardAssetUploadTokenRequest, CreateStreamerCardAssetUploadTokenResponse>(`/v1/channels/${req["channelId"]}/streamerCards:assetUploadToken`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}