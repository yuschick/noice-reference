import * as fm from "../fetch.pb";
import * as GoogleApiHttpbody from "../google/api/httpbody.pb";
import * as GoogleProtobufStruct from "../google/protobuf/struct.pb";
export declare enum EventCode {
    EVENT_CODE_UNSPECIFIED = "EVENT_CODE_UNSPECIFIED",
    EVENT_CODE_AUTHORISATION = "EVENT_CODE_AUTHORISATION",
    EVENT_CODE_AUTHORISATION_ADJUSTMENT = "EVENT_CODE_AUTHORISATION_ADJUSTMENT",
    EVENT_CODE_CANCELLATION = "EVENT_CODE_CANCELLATION",
    EVENT_CODE_CANCEL_OR_REFUND = "EVENT_CODE_CANCEL_OR_REFUND",
    EVENT_CODE_CAPTURE = "EVENT_CODE_CAPTURE",
    EVENT_CODE_CAPTURE_FAILED = "EVENT_CODE_CAPTURE_FAILED",
    EVENT_CODE_HANDLED_EXTERNALLY = "EVENT_CODE_HANDLED_EXTERNALLY",
    EVENT_CODE_ORDER_OPENED = "EVENT_CODE_ORDER_OPENED",
    EVENT_CODE_ORDER_CLOSED = "EVENT_CODE_ORDER_CLOSED",
    EVENT_CODE_REFUND = "EVENT_CODE_REFUND",
    EVENT_CODE_REFUND_FAILED = "EVENT_CODE_REFUND_FAILED",
    EVENT_CODE_REFUNDED_REVERSED = "EVENT_CODE_REFUNDED_REVERSED",
    EVENT_CODE_REFUND_WITH_DATA = "EVENT_CODE_REFUND_WITH_DATA",
    EVENT_CODE_REPORT_AVAILABLE = "EVENT_CODE_REPORT_AVAILABLE",
    EVENT_CODE_VOID_PENDING_REFUND = "EVENT_CODE_VOID_PENDING_REFUND",
    EVENT_CODE_CHARGEBACK = "EVENT_CODE_CHARGEBACK",
    EVENT_CODE_CHARGEBACK_REVERSED = "EVENT_CODE_CHARGEBACK_REVERSED",
    EVENT_CODE_NOTIFICATION_OF_CHARGEBACK = "EVENT_CODE_NOTIFICATION_OF_CHARGEBACK",
    EVENT_CODE_NOTIFICATION_OF_FRAUD = "EVENT_CODE_NOTIFICATION_OF_FRAUD",
    EVENT_CODE_PREARBITRATION_LOST = "EVENT_CODE_PREARBITRATION_LOST",
    EVENT_CODE_PREARBITRATION_WON = "EVENT_CODE_PREARBITRATION_WON",
    EVENT_CODE_REQUEST_FOR_INFORMATION = "EVENT_CODE_REQUEST_FOR_INFORMATION",
    EVENT_CODE_SECOND_CHARGEBACK = "EVENT_CODE_SECOND_CHARGEBACK",
    EVENT_CODE_PAYOUT_EXPIRE = "EVENT_CODE_PAYOUT_EXPIRE",
    EVENT_CODE_PAYOUT_DECLINE = "EVENT_CODE_PAYOUT_DECLINE",
    EVENT_CODE_PAYOUT_THIRDPARTY = "EVENT_CODE_PAYOUT_THIRDPARTY",
    EVENT_CODE_PAIDOUT_REVERSED = "EVENT_CODE_PAIDOUT_REVERSED"
}
export type Amount = {
    value?: number;
    currency?: string;
};
export type Session = {
    id?: string;
    reference?: string;
    returnUrl?: string;
    sessionData?: string;
    amount?: Amount;
};
export type NotificationItem = {
    eventCode?: string;
    success?: string;
    eventDate?: string;
    merchantAccountCode?: string;
    pspReference?: string;
    merchantReference?: string;
    amount?: Amount;
    additionalData?: {
        [key: string]: GoogleProtobufStruct.Value;
    };
    reason?: string;
    originalReference?: string;
};
export type CreateNotificationRequest = {
    live?: string;
    notificationItems?: NotificationItemWrapper[];
};
export type NotificationItemWrapper = {
    value?: NotificationItem;
};
export declare class AdyenProxyService {
    static CreateNotification(req: CreateNotificationRequest, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody>;
}
//# sourceMappingURL=adyen.pb.d.ts.map