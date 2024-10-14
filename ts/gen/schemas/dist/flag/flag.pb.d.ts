import * as fm from "../fetch.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type FeatureFlagConfigUpdate = {
    config?: FeatureFlagConfig;
};
export type UserInfo = {
    userId?: string;
    roles?: string[];
};
export type ChannelInfo = {
    channelId?: string;
    gameId?: string;
    isPublic?: boolean;
};
export type CallerInfo = {
    userId?: string;
    channelId?: string;
};
export type FeatureFlagGroupValue = {
    value?: string;
    weight?: number;
};
export type FeatureFlagGroupConditionEq = {
    field?: string;
    value?: string;
};
export type FeatureFlagGroupConditionAny = {
    field?: string;
    values?: string[];
};
type BaseFeatureFlagGroupCondition = {};
export type FeatureFlagGroupCondition = BaseFeatureFlagGroupCondition & OneOf<{
    eq: FeatureFlagGroupConditionEq;
    any: FeatureFlagGroupConditionAny;
}>;
export type FeatureFlagGroup = {
    id?: string;
    enabled?: boolean;
    conditions?: FeatureFlagGroupCondition[];
    values?: FeatureFlagGroupValue[];
    default?: boolean;
};
export type FeatureFlag = {
    name?: string;
    description?: string;
    enabled?: boolean;
    groups?: FeatureFlagGroup[];
};
export type FeatureFlagState = {
    name?: string;
    value?: string;
    revision?: string;
};
export type FeatureFlagList = {
    flags?: FeatureFlag[];
};
export type FeatureFlagConfig = {
    revision?: string;
    createdAt?: string;
    userFlags?: FeatureFlagList;
    channelFlags?: FeatureFlagList;
};
export type GetFeatureFlagConfigRequest = {
    revision?: string;
};
export type GetFeatureFlagConfigResponse = {
    config?: FeatureFlagConfig;
};
export type SetFeatureFlagConfigRequest = {
    previousRevision?: string;
    config?: FeatureFlagConfig;
    validateSchema?: boolean;
};
export type GetUserFeatureFlagRequest = {
    userId?: string;
    flagName?: string;
};
export type ListUserFeatureFlagsRequest = {
    userId?: string;
};
export type ListUserFeatureFlagsResponse = {
    flags?: FeatureFlagState[];
};
export type GetChannelFeatureFlagRequest = {
    channelId?: string;
    flagName?: string;
};
export type ListChannelFeatureFlagsRequest = {
    channelId?: string;
};
export type ListChannelFeatureFlagsResponse = {
    flags?: FeatureFlagState[];
};
export type JSONSchema = {
    description?: string;
    type?: string;
    enum?: string[];
    pattern?: string;
    minimum?: number;
    maximum?: number;
    multipleOf?: number;
    properties?: {
        [key: string]: JSONSchema;
    };
    patternProperties?: {
        [key: string]: JSONSchema;
    };
    items?: JSONSchema;
};
export type FeatureFlagSchema = {
    flags?: {
        [key: string]: JSONSchema;
    };
};
export type GetFeatureFlagSchemaRequest = {};
export type ChannelFeatureFlagValueUpdateEvent = {
    channelId?: string;
    flags?: FeatureFlagState[];
};
export type UserFeatureFlagValueUpdateEvent = {
    userId?: string;
    flags?: FeatureFlagState[];
};
export interface IFeatureFlagGroupConditionRuleDelegate<C> {
    onEq(ctx: C, ev: FeatureFlagGroupConditionEq): void;
    onAny(ctx: C, ev: FeatureFlagGroupConditionAny): void;
}
export declare function routeFeatureFlagGroupConditionRuleDelegate<C>(ctx: C, val: FeatureFlagGroupCondition, delegate: IFeatureFlagGroupConditionRuleDelegate<C>): void;
export declare class FeatureFlagService {
    static GetFeatureFlagConfig(req: GetFeatureFlagConfigRequest, initReq?: fm.InitReq): Promise<FeatureFlagConfig>;
    static StreamConfigUpdates(req: GetFeatureFlagConfigRequest, entityNotifier?: fm.NotifyStreamEntityArrival<FeatureFlagConfig>, initReq?: fm.InitReq): Promise<void>;
    static SetFeatureFlagConfig(req: SetFeatureFlagConfigRequest, initReq?: fm.InitReq): Promise<FeatureFlagConfig>;
    static GetUserFeatureFlag(req: GetUserFeatureFlagRequest, initReq?: fm.InitReq): Promise<FeatureFlagState>;
    static ListUserFeatureFlags(req: ListUserFeatureFlagsRequest, initReq?: fm.InitReq): Promise<ListUserFeatureFlagsResponse>;
    static GetChannelFeatureFlag(req: GetChannelFeatureFlagRequest, initReq?: fm.InitReq): Promise<FeatureFlagState>;
    static ListChannelFeatureFlags(req: ListChannelFeatureFlagsRequest, initReq?: fm.InitReq): Promise<ListChannelFeatureFlagsResponse>;
    static GetFeatureFlagSchema(req: GetFeatureFlagSchemaRequest, initReq?: fm.InitReq): Promise<FeatureFlagSchema>;
}
export {};
//# sourceMappingURL=flag.pb.d.ts.map