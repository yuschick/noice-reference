import * as fm from "../fetch.pb";
export declare enum EmailTemplate {
    EMAIL_TEMPLATE_UNSPECIFIED = "EMAIL_TEMPLATE_UNSPECIFIED",
    EMAIL_TEMPLATE_WELCOME_EMAIL = "EMAIL_TEMPLATE_WELCOME_EMAIL",
    EMAIL_TEMPLATE_EMAIL_VERIFICATION = "EMAIL_TEMPLATE_EMAIL_VERIFICATION",
    EMAIL_TEMPLATE_PASSWORD_RESET = "EMAIL_TEMPLATE_PASSWORD_RESET",
    EMAIL_TEMPLATE_EMAIL_CHANGE = "EMAIL_TEMPLATE_EMAIL_CHANGE",
    EMAIL_TEMPLATE_ACCOUNT_DELETED = "EMAIL_TEMPLATE_ACCOUNT_DELETED",
    EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_ACCEPTED = "EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_ACCEPTED",
    EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_DECLINED = "EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_DECLINED",
    EMAIL_TEMPLATE_PLATFORM_USER_BANNED = "EMAIL_TEMPLATE_PLATFORM_USER_BANNED",
    EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_ACCEPTED = "EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_ACCEPTED",
    EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_DECLINED = "EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_DECLINED",
    EMAIL_TEMPLATE_PLATFORM_USER_UNBANNED = "EMAIL_TEMPLATE_PLATFORM_USER_UNBANNED",
    EMAIL_TEMPLATE_PURCHASE_RECEIPT = "EMAIL_TEMPLATE_PURCHASE_RECEIPT",
    EMAIL_TEMPLATE_USER_RELEASED_FROM_WAITLIST = "EMAIL_TEMPLATE_USER_RELEASED_FROM_WAITLIST",
    EMAIL_TEMPLATE_ACCOUNT_DELETION_SCHEDULED = "EMAIL_TEMPLATE_ACCOUNT_DELETION_SCHEDULED",
    EMAIL_TEMPLATE_CHANNEL_LIVE = "EMAIL_TEMPLATE_CHANNEL_LIVE",
    EMAIL_TEMPLATE_PURCHASE_REFUND = "EMAIL_TEMPLATE_PURCHASE_REFUND"
}
export type Contact = {
    name?: string;
    email?: string;
};
export type SendEmailRequest = {
    sender?: Contact;
    recipients?: Contact[];
    subject?: string;
    textBody?: string;
    htmlBody?: string;
    unsubscribeLink?: string;
    categories?: string[];
};
export type SendTemplateEmailRequest = {
    sender?: Contact;
    recipients?: Contact[];
    template?: EmailTemplate;
    parameters?: {
        [key: string]: string;
    };
    locale?: string;
    unsubscribeLink?: string;
};
export type SendEmailResponse = {};
export type EmailQueueItem = {
    sender?: Contact;
    recipients?: Contact[];
    subject?: string;
    textBody?: string;
    htmlBody?: string;
    headers?: {
        [key: string]: string;
    };
    categories?: string[];
};
export declare class EmailService {
    static SendEmail(req: SendEmailRequest, initReq?: fm.InitReq): Promise<SendEmailResponse>;
    static SendTemplateEmail(req: SendTemplateEmailRequest, initReq?: fm.InitReq): Promise<SendEmailResponse>;
}
//# sourceMappingURL=email.pb.d.ts.map