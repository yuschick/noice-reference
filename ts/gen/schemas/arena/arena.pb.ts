/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type ServerSideArenaConfig = {
  contentCatalogUrl?: string
  arenaConfigUrl?: string
  gameViewScreenshotUrl?: string
}


type BaseArena = {
  id?: string
  name?: string
  thumbnailUrl?: string
  enabled?: boolean
}

export type Arena = BaseArena
  & OneOf<{ serverSideConfig: ServerSideArenaConfig }>

export type ClientSideArena = {
  id?: string
  enabled?: boolean
  version?: string
  name?: string
  thumbnailUrl?: string
  glbUrl?: string
  lightmapUrl?: string
  environmentUrl?: string
}

export type GetArenaRequest = {
  id?: string
}

export type ListArenasRequest = {
  channelId?: string
  cursor?: ApiCursor.Cursor
}

export type ListArenasResponse = {
  arenas?: Arena[]
  pageInfo?: ApiCursor.PageInfo
}

export type GetClientSideArenaRequest = {
  id?: string
}

export type ListClientSideArenasRequest = {
  channelId?: string
}

export type ListClientSideArenasResponse = {
  arenas?: ClientSideArena[]
}




export interface IArenaConfigDelegate<C> {
  onServerSideConfig(ctx: C, ev: ServerSideArenaConfig): void
}

export function routeArenaConfigDelegate<C>(ctx: C, val: Arena, delegate: IArenaConfigDelegate<C>) {
  val?.serverSideConfig && delegate.onServerSideConfig(ctx, val.serverSideConfig)
}

export class ArenaService {
  static GetArena(req: GetArenaRequest, initReq?: fm.InitReq): Promise<Arena> {
    return fm.fetchReq<GetArenaRequest, Arena>(`/v1/arenas/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static ListArenas(req: ListArenasRequest, initReq?: fm.InitReq): Promise<ListArenasResponse> {
    return fm.fetchReq<ListArenasRequest, ListArenasResponse>(`/v1/arenas?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
  static GetClientSideArena(req: GetClientSideArenaRequest, initReq?: fm.InitReq): Promise<ClientSideArena> {
    return fm.fetchReq<GetClientSideArenaRequest, ClientSideArena>(`/v1/clientSideArenas/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static ListClientSideArenas(req: ListClientSideArenasRequest, initReq?: fm.InitReq): Promise<ListClientSideArenasResponse> {
    return fm.fetchReq<ListClientSideArenasRequest, ListClientSideArenasResponse>(`/v1/clientSideArenas?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}