import * as fm from "../fetch.pb";
import * as ReasonReason from "../reason/reason.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type RewardClaimEvent = {
    reward?: Reward;
};
export type RewardEvent = {
    reward?: Reward;
};
export type RewardTypeItem = {
    itemId?: string;
    itemCount?: string;
};
export type RewardTypeCurrency = {
    currencyId?: string;
    currencyAmount?: string;
};
type BaseRewardType = {};
export type RewardType = BaseRewardType & OneOf<{
    item: RewardTypeItem;
    currency: RewardTypeCurrency;
}>;
export type RewardTypeList = {
    rewards?: RewardType[];
};
export type Reward = {
    id?: string;
    userId?: string;
    rewardedAt?: string;
    type?: RewardType;
    reason?: ReasonReason.Reason;
};
export type ListRewardsRequest = {
    userId?: string;
};
export type ListRewardsResponse = {
    rewards?: Reward[];
};
export type ClaimRewardRequest = {
    rewardId?: string;
};
export type ClaimRewardResponse = {};
export type AwardRewardRequest = {
    userId?: string;
    rewardType?: RewardType;
    reason?: ReasonReason.Reason;
};
export type AwardRewardResponse = {
    rewardId?: string;
};
export interface IRewardTypeRewardDelegate<C> {
    onItem(ctx: C, ev: RewardTypeItem): void;
    onCurrency(ctx: C, ev: RewardTypeCurrency): void;
}
export declare function routeRewardTypeRewardDelegate<C>(ctx: C, val: RewardType, delegate: IRewardTypeRewardDelegate<C>): void;
export declare class RewardService {
    static ListRewards(req: ListRewardsRequest, initReq?: fm.InitReq): Promise<ListRewardsResponse>;
    static ClaimReward(req: ClaimRewardRequest, initReq?: fm.InitReq): Promise<ClaimRewardResponse>;
}
export declare class RewardAdminService {
    static AwardReward(req: AwardRewardRequest, initReq?: fm.InitReq): Promise<AwardRewardResponse>;
}
export {};
//# sourceMappingURL=reward.pb.d.ts.map