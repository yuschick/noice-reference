import * as fm from "../fetch.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum CounterConfigDimensionDimensionType {
    DIMENSION_TYPE_UNSPECIFIED = "DIMENSION_TYPE_UNSPECIFIED",
    DIMENSION_TYPE_USER_GLOBAL = "DIMENSION_TYPE_USER_GLOBAL",
    DIMENSION_TYPE_USER_GAME = "DIMENSION_TYPE_USER_GAME",
    DIMENSION_TYPE_USER_CHANNEL = "DIMENSION_TYPE_USER_CHANNEL"
}
export declare enum CounterConfigDimensionWindowType {
    WINDOW_TYPE_UNSPECIFIED = "WINDOW_TYPE_UNSPECIFIED",
    WINDOW_TYPE_DAILY = "WINDOW_TYPE_DAILY",
    WINDOW_TYPE_WEEKLY = "WINDOW_TYPE_WEEKLY",
    WINDOW_TYPE_MONTHLY = "WINDOW_TYPE_MONTHLY"
}
export type Collector = {
    id?: string;
    eventName?: string;
    counterConfigIds?: string[];
};
export type CounterConfigDimension = {
    windowType?: CounterConfigDimensionWindowType;
    dimensionType?: CounterConfigDimensionDimensionType;
};
export type CounterConfig = {
    id?: string;
    description?: string;
    dimension?: CounterConfigDimension;
};
export type CounterDimensionUserGlobal = {
    userId?: string;
};
export type CounterDimensionUserGame = {
    userId?: string;
    gameId?: string;
};
export type CounterDimensionUserChannel = {
    userId?: string;
    channelId?: string;
};
type BaseCounterDimension = {};
export type CounterDimension = BaseCounterDimension & OneOf<{
    userGlobal: CounterDimensionUserGlobal;
    userGame: CounterDimensionUserGame;
    userChannel: CounterDimensionUserChannel;
}>;
export type Counter = {
    config?: CounterConfig;
    dimension?: CounterDimension;
    value?: number;
};
export type CounterUpdate = {
    configId?: string;
    dimension?: CounterDimension;
    oldValue?: number;
    newValue?: number;
};
export type ListUserStatsRequest = {
    userId?: string;
};
export type ListUserStatsResponse = {
    stats?: Counter[];
};
export type IncrCounterRequest = {
    counterId?: string;
    dimension?: CounterDimension;
    value?: number;
};
export type IncrCounterResponse = {
    newValue?: number;
};
export interface ICounterDimensionDimensionDelegate<C> {
    onUserGlobal(ctx: C, ev: CounterDimensionUserGlobal): void;
    onUserGame(ctx: C, ev: CounterDimensionUserGame): void;
    onUserChannel(ctx: C, ev: CounterDimensionUserChannel): void;
}
export declare function routeCounterDimensionDimensionDelegate<C>(ctx: C, val: CounterDimension, delegate: ICounterDimensionDimensionDelegate<C>): void;
export declare class StatService {
    static IncrCounter(req: IncrCounterRequest, initReq?: fm.InitReq): Promise<IncrCounterResponse>;
    static ListUserStats(req: ListUserStatsRequest, initReq?: fm.InitReq): Promise<ListUserStatsResponse>;
}
export {};
//# sourceMappingURL=stat.pb.d.ts.map