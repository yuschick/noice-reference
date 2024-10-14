/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
export type AgreementRevision = {
  name?: string
  revision?: string
  url?: string
}

export type ListAgreementsRequest = {
  includeOldRevisions?: boolean
}

export type ListAgreementResponse = {
  agreements?: AgreementRevision[]
}

export class AgreementService {
  static ListAgreements(req: ListAgreementsRequest, initReq?: fm.InitReq): Promise<ListAgreementResponse> {
    return fm.fetchReq<ListAgreementsRequest, ListAgreementResponse>(`/agreements?${fm.renderURLSearchParams(req, [])}`, {...initReq, method: "GET"})
  }
}