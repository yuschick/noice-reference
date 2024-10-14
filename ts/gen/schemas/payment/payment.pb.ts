/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AdyenAdyen from "../adyen/adyen.pb"
import * as ApiCursor from "../api/cursor.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum Currency {
  CURRENCY_UNSPECIFIED = "CURRENCY_UNSPECIFIED",
  CURRENCY_USD = "CURRENCY_USD",
  CURRENCY_EUR = "CURRENCY_EUR",
  CURRENCY_GBP = "CURRENCY_GBP",
  CURRENCY_AED = "CURRENCY_AED",
  CURRENCY_AFN = "CURRENCY_AFN",
  CURRENCY_ALL = "CURRENCY_ALL",
  CURRENCY_AMD = "CURRENCY_AMD",
  CURRENCY_ANG = "CURRENCY_ANG",
  CURRENCY_AOA = "CURRENCY_AOA",
  CURRENCY_ARS = "CURRENCY_ARS",
  CURRENCY_AUD = "CURRENCY_AUD",
  CURRENCY_AWG = "CURRENCY_AWG",
  CURRENCY_AZN = "CURRENCY_AZN",
  CURRENCY_BAM = "CURRENCY_BAM",
  CURRENCY_BBD = "CURRENCY_BBD",
  CURRENCY_BDT = "CURRENCY_BDT",
  CURRENCY_BGN = "CURRENCY_BGN",
  CURRENCY_BHD = "CURRENCY_BHD",
  CURRENCY_BIF = "CURRENCY_BIF",
  CURRENCY_BMD = "CURRENCY_BMD",
  CURRENCY_BND = "CURRENCY_BND",
  CURRENCY_BOB = "CURRENCY_BOB",
  CURRENCY_BOV = "CURRENCY_BOV",
  CURRENCY_BRL = "CURRENCY_BRL",
  CURRENCY_BSD = "CURRENCY_BSD",
  CURRENCY_BTN = "CURRENCY_BTN",
  CURRENCY_BWP = "CURRENCY_BWP",
  CURRENCY_BYN = "CURRENCY_BYN",
  CURRENCY_BZD = "CURRENCY_BZD",
  CURRENCY_CAD = "CURRENCY_CAD",
  CURRENCY_CDF = "CURRENCY_CDF",
  CURRENCY_CHE = "CURRENCY_CHE",
  CURRENCY_CHF = "CURRENCY_CHF",
  CURRENCY_CHW = "CURRENCY_CHW",
  CURRENCY_CLF = "CURRENCY_CLF",
  CURRENCY_CLP = "CURRENCY_CLP",
  CURRENCY_CNY = "CURRENCY_CNY",
  CURRENCY_COP = "CURRENCY_COP",
  CURRENCY_COU = "CURRENCY_COU",
  CURRENCY_CRC = "CURRENCY_CRC",
  CURRENCY_CUC = "CURRENCY_CUC",
  CURRENCY_CUP = "CURRENCY_CUP",
  CURRENCY_CVE = "CURRENCY_CVE",
  CURRENCY_CZK = "CURRENCY_CZK",
  CURRENCY_DJF = "CURRENCY_DJF",
  CURRENCY_DKK = "CURRENCY_DKK",
  CURRENCY_DOP = "CURRENCY_DOP",
  CURRENCY_DZD = "CURRENCY_DZD",
  CURRENCY_EGP = "CURRENCY_EGP",
  CURRENCY_ERN = "CURRENCY_ERN",
  CURRENCY_ETB = "CURRENCY_ETB",
  CURRENCY_FJD = "CURRENCY_FJD",
  CURRENCY_FKP = "CURRENCY_FKP",
  CURRENCY_GEL = "CURRENCY_GEL",
  CURRENCY_GHS = "CURRENCY_GHS",
  CURRENCY_GIP = "CURRENCY_GIP",
  CURRENCY_GMD = "CURRENCY_GMD",
  CURRENCY_GNF = "CURRENCY_GNF",
  CURRENCY_GTQ = "CURRENCY_GTQ",
  CURRENCY_GYD = "CURRENCY_GYD",
  CURRENCY_HKD = "CURRENCY_HKD",
  CURRENCY_HNL = "CURRENCY_HNL",
  CURRENCY_HTG = "CURRENCY_HTG",
  CURRENCY_HUF = "CURRENCY_HUF",
  CURRENCY_IDR = "CURRENCY_IDR",
  CURRENCY_ILS = "CURRENCY_ILS",
  CURRENCY_INR = "CURRENCY_INR",
  CURRENCY_IQD = "CURRENCY_IQD",
  CURRENCY_IRR = "CURRENCY_IRR",
  CURRENCY_ISK = "CURRENCY_ISK",
  CURRENCY_JMD = "CURRENCY_JMD",
  CURRENCY_JOD = "CURRENCY_JOD",
  CURRENCY_JPY = "CURRENCY_JPY",
  CURRENCY_KES = "CURRENCY_KES",
  CURRENCY_KGS = "CURRENCY_KGS",
  CURRENCY_KHR = "CURRENCY_KHR",
  CURRENCY_KMF = "CURRENCY_KMF",
  CURRENCY_KPW = "CURRENCY_KPW",
  CURRENCY_KRW = "CURRENCY_KRW",
  CURRENCY_KWD = "CURRENCY_KWD",
  CURRENCY_KYD = "CURRENCY_KYD",
  CURRENCY_KZT = "CURRENCY_KZT",
  CURRENCY_LAK = "CURRENCY_LAK",
  CURRENCY_LBP = "CURRENCY_LBP",
  CURRENCY_LKR = "CURRENCY_LKR",
  CURRENCY_LRD = "CURRENCY_LRD",
  CURRENCY_LSL = "CURRENCY_LSL",
  CURRENCY_LYD = "CURRENCY_LYD",
  CURRENCY_MAD = "CURRENCY_MAD",
  CURRENCY_MDL = "CURRENCY_MDL",
  CURRENCY_MGA = "CURRENCY_MGA",
  CURRENCY_MKD = "CURRENCY_MKD",
  CURRENCY_MMK = "CURRENCY_MMK",
  CURRENCY_MNT = "CURRENCY_MNT",
  CURRENCY_MOP = "CURRENCY_MOP",
  CURRENCY_MRU = "CURRENCY_MRU",
  CURRENCY_MUR = "CURRENCY_MUR",
  CURRENCY_MVR = "CURRENCY_MVR",
  CURRENCY_MWK = "CURRENCY_MWK",
  CURRENCY_MXN = "CURRENCY_MXN",
  CURRENCY_MXV = "CURRENCY_MXV",
  CURRENCY_MYR = "CURRENCY_MYR",
  CURRENCY_MZN = "CURRENCY_MZN",
  CURRENCY_NAD = "CURRENCY_NAD",
  CURRENCY_NGN = "CURRENCY_NGN",
  CURRENCY_NIO = "CURRENCY_NIO",
  CURRENCY_NOK = "CURRENCY_NOK",
  CURRENCY_NPR = "CURRENCY_NPR",
  CURRENCY_NZD = "CURRENCY_NZD",
  CURRENCY_OMR = "CURRENCY_OMR",
  CURRENCY_PAB = "CURRENCY_PAB",
  CURRENCY_PEN = "CURRENCY_PEN",
  CURRENCY_PGK = "CURRENCY_PGK",
  CURRENCY_PHP = "CURRENCY_PHP",
  CURRENCY_PKR = "CURRENCY_PKR",
  CURRENCY_PLN = "CURRENCY_PLN",
  CURRENCY_PYG = "CURRENCY_PYG",
  CURRENCY_QAR = "CURRENCY_QAR",
  CURRENCY_RON = "CURRENCY_RON",
  CURRENCY_RSD = "CURRENCY_RSD",
  CURRENCY_RUB = "CURRENCY_RUB",
  CURRENCY_RWF = "CURRENCY_RWF",
  CURRENCY_SAR = "CURRENCY_SAR",
  CURRENCY_SBD = "CURRENCY_SBD",
  CURRENCY_SCR = "CURRENCY_SCR",
  CURRENCY_SDG = "CURRENCY_SDG",
  CURRENCY_SEK = "CURRENCY_SEK",
  CURRENCY_SGD = "CURRENCY_SGD",
  CURRENCY_SHP = "CURRENCY_SHP",
  CURRENCY_SLE = "CURRENCY_SLE",
  CURRENCY_SOS = "CURRENCY_SOS",
  CURRENCY_SRD = "CURRENCY_SRD",
  CURRENCY_SSP = "CURRENCY_SSP",
  CURRENCY_STN = "CURRENCY_STN",
  CURRENCY_SVC = "CURRENCY_SVC",
  CURRENCY_SYP = "CURRENCY_SYP",
  CURRENCY_SZL = "CURRENCY_SZL",
  CURRENCY_THB = "CURRENCY_THB",
  CURRENCY_TJS = "CURRENCY_TJS",
  CURRENCY_TMT = "CURRENCY_TMT",
  CURRENCY_TND = "CURRENCY_TND",
  CURRENCY_TOP = "CURRENCY_TOP",
  CURRENCY_TRY = "CURRENCY_TRY",
  CURRENCY_TTD = "CURRENCY_TTD",
  CURRENCY_TWD = "CURRENCY_TWD",
  CURRENCY_TZS = "CURRENCY_TZS",
  CURRENCY_UAH = "CURRENCY_UAH",
  CURRENCY_UGX = "CURRENCY_UGX",
  CURRENCY_USN = "CURRENCY_USN",
  CURRENCY_UYI = "CURRENCY_UYI",
  CURRENCY_UYU = "CURRENCY_UYU",
  CURRENCY_UYW = "CURRENCY_UYW",
  CURRENCY_UZS = "CURRENCY_UZS",
  CURRENCY_VED = "CURRENCY_VED",
  CURRENCY_VES = "CURRENCY_VES",
  CURRENCY_VND = "CURRENCY_VND",
  CURRENCY_VUV = "CURRENCY_VUV",
  CURRENCY_WST = "CURRENCY_WST",
  CURRENCY_XAF = "CURRENCY_XAF",
  CURRENCY_XAG = "CURRENCY_XAG",
  CURRENCY_XAU = "CURRENCY_XAU",
  CURRENCY_XBA = "CURRENCY_XBA",
  CURRENCY_XBB = "CURRENCY_XBB",
  CURRENCY_XBC = "CURRENCY_XBC",
  CURRENCY_XBD = "CURRENCY_XBD",
  CURRENCY_XCD = "CURRENCY_XCD",
  CURRENCY_XDR = "CURRENCY_XDR",
  CURRENCY_XOF = "CURRENCY_XOF",
  CURRENCY_XPD = "CURRENCY_XPD",
  CURRENCY_XPF = "CURRENCY_XPF",
  CURRENCY_XPT = "CURRENCY_XPT",
  CURRENCY_XSU = "CURRENCY_XSU",
  CURRENCY_XTS = "CURRENCY_XTS",
  CURRENCY_XUA = "CURRENCY_XUA",
  CURRENCY_XXX = "CURRENCY_XXX",
  CURRENCY_YER = "CURRENCY_YER",
  CURRENCY_ZAR = "CURRENCY_ZAR",
  CURRENCY_ZMW = "CURRENCY_ZMW",
  CURRENCY_ZWL = "CURRENCY_ZWL",
}

