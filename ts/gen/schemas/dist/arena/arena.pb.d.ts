import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export type ServerSideArenaConfig = {
    contentCatalogUrl?: string;
    arenaConfigUrl?: string;
    gameViewScreenshotUrl?: string;
};
type BaseArena = {
    id?: string;
    name?: string;
    thumbnailUrl?: string;
    enabled?: boolean;
};
export type Arena = BaseArena & OneOf<{
    serverSideConfig: ServerSideArenaConfig;
}>;
export type GetArenaRequest = {
    id?: string;
};
export type ListArenasRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
};
export type ListArenasResponse = {
    arenas?: Arena[];
    pageInfo?: ApiCursor.PageInfo;
};
export interface IArenaConfigDelegate<C> {
    onServerSideConfig(ctx: C, ev: ServerSideArenaConfig): void;
}
export declare function routeArenaConfigDelegate<C>(ctx: C, val: Arena, delegate: IArenaConfigDelegate<C>): void;
export declare class ArenaService {
    static GetArena(req: GetArenaRequest, initReq?: fm.InitReq): Promise<Arena>;
    static ListArenas(req: ListArenasRequest, initReq?: fm.InitReq): Promise<ListArenasResponse>;
}
export {};
//# sourceMappingURL=arena.pb.d.ts.map