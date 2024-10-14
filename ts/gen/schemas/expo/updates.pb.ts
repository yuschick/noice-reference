/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufStruct from "../google/protobuf/struct.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
export type Manifest = {
  id?: string
  createdAt?: string
  runtimeVersion?: string
  launchAsset?: Asset
  assets?: Asset[]
  metadata?: {[key: string]: string}
  extra?: {[key: string]: GoogleProtobufStruct.Struct}
}

export type Asset = {
  hash?: string
  key?: string
  contentType?: string
  fileExtension?: string
  url?: string
}

export type GetLatestManifestRequest = {
}

export class UpdatesService {
  static GetLatestManifest(req: GetLatestManifestRequest, initReq?: fm.InitReq): Promise<Manifest> {
    return fm.fetchReq<GetLatestManifestRequest, Manifest>(`/v1/manifest?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}