export enum PaymentStatus {
  PAYMENT_STATUS_UNSPECIFIED = "PAYMENT_STATUS_UNSPECIFIED",
  PAYMENT_STATUS_PENDING = "PAYMENT_STATUS_PENDING",
  PAYMENT_STATUS_SUCCESS = "PAYMENT_STATUS_SUCCESS",
  PAYMENT_STATUS_FAILED = "PAYMENT_STATUS_FAILED",
  PAYMENT_STATUS_REVERSED = "PAYMENT_STATUS_REVERSED",
  PAYMENT_STATUS_EXPIRED = "PAYMENT_STATUS_EXPIRED",
}

export enum PaymentProvider {
  PAYMENT_PROVIDER_UNSPECIFIED = "PAYMENT_PROVIDER_UNSPECIFIED",
  PAYMENT_PROVIDER_ADYEN = "PAYMENT_PROVIDER_ADYEN",
  PAYMENT_PROVIDER_APPSTORE = "PAYMENT_PROVIDER_APPSTORE",
}

export type ReportAvailableNotificationEvent = {
  provider?: string
  timestamp?: string
  fileUrl?: string
}

export type Receipt = {
  id?: string
  userId?: string
  userName?: string
  amount?: Amount
  timestamp?: string
  customerCountry?: string
  items?: LineItem[]
  tax?: Tax
}

