type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum MuxerActionConnectMethod {
    METHOD_UNSPECIFIED = "METHOD_UNSPECIFIED",
    METHOD_GET = "METHOD_GET",
    METHOD_POST = "METHOD_POST",
    METHOD_PUT = "METHOD_PUT",
    METHOD_PATCH = "METHOD_PATCH",
    METHOD_DELETE = "METHOD_DELETE"
}
export type MuxerActionGlobalHeaders = {
    headers?: {
        [key: string]: string;
    };
};
export type MuxerActionConnect = {
    id?: number;
    headers?: {
        [key: string]: string;
    };
    method?: MuxerActionConnectMethod;
    path?: string;
};
export type MuxerActionDisconnect = {
    id?: number;
};
export type MuxerActionData = {
    id?: number;
    data?: string;
    eof?: boolean;
};
export type MuxerActionPong = {
    seq?: number;
};
type BaseMuxerAction = {};
export type MuxerAction = BaseMuxerAction & OneOf<{
    addHeaders: MuxerActionGlobalHeaders;
    removeHeaders: MuxerActionGlobalHeaders;
    connect: MuxerActionConnect;
    disconnect: MuxerActionDisconnect;
    data: MuxerActionData;
    pong: MuxerActionPong;
}>;
export type MuxerEventConnected = {
    id?: number;
};
export type MuxerEventDisconnected = {
    id?: number;
    code?: number;
    reason?: string;
};
export type MuxerEventData = {
    id?: number;
    data?: string;
    eof?: boolean;
};
export type MuxerEventPing = {
    seq?: number;
};
export type MuxerEventError = {
    id?: number;
    code?: number;
    reason?: string;
};
export type MuxerEventServerShuttingDown = {};
type BaseMuxerEvent = {};
export type MuxerEvent = BaseMuxerEvent & OneOf<{
    connected: MuxerEventConnected;
    disconnected: MuxerEventDisconnected;
    data: MuxerEventData;
    ping: MuxerEventPing;
    error: MuxerEventError;
    serverShuttingDown: MuxerEventServerShuttingDown;
}>;
export interface IMuxerActionActionDelegate<C> {
    onAddHeaders(ctx: C, ev: MuxerActionGlobalHeaders): void;
    onRemoveHeaders(ctx: C, ev: MuxerActionGlobalHeaders): void;
    onConnect(ctx: C, ev: MuxerActionConnect): void;
    onDisconnect(ctx: C, ev: MuxerActionDisconnect): void;
    onData(ctx: C, ev: MuxerActionData): void;
    onPong(ctx: C, ev: MuxerActionPong): void;
}
export declare function routeMuxerActionActionDelegate<C>(ctx: C, val: MuxerAction, delegate: IMuxerActionActionDelegate<C>): void;
export interface IMuxerEventEventDelegate<C> {
    onConnected(ctx: C, ev: MuxerEventConnected): void;
    onDisconnected(ctx: C, ev: MuxerEventDisconnected): void;
    onData(ctx: C, ev: MuxerEventData): void;
    onPing(ctx: C, ev: MuxerEventPing): void;
    onError(ctx: C, ev: MuxerEventError): void;
    onServerShuttingDown(ctx: C, ev: MuxerEventServerShuttingDown): void;
}
export declare function routeMuxerEventEventDelegate<C>(ctx: C, val: MuxerEvent, delegate: IMuxerEventEventDelegate<C>): void;
export {};
//# sourceMappingURL=muxer.pb.d.ts.map