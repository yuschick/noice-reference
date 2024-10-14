/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
export type Cursor = {
  first?: number
  last?: number
  before?: string
  after?: string
}

export type PageInfo = {
  startCursor?: string
  endCursor?: string
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}