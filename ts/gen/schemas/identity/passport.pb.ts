/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

export enum PassportTokenSource {
  UNSPECIFIED = "UNSPECIFIED",
  NAKAMA = "NAKAMA",
}

export type PassportUserInfo = {
  id?: string
  username?: string
  roles?: string[]
  scopes?: string[]
  labels?: string[]
}

export type Passport = {
  source?: PassportTokenSource
  user?: PassportUserInfo
}