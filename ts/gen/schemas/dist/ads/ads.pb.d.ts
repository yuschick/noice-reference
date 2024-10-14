import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as RarityRarity from "../rarity/rarity.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum PlacementState {
    PLACEMENT_STATE_UNSPECIFIED = "PLACEMENT_STATE_UNSPECIFIED",
    PLACEMENT_STATE_NOT_READY = "PLACEMENT_STATE_NOT_READY",
    PLACEMENT_STATE_READY = "PLACEMENT_STATE_READY"
}
export declare enum RewardDescriptionPrizeDescriptionKind {
    KIND_UNSPECIFIED = "KIND_UNSPECIFIED",
    KIND_CURRENCY = "KIND_CURRENCY",
    KIND_EXPERIENCE_POINTS = "KIND_EXPERIENCE_POINTS"
}
export type PlacementConfig = {
    timedAdsInitialCooldownSec?: string;
    timedAdsCooldownSec?: string;
    timedAdsStackSize?: string;
};
export type RewardOddsConfig = {
    rarity?: RarityRarity.Rarity;
    weighting?: string;
    prizePool?: string;
};
export type LootPoolConfigPrize = {
    currencyId?: string;
    currencyAmount?: string;
};
export type LootPoolConfigLootItem = {
    lootId?: string;
    prizes?: LootPoolConfigPrize[];
};
export type LootPoolConfig = {
    lootPoolId?: string;
    lootItems?: LootPoolConfigLootItem[];
};
export type PlacementRewardEvent = {
    userId?: string;
    placementId?: string;
    reward?: PlacementReward;
};
export type PlacementStateEvent = {
    userId?: string;
    placementId?: string;
    state?: PlacementState;
    referenceId?: string;
};
export type PlacementRewardPrizeCurrency = {
    id?: string;
    amount?: string;
};
export type PlacementRewardPrizeExperiencePoints = {
    amount?: string;
    gameId?: string;
    seasonId?: string;
};
type BasePlacementRewardPrize = {};
export type PlacementRewardPrize = BasePlacementRewardPrize & OneOf<{
    currency: PlacementRewardPrizeCurrency;
    experiencePoints: PlacementRewardPrizeExperiencePoints;
}>;
export type PlacementReward = {
    rarity?: RarityRarity.Rarity;
    prizes?: PlacementRewardPrize[];
};
export type RewardDescriptionPrizeDescription = {
    kind?: RewardDescriptionPrizeDescriptionKind;
    value?: string;
    min?: string;
    max?: string;
    amount?: string;
};
export type RewardDescription = {
    rarity?: RarityRarity.Rarity;
    prizes?: RewardDescriptionPrizeDescription[];
    readyAt?: string;
};
export type PlacementRewardsItem = {
    reward?: PlacementReward;
    readyAt?: string;
};
export type PlacementRewards = {
    items?: PlacementRewardsItem[];
};
export type Placement = {
    userId?: string;
    placementId?: string;
    state?: PlacementState;
    progress?: string;
    reward?: PlacementReward;
    referenceId?: string;
    readyAt?: string;
    rewards?: PlacementRewards;
    version?: string;
};
export type GetPlacementRequest = {
    placementId?: string;
};
export type GetPlacementResponse = {
    placementId?: string;
    state?: PlacementState;
    updatesAt?: string;
    referenceId?: string;
    reward?: RewardDescription;
    rewards?: RewardDescription[];
};
export type RewardPlacementRequest = {
    placementId?: string;
};
export interface IPlacementRewardPrizeContentDelegate<C> {
    onCurrency(ctx: C, ev: PlacementRewardPrizeCurrency): void;
    onExperiencePoints(ctx: C, ev: PlacementRewardPrizeExperiencePoints): void;
}
export declare function routePlacementRewardPrizeContentDelegate<C>(ctx: C, val: PlacementRewardPrize, delegate: IPlacementRewardPrizeContentDelegate<C>): void;
export declare class PlacementsService {
    static GetPlacement(req: GetPlacementRequest, initReq?: fm.InitReq): Promise<GetPlacementResponse>;
    static RewardPlacement(req: RewardPlacementRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export {};
//# sourceMappingURL=ads.pb.d.ts.map