/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);
export type AttributeMap = {
  value?: {[key: string]: Attribute}
}

export type AttributeIntArray = {
  value?: number[]
}

export type AttributeStringArray = {
  value?: string[]
}

export type AttributeFloatArray = {
  value?: number[]
}

export type AttributeBoolArray = {
  value?: boolean[]
}


type BaseAttribute = {
}

export type Attribute = BaseAttribute
  & OneOf<{ intValue: number; floatValue: number; stringValue: string; boolValue: boolean; mapValue: AttributeMap; intArrayValue: AttributeIntArray; floatArrayValue: AttributeFloatArray; stringArrayValue: AttributeStringArray; boolArrayValue: AttributeBoolArray }>




export interface IAttributeValueDelegate<C> {
  onIntValue(ctx: C, ev: number): void
  onFloatValue(ctx: C, ev: number): void
  onStringValue(ctx: C, ev: string): void
  onBoolValue(ctx: C, ev: boolean): void
  onMapValue(ctx: C, ev: AttributeMap): void
  onIntArrayValue(ctx: C, ev: AttributeIntArray): void
  onFloatArrayValue(ctx: C, ev: AttributeFloatArray): void
  onStringArrayValue(ctx: C, ev: AttributeStringArray): void
  onBoolArrayValue(ctx: C, ev: AttributeBoolArray): void
}

export function routeAttributeValueDelegate<C>(ctx: C, val: Attribute, delegate: IAttributeValueDelegate<C>) {
  val?.intValue && delegate.onIntValue(ctx, val.intValue)
  val?.floatValue && delegate.onFloatValue(ctx, val.floatValue)
  val?.stringValue && delegate.onStringValue(ctx, val.stringValue)
  val?.boolValue && delegate.onBoolValue(ctx, val.boolValue)
  val?.mapValue && delegate.onMapValue(ctx, val.mapValue)
  val?.intArrayValue && delegate.onIntArrayValue(ctx, val.intArrayValue)
  val?.floatArrayValue && delegate.onFloatArrayValue(ctx, val.floatArrayValue)
  val?.stringArrayValue && delegate.onStringArrayValue(ctx, val.stringArrayValue)
  val?.boolArrayValue && delegate.onBoolArrayValue(ctx, val.boolArrayValue)
}