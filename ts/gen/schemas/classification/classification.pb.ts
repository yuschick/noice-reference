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

export enum Topic {
  TOPIC_UNSPECIFIED = "TOPIC_UNSPECIFIED",
  TOPIC_GENERAL_RISK = "TOPIC_GENERAL_RISK",
  TOPIC_BULLYING = "TOPIC_BULLYING",
  TOPIC_VIOLENCE = "TOPIC_VIOLENCE",
  TOPIC_PERSONAL_IDENTIFYING_INFO = "TOPIC_PERSONAL_IDENTIFYING_INFO",
  TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT = "TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT",
  TOPIC_VULGARITY = "TOPIC_VULGARITY",
  TOPIC_DRUGS_AND_ALCOHOL = "TOPIC_DRUGS_AND_ALCOHOL",
  TOPIC_IN_APP = "TOPIC_IN_APP",
  TOPIC_ALARM = "TOPIC_ALARM",
  TOPIC_FRAUD = "TOPIC_FRAUD",
  TOPIC_HATE_SPEECH = "TOPIC_HATE_SPEECH",
  TOPIC_RELIGIOUS = "TOPIC_RELIGIOUS",
  TOPIC_JUNK = "TOPIC_JUNK",
  TOPIC_WEBSITE = "TOPIC_WEBSITE",
  TOPIC_CHILD_GROOMING = "TOPIC_CHILD_GROOMING",
  TOPIC_PUBLIC_THREAT = "TOPIC_PUBLIC_THREAT",
  TOPIC_REAL_NAME = "TOPIC_REAL_NAME",
  TOPIC_EXTREMISM = "TOPIC_EXTREMISM",
  TOPIC_SUBVERSIVE = "TOPIC_SUBVERSIVE",
  TOPIC_SENTIMENT = "TOPIC_SENTIMENT",
  TOPIC_POLITICS = "TOPIC_POLITICS",
}

export enum TextRisk {
  TEXT_RISK_UNSPECIFIED = "TEXT_RISK_UNSPECIFIED",
  TEXT_RISK_SAFE = "TEXT_RISK_SAFE",
  TEXT_RISK_LOW = "TEXT_RISK_LOW",
  TEXT_RISK_NOTABLE = "TEXT_RISK_NOTABLE",
  TEXT_RISK_QUESTIONABLE = "TEXT_RISK_QUESTIONABLE",
  TEXT_RISK_UNKNOWN = "TEXT_RISK_UNKNOWN",
  TEXT_RISK_MATURE = "TEXT_RISK_MATURE",
  TEXT_RISK_EXPLICIT = "TEXT_RISK_EXPLICIT",
  TEXT_RISK_DANGEROUS = "TEXT_RISK_DANGEROUS",
}

export enum TrustLevel {
  TRUST_LEVEL_UNSPECIFIED = "TRUST_LEVEL_UNSPECIFIED",
  TRUST_LEVEL_SUPERUSER = "TRUST_LEVEL_SUPERUSER",
  TRUST_LEVEL_TRUSTED = "TRUST_LEVEL_TRUSTED",
  TRUST_LEVEL_DEFAULT = "TRUST_LEVEL_DEFAULT",
  TRUST_LEVEL_NOT_TRUSTED = "TRUST_LEVEL_NOT_TRUSTED",
  TRUST_LEVEL_MUTE = "TRUST_LEVEL_MUTE",
}

export type EventEventTrustChanged = {
  message?: string
  id?: string
  oldTrustLevel?: TrustLevel
  trustLevel?: TrustLevel
}

export type EventEventFlooding = {
  count?: number
  limit?: number
  id?: string
}

export type EventCustomEvent = {
  message?: string
  id?: string
}


type BaseEvent = {
}

export type Event = BaseEvent
  & OneOf<{ eventTrustChanged: EventEventTrustChanged; eventFlooding: EventEventFlooding; customEvent: EventCustomEvent }>

export type TextClassificationTopicTextRiskLevel = {
  topic?: Topic
  risk?: TextRisk
}

export type TextClassification = {
  response?: boolean
  escalations?: string[]
  risk?: TextRisk
  trust?: TrustLevel
  events?: Event[]
  topics?: TextClassificationTopicTextRiskLevel[]
  hashes?: number[]
  hashed?: string
  notableIndexes?: number[]
  highRiskLanguage?: string
}




export interface IEventEventDelegate<C> {
  onEventTrustChanged(ctx: C, ev: EventEventTrustChanged): void
  onEventFlooding(ctx: C, ev: EventEventFlooding): void
  onCustomEvent(ctx: C, ev: EventCustomEvent): void
}

export function routeEventEventDelegate<C>(ctx: C, val: Event, delegate: IEventEventDelegate<C>) {
  val?.eventTrustChanged && delegate.onEventTrustChanged(ctx, val.eventTrustChanged)
  val?.eventFlooding && delegate.onEventFlooding(ctx, val.eventFlooding)
  val?.customEvent && delegate.onCustomEvent(ctx, val.customEvent)
}