export type Amount = {
  value?: number
  currency?: Currency
}

export type PaymentEvent = {
  id?: string
  status?: PaymentStatus
  userId?: string
  amount?: Amount
  timestamp?: string
  meta?: SessionMeta
  cardIssuingCountry?: string
  externalReference?: string
  tax?: Tax
  provider?: PaymentProvider
}

export type SessionMeta = {
  namespace?: string
  attributes?: {[key: string]: string}
}

export type PaymentInfo = {
  cardHolderName?: string
  cardIssuingCountry?: string
  cardSummary?: string
}

export type Tax = {
  amount?: Amount
  rate?: number
  rateInBasisPoints?: number
}

export type Payment = {
  id?: string
  externalReference?: string
  status?: PaymentStatus
  userId?: string
  amount?: Amount
  items?: LineItem[]
  timestamp?: string
  meta?: SessionMeta
  info?: PaymentInfo
  tax?: Tax
  provider?: PaymentProvider
}

export type LineItems = {
  items?: LineItem[]
}

export type LineItem = {
  description?: string
  quantity?: string
  price?: string
  currency?: Currency
}

export type CreatePaymentRequest = {
  userId?: string
  status?: PaymentStatus
  externalReference?: string
  amount?: Amount
  items?: LineItem[]
  timestamp?: string
  meta?: SessionMeta
  info?: PaymentInfo
  tax?: Tax
  provider?: PaymentProvider
}

