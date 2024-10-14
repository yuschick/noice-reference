/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type Permit = {
  resourceType?: string
  resourceId?: string
}

export type RolesList = {
  roles?: string[]
}

export type GetRolesRequest = {
  userId?: string
  permit?: Permit
}

export type GetRolesResponse = {
  roles?: string[]
}

export type BatchGetRolesRequest = {
  userId?: string
  permits?: Permit[]
}

export type BatchGetRolesResponse = {
  resourceRoles?: RolesList[]
}

export class RolesService {
  static GetRoles(req: GetRolesRequest, initReq?: fm.InitReq): Promise<GetRolesResponse> {
    return fm.fetchReq<GetRolesRequest, GetRolesResponse>(`/access.RolesService/GetRoles`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static BatchGetRoles(req: BatchGetRolesRequest, initReq?: fm.InitReq): Promise<BatchGetRolesResponse> {
    return fm.fetchReq<BatchGetRolesRequest, BatchGetRolesResponse>(`/access.RolesService/BatchGetRoles`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}