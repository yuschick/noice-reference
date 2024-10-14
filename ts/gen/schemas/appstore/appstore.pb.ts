/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as GoogleApiHttpbody from "../google/api/httpbody.pb"
export type CreateNotificationRequest = {
  signedPayload?: string
}

export class AppStoreNotificationService {
  static CreateNotification(req: CreateNotificationRequest, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody> {
    return fm.fetchReq<CreateNotificationRequest, GoogleApiHttpbody.HttpBody>(`/v1/appstore/notifications`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}