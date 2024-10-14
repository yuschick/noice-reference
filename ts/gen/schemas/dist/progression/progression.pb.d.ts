import * as fm from "../fetch.pb";
import * as ReasonReason from "../reason/reason.pb";
import * as RewardReward from "../reward/reward.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type ProgressionUpdateEventUpdateExperiencePointUpdate = {
    oldPoints?: ExperiencePoints;
    newPoints?: ExperiencePoints;
};
export type ProgressionUpdateEventUpdateLevelUpdate = {
    oldLevel?: Level;
    newLevel?: Level;
};
type BaseProgressionUpdateEventUpdate = {};
export type ProgressionUpdateEventUpdate = BaseProgressionUpdateEventUpdate & OneOf<{
    experiencePoints: ProgressionUpdateEventUpdateExperiencePointUpdate;
    level: ProgressionUpdateEventUpdateLevelUpdate;
}>;
export type ProgressionUpdateEvent = {
    updates?: ProgressionUpdateEventUpdate[];
    reason?: ReasonReason.Reason;
};
export type LevelConfig = {
    number?: string;
    threshold?: string;
    seasonId?: string;
    channelId?: string;
    rewards?: RewardReward.RewardType[];
};
export type Fan = {
    userId?: string;
};
export type Season = {
    userId?: string;
    seasonId?: string;
};
export type Channel = {
    userId?: string;
    channelId?: string;
};
type BaseExperiencePoints = {
    amount?: string;
};
export type ExperiencePoints = BaseExperiencePoints & OneOf<{
    fan: Fan;
    season: Season;
    channel: Channel;
}>;
type BaseLevel = {
    number?: string;
};
export type Level = BaseLevel & OneOf<{
    fan: Fan;
    season: Season;
    channel: Channel;
}>;
export type GetUserProgressionRequest = {
    userId?: string;
};
export type GetUserProgressionResponse = {
    experiencePoints?: ExperiencePoints[];
    levels?: Level[];
};
export type SeasonProgression = {
    seasonId?: string;
    xpAmount?: string;
    level?: string;
    nextLevelThreshold?: string;
    nextLevel?: string;
};
export type GetSeasonProgressionRequest = {
    userId?: string;
    seasonId?: string;
};
export type ListSeasonProgressionRequest = {
    userId?: string;
};
export type ListSeasonProgressionResponse = {
    progression?: SeasonProgression[];
};
export type BatchGetSeasonProgressionRequestQuery = {
    userId?: string;
    seasonId?: string;
};
export type BatchGetSeasonProgressionRequest = {
    queries?: BatchGetSeasonProgressionRequestQuery[];
};
export type BatchGetSeasonProgressionResponse = {
    progression?: SeasonProgression[];
};
export type ListLevelConfigsRequest = {
    seasonId?: string;
    minLevel?: number;
    maxLevel?: number;
};
export type ListLevelConfigsResponse = {
    levelConfigs?: LevelConfig[];
};
export type GetDailyXPBoostLimitRequest = {};
export type GetDailyXPBoostLimitResponse = {
    remainingDailyXpBoost?: string;
};
export type GetDailyParticipationLimitRequest = {};
export type GetDailyParticipationLimitResponse = {
    remainingDailyParticipationMinutes?: string;
};
export type GetDailyXPEarningsLimitRequest = {};
export type GetDailyXPEarningsLimitResponse = {
    remainingDailyXpEarningsMinutes?: string;
};
export type ResetUserProgressionRequest = {
    userId?: string;
};
export type ResetUserProgressionResponse = {};
export type AddExperiencePointsRequest = {
    userId?: string;
    seasonId?: string;
    xpAmount?: string;
    reason?: string;
};
export type AddExperiencePointsResponse = {
    totalXp?: string;
};
export type ResetUserSeasonProgressionRequest = {
    userId?: string;
    seasonId?: string;
};
export type ResetUserSeasonProgressionResponse = {};
export interface IProgressionUpdateEventUpdateUpdateDelegate<C> {
    onExperiencePoints(ctx: C, ev: ProgressionUpdateEventUpdateExperiencePointUpdate): void;
    onLevel(ctx: C, ev: ProgressionUpdateEventUpdateLevelUpdate): void;
}
export declare function routeProgressionUpdateEventUpdateUpdateDelegate<C>(ctx: C, val: ProgressionUpdateEventUpdate, delegate: IProgressionUpdateEventUpdateUpdateDelegate<C>): void;
export interface IExperiencePointsTargetDelegate<C> {
    onFan(ctx: C, ev: Fan): void;
    onSeason(ctx: C, ev: Season): void;
    onChannel(ctx: C, ev: Channel): void;
}
export declare function routeExperiencePointsTargetDelegate<C>(ctx: C, val: ExperiencePoints, delegate: IExperiencePointsTargetDelegate<C>): void;
export interface ILevelTargetDelegate<C> {
    onFan(ctx: C, ev: Fan): void;
    onSeason(ctx: C, ev: Season): void;
    onChannel(ctx: C, ev: Channel): void;
}
export declare function routeLevelTargetDelegate<C>(ctx: C, val: Level, delegate: ILevelTargetDelegate<C>): void;
export declare class ProgressionService {
    static GetUserProgression(req: GetUserProgressionRequest, initReq?: fm.InitReq): Promise<GetUserProgressionResponse>;
    static GetSeasonProgression(req: GetSeasonProgressionRequest, initReq?: fm.InitReq): Promise<SeasonProgression>;
    static ListSeasonProgression(req: ListSeasonProgressionRequest, initReq?: fm.InitReq): Promise<ListSeasonProgressionResponse>;
    static BatchGetSeasonProgression(req: BatchGetSeasonProgressionRequest, initReq?: fm.InitReq): Promise<BatchGetSeasonProgressionResponse>;
    static ListLevelConfigs(req: ListLevelConfigsRequest, initReq?: fm.InitReq): Promise<ListLevelConfigsResponse>;
    static GetDailyXPBoostLimit(req: GetDailyXPBoostLimitRequest, initReq?: fm.InitReq): Promise<GetDailyXPBoostLimitResponse>;
    static GetDailyParticipationLimit(req: GetDailyParticipationLimitRequest, initReq?: fm.InitReq): Promise<GetDailyParticipationLimitResponse>;
    static GetDailyXPEarningsLimit(req: GetDailyXPEarningsLimitRequest, initReq?: fm.InitReq): Promise<GetDailyXPEarningsLimitResponse>;
}
export declare class ProgressionAdminService {
    static ResetUserProgression(req: ResetUserProgressionRequest, initReq?: fm.InitReq): Promise<ResetUserProgressionResponse>;
    static AddExperiencePoints(req: AddExperiencePointsRequest, initReq?: fm.InitReq): Promise<AddExperiencePointsResponse>;
    static ResetUserSeasonProgression(req: ResetUserSeasonProgressionRequest, initReq?: fm.InitReq): Promise<ResetUserSeasonProgressionResponse>;
}
export {};
//# sourceMappingURL=progression.pb.d.ts.map