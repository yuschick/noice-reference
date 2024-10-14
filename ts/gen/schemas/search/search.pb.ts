/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"

export enum EntityType {
  ENTITY_TYPE_UNSPECIFIED = "ENTITY_TYPE_UNSPECIFIED",
  ENTITY_TYPE_USER = "ENTITY_TYPE_USER",
  ENTITY_TYPE_CHANNEL = "ENTITY_TYPE_CHANNEL",
  ENTITY_TYPE_GAME = "ENTITY_TYPE_GAME",
}

export type SearchRequest = {
  query?: string
  entityTypes?: EntityType[]
  cursor?: ApiCursor.Cursor
}

export type ResultItem = {
  entityType?: EntityType
  entityId?: string
  score?: number
  matchedProperties?: string[]
}

export type SearchResponse = {
  resultItems?: ResultItem[]
  pageInfo?: ApiCursor.PageInfo
}

export class SearchService {
  static Search(req: SearchRequest, initReq?: fm.InitReq): Promise<SearchResponse> {
    return fm.fetchReq<SearchRequest, SearchResponse>(`/v1/search`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static PublicSearch(req: SearchRequest, initReq?: fm.InitReq): Promise<SearchResponse> {
    return fm.fetchReq<SearchRequest, SearchResponse>(`/v1/search:public`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}