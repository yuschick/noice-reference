/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"

export enum ChannelAssetType {
  CHANNEL_ASSET_TYPE_UNSPECIFIED = "CHANNEL_ASSET_TYPE_UNSPECIFIED",
  CHANNEL_ASSET_TYPE_LOGO = "CHANNEL_ASSET_TYPE_LOGO",
  CHANNEL_ASSET_TYPE_BANNER = "CHANNEL_ASSET_TYPE_BANNER",
}

export type ChannelAssetRejectedEvent = {
  channelId?: string
  streamerId?: string
  moderatorId?: string
  assetType?: ChannelAssetType
  mediaId?: string
}

export type RejectChannelAssetRequest = {
  channelId?: string
  assetType?: ChannelAssetType
  mediaId?: string
  moderatorId?: string
}

export class ChannelModerationInternalService {
  static RejectChannelAsset(req: RejectChannelAssetRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RejectChannelAssetRequest, GoogleProtobufEmpty.Empty>(`/moderation.ChannelModerationInternalService/RejectChannelAsset`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}