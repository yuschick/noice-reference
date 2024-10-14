/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

export enum StreamDeploymentStatusComponentStatus {
  COMPONENT_STATUS_UNSPECIFIED = "COMPONENT_STATUS_UNSPECIFIED",
  COMPONENT_STATUS_DISABLED = "COMPONENT_STATUS_DISABLED",
  COMPONENT_STATUS_OFFLINE = "COMPONENT_STATUS_OFFLINE",
  COMPONENT_STATUS_DEPLOYMENT_STARTED = "COMPONENT_STATUS_DEPLOYMENT_STARTED",
  COMPONENT_STATUS_PROVISIONING_NODE = "COMPONENT_STATUS_PROVISIONING_NODE",
  COMPONENT_STATUS_DEPLOYING_POD = "COMPONENT_STATUS_DEPLOYING_POD",
  COMPONENT_STATUS_DEPLOYING_CONTAINERS = "COMPONENT_STATUS_DEPLOYING_CONTAINERS",
  COMPONENT_STATUS_CONTAINERS_UNREADY = "COMPONENT_STATUS_CONTAINERS_UNREADY",
  COMPONENT_STATUS_READY = "COMPONENT_STATUS_READY",
}

export type ListDeploymentOptionsRequest = {
}

export type DeploymentOptionsListItem = {
  channelId?: string
  options?: DeploymentOptions
}

export type ListDeploymentOptionsResponse = {
  items?: DeploymentOptionsListItem[]
}

export type CreateDeploymentOptionsRequest = {
  channelId?: string
  options?: DeploymentOptions
}

export type CreateDeploymentOptionsResponse = {
}

export type UpdateDeploymentOptionsRequest = {
  channelId?: string
  options?: DeploymentOptions
}

export type UpdateDeploymentOptionsResponse = {
}

export type GetDeploymentOptionsRequest = {
  channelId?: string
}

export type GetDeploymentOptionsResponse = {
  options?: DeploymentOptions
}

export type DeleteDeploymentOptionsRequest = {
  channelId?: string
}

export type DeleteDeploymentOptionsResponse = {
}

export type DeploymentOptions = {
  mlDisabled?: boolean
  mlImage?: string
  crDisabled?: boolean
  crImage?: string
  recDisabled?: boolean
  recImage?: string
  crEnvVars?: {[key: string]: string}
  mlTritonImage?: string
  mlEnvVars?: {[key: string]: string}
  restreamerDisabled?: boolean
  restreamerImage?: string
  restreamerEnvVars?: {[key: string]: string}
  mlProxyImage?: string
  matchGameRunnerImage?: string
  matchGameRunnerEnvVars?: {[key: string]: string}
  matchGameRunnerDisabled?: boolean
  transcoderImage?: string
  transcoderEnvVars?: {[key: string]: string}
  transcoderDisabled?: boolean
}

export type StreamDeploymentStatus = {
  channelId?: string
  updateTime?: string
  crStatus?: StreamDeploymentStatusComponentStatus
  mlStatus?: StreamDeploymentStatusComponentStatus
  recStatus?: StreamDeploymentStatusComponentStatus
  streamId?: string
  restreamerStatus?: StreamDeploymentStatusComponentStatus
  egressStatus?: StreamDeploymentStatusComponentStatus
  gameRunnerStatus?: StreamDeploymentStatusComponentStatus
  transcoderStatus?: StreamDeploymentStatusComponentStatus
}

export class StreamDeploymentOptionsService {
  static GetDeploymentOptions(req: GetDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<GetDeploymentOptionsResponse> {
    return fm.fetchReq<GetDeploymentOptionsRequest, GetDeploymentOptionsResponse>(`/stream_deployment.StreamDeploymentOptionsService/GetDeploymentOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListDeploymentOptions(req: ListDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<ListDeploymentOptionsResponse> {
    return fm.fetchReq<ListDeploymentOptionsRequest, ListDeploymentOptionsResponse>(`/stream_deployment.StreamDeploymentOptionsService/ListDeploymentOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CreateDeploymentOptions(req: CreateDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<CreateDeploymentOptionsResponse> {
    return fm.fetchReq<CreateDeploymentOptionsRequest, CreateDeploymentOptionsResponse>(`/stream_deployment.StreamDeploymentOptionsService/CreateDeploymentOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateDeploymentOptions(req: UpdateDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<UpdateDeploymentOptionsResponse> {
    return fm.fetchReq<UpdateDeploymentOptionsRequest, UpdateDeploymentOptionsResponse>(`/stream_deployment.StreamDeploymentOptionsService/UpdateDeploymentOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteDeploymentOptions(req: DeleteDeploymentOptionsRequest, initReq?: fm.InitReq): Promise<DeleteDeploymentOptionsResponse> {
    return fm.fetchReq<DeleteDeploymentOptionsRequest, DeleteDeploymentOptionsResponse>(`/stream_deployment.StreamDeploymentOptionsService/DeleteDeploymentOptions`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}