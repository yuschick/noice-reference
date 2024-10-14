import * as AdyenAdyen from "../adyen/adyen.pb";
import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum Currency {
    CURRENCY_UNSPECIFIED = "CURRENCY_UNSPECIFIED",
    CURRENCY_USD = "CURRENCY_USD",
    CURRENCY_EUR = "CURRENCY_EUR",
    CURRENCY_GBP = "CURRENCY_GBP"
}
export declare enum PaymentStatus {
    PAYMENT_STATUS_UNSPECIFIED = "PAYMENT_STATUS_UNSPECIFIED",
    PAYMENT_STATUS_PENDING = "PAYMENT_STATUS_PENDING",
    PAYMENT_STATUS_SUCCESS = "PAYMENT_STATUS_SUCCESS",
    PAYMENT_STATUS_FAILED = "PAYMENT_STATUS_FAILED",
    PAYMENT_STATUS_REVERSED = "PAYMENT_STATUS_REVERSED",
    PAYMENT_STATUS_EXPIRED = "PAYMENT_STATUS_EXPIRED"
}
export type ReportAvailableNotificationEvent = {
    provider?: string;
    timestamp?: string;
    fileUrl?: string;
};
export type Receipt = {
    id?: string;
    userId?: string;
    userName?: string;
    amount?: Amount;
    timestamp?: string;
    customerCountry?: string;
    items?: LineItem[];
    tax?: Tax;
};
export type Amount = {
    value?: number;
    currency?: Currency;
};
export type PaymentEvent = {
    id?: string;
    status?: PaymentStatus;
    userId?: string;
    amount?: Amount;
    timestamp?: string;
    meta?: SessionMeta;
    cardIssuingCountry?: string;
    externalReference?: string;
    tax?: Tax;
};
export type SessionMeta = {
    namespace?: string;
    attributes?: {
        [key: string]: string;
    };
};
export type PaymentInfo = {
    cardHolderName?: string;
    cardIssuingCountry?: string;
    cardSummary?: string;
};
export type Tax = {
    amount?: Amount;
    rate?: number;
};
export type Payment = {
    id?: string;
    externalReference?: string;
    status?: PaymentStatus;
    userId?: string;
    amount?: Amount;
    items?: LineItem[];
    timestamp?: string;
    meta?: SessionMeta;
    info?: PaymentInfo;
    tax?: Tax;
};
export type LineItems = {
    items?: LineItem[];
};
export type LineItem = {
    description?: string;
    quantity?: string;
    price?: string;
    currency?: Currency;
};
export type CreatePaymentRequest = {
    userId?: string;
    status?: PaymentStatus;
    externalReference?: string;
    amount?: Amount;
    items?: LineItem[];
    timestamp?: string;
    meta?: SessionMeta;
    info?: PaymentInfo;
    tax?: Tax;
};
export type StartSessionRequest = {
    userId?: string;
    amount?: Amount;
    items?: LineItem[];
    returnUrl?: string;
    meta?: SessionMeta;
};
type BaseSession = {};
export type Session = BaseSession & OneOf<{
    adyen: AdyenAdyen.Session;
}>;
export type ListSuccessfulPaymentsRequestFilter = {
    from?: string;
    to?: string;
};
export type ListSuccessfulPaymentsRequest = {
    userId?: string;
    filter?: ListSuccessfulPaymentsRequestFilter;
    cursor?: ApiCursor.Cursor;
};
export type GetPaymentRequest = {
    id?: string;
};
export type RefundPaymentRequest = {
    id?: string;
    amount?: Amount;
    reason?: string;
};
export type ListSuccessfulPaymentsResponse = {
    payments?: Payment[];
    pageInfo?: ApiCursor.PageInfo;
};
export type ListPaymentsRequestFilter = {
    from?: string;
    to?: string;
    statuses?: PaymentStatus[];
};
export type ListPaymentsRequest = {
    userId?: string;
    filter?: ListPaymentsRequestFilter;
    cursor?: ApiCursor.Cursor;
};
export type ListPaymentsResponse = {
    payments?: Payment[];
    pageInfo?: ApiCursor.PageInfo;
};
export interface ISessionSessionDelegate<C> {
    onAdyen(ctx: C, ev: AdyenAdyen.Session): void;
}
export declare function routeSessionSessionDelegate<C>(ctx: C, val: Session, delegate: ISessionSessionDelegate<C>): void;
export declare class PaymentService {
    static CreatePayment(req: CreatePaymentRequest, initReq?: fm.InitReq): Promise<Payment>;
    static StartSession(req: StartSessionRequest, initReq?: fm.InitReq): Promise<Session>;
    static GetPayment(req: GetPaymentRequest, initReq?: fm.InitReq): Promise<Payment>;
    static RefundPayment(req: RefundPaymentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListSuccessfulPayments(req: ListSuccessfulPaymentsRequest, initReq?: fm.InitReq): Promise<ListSuccessfulPaymentsResponse>;
    static ListPayments(req: ListPaymentsRequest, initReq?: fm.InitReq): Promise<ListPaymentsResponse>;
}
export {};
//# sourceMappingURL=payment.pb.d.ts.map