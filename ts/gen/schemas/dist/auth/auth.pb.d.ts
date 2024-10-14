import * as AgreementAgreement from "../agreement/agreement.pb";
import * as ApiEntity from "../api/entity.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum PlatformRole {
    PLATFORM_ROLE_UNSPECIFIED = "PLATFORM_ROLE_UNSPECIFIED",
    PLATFORM_ROLE_GUEST = "PLATFORM_ROLE_GUEST",
    PLATFORM_ROLE_USER = "PLATFORM_ROLE_USER",
    PLATFORM_ROLE_BOT = "PLATFORM_ROLE_BOT",
    PLATFORM_ROLE_ADMIN = "PLATFORM_ROLE_ADMIN",
    PLATFORM_ROLE_MODERATOR = "PLATFORM_ROLE_MODERATOR",
    PLATFORM_ROLE_PX_AGENT = "PLATFORM_ROLE_PX_AGENT",
    PLATFORM_ROLE_ROOT = "PLATFORM_ROLE_ROOT",
    PLATFORM_ROLE_FULL_USER = "PLATFORM_ROLE_FULL_USER"
}
export declare enum ConsentStatus {
    CONSENT_STATUS_UNSPECIFIED = "CONSENT_STATUS_UNSPECIFIED",
    CONSENT_STATUS_ACCEPTED = "CONSENT_STATUS_ACCEPTED",
    CONSENT_STATUS_DECLINED = "CONSENT_STATUS_DECLINED"
}
export declare enum IdentityType {
    IDENTITY_TYPE_UNSPECIFIED = "IDENTITY_TYPE_UNSPECIFIED",
    IDENTITY_TYPE_EMAIL = "IDENTITY_TYPE_EMAIL",
    IDENTITY_TYPE_DISCORD = "IDENTITY_TYPE_DISCORD",
    IDENTITY_TYPE_APPLE = "IDENTITY_TYPE_APPLE"
}
export declare enum IdentityProvider {
    IDENTITY_PROVIDER_UNSPECIFIED = "IDENTITY_PROVIDER_UNSPECIFIED",
    IDENTITY_PROVIDER_APPLE = "IDENTITY_PROVIDER_APPLE"
}
export declare enum SessionTokenMode {
    SESSION_TOKEN_MODE_UNSPECIFIED = "SESSION_TOKEN_MODE_UNSPECIFIED",
    SESSION_TOKEN_MODE_SESSION_COOKIE = "SESSION_TOKEN_MODE_SESSION_COOKIE",
    SESSION_TOKEN_MODE_PERSISTENT_COOKIE = "SESSION_TOKEN_MODE_PERSISTENT_COOKIE",
    SESSION_TOKEN_MODE_RESPONSE = "SESSION_TOKEN_MODE_RESPONSE"
}
export declare enum AccountStatusFlag {
    STATUS_FLAG_UNSPECIFIED = "STATUS_FLAG_UNSPECIFIED",
    STATUS_FLAG_WAITLIST = "STATUS_FLAG_WAITLIST",
    STATUS_FLAG_BANNED = "STATUS_FLAG_BANNED",
    STATUS_FLAG_DELETION_SCHEDULED = "STATUS_FLAG_DELETION_SCHEDULED"
}
export declare enum AccountUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_UPDATED = "UPDATE_TYPE_UPDATED",
    UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED",
    UPDATE_TYPE_COMPLETED = "UPDATE_TYPE_COMPLETED"
}
export declare enum AppConsentUpdateEventUpdateType {
    UPDATE_TYPE_UNSPECIFIED = "UPDATE_TYPE_UNSPECIFIED",
    UPDATE_TYPE_CREATED = "UPDATE_TYPE_CREATED",
    UPDATE_TYPE_DELETED = "UPDATE_TYPE_DELETED"
}
export type SignupOriginPage = {
    url?: string;
};
export type SignupOriginCampaign = {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    creator?: string;
    format?: string;
    term?: string;
};
export type SignupOriginChannel = {
    channelId?: string;
};
type BaseSignupOrigin = {};
export type SignupOrigin = BaseSignupOrigin & OneOf<{
    page: SignupOriginPage;
    channel: SignupOriginChannel;
    campaign: SignupOriginCampaign;
}>;
export type Account = {
    uid?: string;
    email?: string;
    emailVerifiedAt?: string;
    acceptedTerms?: TermsVersion[];
    birthday?: Date;
    externalIds?: Identity[];
    state?: ApiEntity.EntityState;
    flags?: AccountStatusFlag[];
    pendingAgreements?: AgreementAgreement.AgreementRevision[];
    isBot?: boolean;
    roles?: PlatformRole[];
    createdAt?: string;
    signupOrigin?: SignupOrigin;
    marketingConsent?: ConsentStatus;
    matureRatedContentAllowed?: boolean;
    temporary?: boolean;
};
export type AccountUpdateEvent = {
    account?: Account;
    type?: AccountUpdateEventUpdateType;
    updatedAt?: string;
};
export type ExternalIdUpdateEvent = {
    userId?: string;
    identity?: Identity;
    updatedAt?: string;
};
export type AppConsentUpdateEvent = {
    userId?: string;
    application?: string;
    type?: AppConsentUpdateEventUpdateType;
    updatedAt?: string;
};
export type Identity = {
    type?: IdentityType;
    id?: string;
};
export type AuthEvent = {
    uid?: string;
    issuedAt?: string;
    expiresAt?: string;
    notBefore?: string;
    roles?: string[];
    email?: string;
    currentGeolocation?: string;
    prevUid?: string;
};
export type SignUpEvent = {
    uid?: string;
    email?: string;
    issuedAt?: string;
    expiresAt?: string;
    notBefore?: string;
    roles?: string[];
    currentGeolocation?: string;
};
export type EmailChangeRequestEvent = {
    userId?: string;
    email?: string;
};
export type Auth = {
    token?: string;
    refreshToken?: string;
    uid?: string;
    issuedAt?: string;
    expiresAt?: string;
    notBefore?: string;
    created?: boolean;
    roles?: string[];
};
export type Date = {
    day?: number;
    month?: number;
    year?: number;
};
export type RefreshTokenRequest = {
    refreshToken?: string;
    app?: string;
    gatewayMetadata?: {
        [key: string]: string;
    };
};
export type RefreshTokenResponse = {
    auth?: Auth;
};
export type SignOutRequest = {
    refreshToken?: string;
};
export type TermsVersion = {
    name?: string;
    revision?: string;
    signature?: string;
};
export type ResolveEmailsRequest = {
    emails?: string[];
};
export type GetAccountByEmailRequest = {
    email?: string;
};
export type ResolveEmailsResponse = {
    userIds?: {
        [key: string]: string;
    };
};
export type CreateInvitationRequest = {
    identities?: Identity[];
};
export type CreateInvitationResponse = {
    uid?: string;
};
export type BatchGetAccountsRequest = {
    userIds?: string[];
};
export type BatchGetAccountsResponse = {
    accounts?: Account[];
};
export type BatchGetInvitationsRequest = {
    userIds?: string[];
};
export type Invitation = {
    userId?: string;
    identities?: Identity[];
};
export type BatchGetInvitationsResponse = {
    invitations?: Invitation[];
};
export type ListAccountsRequest = {
    waitlist?: boolean;
};
export type ListAccountsResponse = {
    accounts?: Account[];
};
export type AccountUpdate = {
    userId?: string;
    roles?: PlatformRole[];
};
export type UpdateAccountRequest = {
    body?: AccountUpdate;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type CreateAccountRequest = {
    displayName?: string;
    username?: string;
    email?: string;
    isBot?: boolean;
};
type BaseGenerateAccessTokenRequest = {};
export type GenerateAccessTokenRequest = BaseGenerateAccessTokenRequest & OneOf<{
    userId: string;
    email: string;
}>;
export type GenerateAccessTokenResponse = {
    auth?: Auth;
};
export interface ISignupOriginOriginDelegate<C> {
    onPage(ctx: C, ev: SignupOriginPage): void;
    onChannel(ctx: C, ev: SignupOriginChannel): void;
    onCampaign(ctx: C, ev: SignupOriginCampaign): void;
}
export declare function routeSignupOriginOriginDelegate<C>(ctx: C, val: SignupOrigin, delegate: ISignupOriginOriginDelegate<C>): void;
export interface IGenerateAccessTokenRequestIdentifierDelegate<C> {
    onUserId(ctx: C, ev: string): void;
    onEmail(ctx: C, ev: string): void;
}
export declare function routeGenerateAccessTokenRequestIdentifierDelegate<C>(ctx: C, val: GenerateAccessTokenRequest, delegate: IGenerateAccessTokenRequestIdentifierDelegate<C>): void;
export declare class AuthAdminService {
    static ResolveEmails(req: ResolveEmailsRequest, initReq?: fm.InitReq): Promise<ResolveEmailsResponse>;
    static CreateInvitation(req: CreateInvitationRequest, initReq?: fm.InitReq): Promise<CreateInvitationResponse>;
    static BatchGetAccounts(req: BatchGetAccountsRequest, initReq?: fm.InitReq): Promise<BatchGetAccountsResponse>;
    static GetAccountByEmail(req: GetAccountByEmailRequest, initReq?: fm.InitReq): Promise<Account>;
    static BatchGetInvitations(req: BatchGetInvitationsRequest, initReq?: fm.InitReq): Promise<BatchGetInvitationsResponse>;
    static ListAccounts(req: ListAccountsRequest, initReq?: fm.InitReq): Promise<ListAccountsResponse>;
    static UpdateAccount(req: UpdateAccountRequest, initReq?: fm.InitReq): Promise<Account>;
    static CreateAccount(req: CreateAccountRequest, initReq?: fm.InitReq): Promise<Account>;
    static GenerateAccessToken(req: GenerateAccessTokenRequest, initReq?: fm.InitReq): Promise<GenerateAccessTokenResponse>;
}
export {};
//# sourceMappingURL=auth.pb.d.ts.map