export type StartSessionRequest = {
  userId?: string
  amount?: Amount
  items?: LineItem[]
  returnUrl?: string
  meta?: SessionMeta
  provider?: PaymentProvider
}

export type AppStoreSession = {
  productId?: string
  paymentId?: string
}


type BaseSession = {
}

export type Session = BaseSession
  & OneOf<{ adyen: AdyenAdyen.Session; appstore: AppStoreSession }>

export type ListSuccessfulPaymentsRequestFilter = {
  from?: string
  to?: string
}

export type ListSuccessfulPaymentsRequest = {
  userId?: string
  filter?: ListSuccessfulPaymentsRequestFilter
  cursor?: ApiCursor.Cursor
}

export type GetPaymentRequest = {
  id?: string
}

export type RefundPaymentRequest = {
  id?: string
  amount?: Amount
  reason?: string
}

export type ListSuccessfulPaymentsResponse = {
  payments?: Payment[]
  pageInfo?: ApiCursor.PageInfo
}

export type ListPaymentsRequestFilter = {
  from?: string
  to?: string
  statuses?: PaymentStatus[]
}

export type ListPaymentsRequest = {
  userId?: string
  filter?: ListPaymentsRequestFilter
  cursor?: ApiCursor.Cursor
}

export type ListPaymentsResponse = {
  payments?: Payment[]
  pageInfo?: ApiCursor.PageInfo
}




export interface ISessionSessionDelegate<C> {
  onAdyen(ctx: C, ev: AdyenAdyen.Session): void
  onAppstore(ctx: C, ev: AppStoreSession): void
}

export function routeSessionSessionDelegate<C>(ctx: C, val: Session, delegate: ISessionSessionDelegate<C>) {
  val?.adyen && delegate.onAdyen(ctx, val.adyen)
  val?.appstore && delegate.onAppstore(ctx, val.appstore)
}

export class PaymentService {
  static CreatePayment(req: CreatePaymentRequest, initReq?: fm.InitReq): Promise<Payment> {
    return fm.fetchReq<CreatePaymentRequest, Payment>(`/v1/payments`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static StartSession(req: StartSessionRequest, initReq?: fm.InitReq): Promise<Session> {
    return fm.fetchReq<StartSessionRequest, Session>(`/v1/payment/session`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetPayment(req: GetPaymentRequest, initReq?: fm.InitReq): Promise<Payment> {
    return fm.fetchReq<GetPaymentRequest, Payment>(`/v1/payments/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, {...initReq, method: "GET"})
  }
  static RefundPayment(req: RefundPaymentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<RefundPaymentRequest, GoogleProtobufEmpty.Empty>(`/v1/payments/${req["id"]}:refund`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ListSuccessfulPayments(req: ListSuccessfulPaymentsRequest, initReq?: fm.InitReq): Promise<ListSuccessfulPaymentsResponse> {
    return fm.fetchReq<ListSuccessfulPaymentsRequest, ListSuccessfulPaymentsResponse>(`/v1/users/${req["userId"]}/successfulPayments?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static ListPayments(req: ListPaymentsRequest, initReq?: fm.InitReq): Promise<ListPaymentsResponse> {
    return fm.fetchReq<ListPaymentsRequest, ListPaymentsResponse>(`/v1/users/${req["userId"]}/payments?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
}