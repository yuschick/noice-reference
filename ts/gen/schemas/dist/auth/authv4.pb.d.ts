import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as ProfileProfile from "../profile/profile.pb";
import * as AuthAuth from "./auth.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum EmailVerificationMode {
    EMAIL_VERIFICATION_MODE_UNSPECIFIED = "EMAIL_VERIFICATION_MODE_UNSPECIFIED",
    EMAIL_VERIFICATION_MODE_SIGNIN = "EMAIL_VERIFICATION_MODE_SIGNIN",
    EMAIL_VERIFICATION_MODE_SIGNUP = "EMAIL_VERIFICATION_MODE_SIGNUP"
}
export declare enum EmailStatus {
    EMAIL_STATUS_UNSPECIFIED = "EMAIL_STATUS_UNSPECIFIED",
    EMAIL_STATUS_ACCEPTED = "EMAIL_STATUS_ACCEPTED",
    EMAIL_STATUS_REJECTED = "EMAIL_STATUS_REJECTED"
}
export declare enum ErrorDetailsCause {
    CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
    CAUSE_WRONG_VERIFICATION_MODE = "CAUSE_WRONG_VERIFICATION_MODE",
    CAUSE_USER_ALREADY_EXISTS = "CAUSE_USER_ALREADY_EXISTS",
    CAUSE_USER_NOT_FOUND = "CAUSE_USER_NOT_FOUND",
    CAUSE_INVALID_TOKEN = "CAUSE_INVALID_TOKEN",
    CAUSE_CAPTCHA = "CAUSE_CAPTCHA",
    CAUSE_CHANNEL_OFFLINE = "CAUSE_CHANNEL_OFFLINE",
    CAUSE_WAITLIST = "CAUSE_WAITLIST",
    CAUSE_OAUTH2_CONSENT = "CAUSE_OAUTH2_CONSENT"
}
export type ErrorDetails = {
    cause?: ErrorDetailsCause;
};
export type VerifyEmailRequest = {
    email?: string;
    mode?: EmailVerificationMode;
    captchaToken?: string;
};
export type VerifyEmailResponse = {
    token?: string;
    exists?: boolean;
};
export type AuthMethodEmail = {
    email?: string;
    token?: string;
    code?: string;
};
export type ExchangeExtAuthCodeRequest = {
    provider?: AuthAuth.IdentityProvider;
    authorizationCode?: string;
    redirectUri?: string;
};
export type ExchangeExtAuthCodeResponse = {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
};
type BaseSignInRequest = {
    sessionTokenMode?: AuthAuth.SessionTokenMode;
};
export type SignInRequest = BaseSignInRequest & OneOf<{
    email: AuthMethodEmail;
    discordToken: string;
    appleIdToken: string;
}>;
export type SignInResponse = {
    auth?: AuthAuth.Auth;
    account?: AuthAuth.Account;
};
export type PasswordSignInRequest = {
    username?: string;
    password?: string;
};
export type PasswordSignInResponse = {
    auth?: AuthAuth.Auth;
};
export type SignUpRequest = {
    displayName?: string;
    username?: string;
    birthday?: AuthAuth.Date;
    email?: string;
    acceptedTerms?: AuthAuth.TermsVersion[];
    discordToken?: string;
    emailVerificationToken?: string;
    emailVerificationCode?: string;
    sessionTokenMode?: AuthAuth.SessionTokenMode;
    origin?: string;
    marketingConsent?: AuthAuth.ConsentStatus;
    appleIdToken?: string;
    isMobile?: boolean;
};
export type VerifySignupRequest = {
    displayName?: string;
    username?: string;
    captchaToken?: string;
    appleIdToken?: string;
    email?: string;
};
export type CompleteTemporaryAccountRequest = {
    username?: string;
    birthday?: AuthAuth.Date;
    email?: string;
    acceptedTerms?: AuthAuth.TermsVersion[];
    discordToken?: string;
    emailVerificationToken?: string;
    emailVerificationCode?: string;
    sessionTokenMode?: AuthAuth.SessionTokenMode;
    marketingConsent?: AuthAuth.ConsentStatus;
    appleIdToken?: string;
};
export type VerifySignupResponse = {
    displayNameStatus?: ProfileProfile.UsernameStatus;
    usernameStatus?: ProfileProfile.UsernameStatus;
    emailStatus?: EmailStatus;
};
export type SignUpResponse = {
    auth?: AuthAuth.Auth;
    account?: AuthAuth.Account;
};
export type SignAgreementsRequest = {
    agreements?: AuthAuth.TermsVersion[];
};
export type UpdateMarketingConsentRequest = {
    marketingConsent?: AuthAuth.ConsentStatus;
};
export type SetBirthdayRequest = {
    birthday?: AuthAuth.Date;
};
export type GetAccountRequest = {
    userId?: string;
};
export type AccessChannelRequest = {
    channelName?: string;
};
export type VerifyCaptchaRequest = {
    recaptchaToken?: string;
    hcaptchaToken?: string;
};
export type VerifyCaptchaResponse = {
    token?: string;
};
type BaseAddExternalAccountRequest = {};
export type AddExternalAccountRequest = BaseAddExternalAccountRequest & OneOf<{
    discordToken: string;
    appleIdToken: string;
}>;
export type DeleteExternalAccountRequest = {
    userId?: string;
    idType?: AuthAuth.IdentityType;
};
export type GetOAuth2ConsentRequest = {
    userId?: string;
    clientId?: string;
    scopes?: string[];
};
export type GetOAuth2ConsentResponse = {
    clientId?: string;
    clientName?: string;
    scopes?: string[];
};
export type AddOAuth2ConsentRequest = {
    userId?: string;
    clientId?: string;
    scopes?: string[];
};
export type DeleteOAuth2ConsentRequest = {
    userId?: string;
    clientId?: string;
};
export type CreateTemporaryAccountRequest = {
    captchaToken?: string;
    origin?: string;
    sessionTokenMode?: AuthAuth.SessionTokenMode;
};
export type CreateTemporaryAccountResponse = {
    auth?: AuthAuth.Auth;
    account?: AuthAuth.Account;
};
export type CreateOAuthCodeRequest = {
    clientId?: string;
    redirectUri?: string;
    refreshToken?: string;
    scopes?: string[];
};
export type CreateOAuthCodeResponse = {
    authorizationCode?: string;
};
export type VerifyOAuthClientRequest = {
    clientId?: string;
    redirectUri?: string;
    refreshToken?: string;
    scopes?: string[];
};
export type VerifyOAuthClientResponse = {};
export type ExchangeOAuthCodeRequest = {
    clientId?: string;
    redirectUri?: string;
    authorizationCode?: string;
    clientSecret?: string;
};
export type ExchangeOAuthCodeResponse = {
    auth?: AuthAuth.Auth;
};
export interface ISignInRequestMethodDelegate<C> {
    onEmail(ctx: C, ev: AuthMethodEmail): void;
    onDiscordToken(ctx: C, ev: string): void;
    onAppleIdToken(ctx: C, ev: string): void;
}
export declare function routeSignInRequestMethodDelegate<C>(ctx: C, val: SignInRequest, delegate: ISignInRequestMethodDelegate<C>): void;
export interface IAddExternalAccountRequestMethodDelegate<C> {
    onDiscordToken(ctx: C, ev: string): void;
    onAppleIdToken(ctx: C, ev: string): void;
}
export declare function routeAddExternalAccountRequestMethodDelegate<C>(ctx: C, val: AddExternalAccountRequest, delegate: IAddExternalAccountRequestMethodDelegate<C>): void;
export declare class AuthServiceV4 {
    static VerifyEmail(req: VerifyEmailRequest, initReq?: fm.InitReq): Promise<VerifyEmailResponse>;
    static ExchangeExtAuthCode(req: ExchangeExtAuthCodeRequest, initReq?: fm.InitReq): Promise<ExchangeExtAuthCodeResponse>;
    static SignIn(req: SignInRequest, initReq?: fm.InitReq): Promise<SignInResponse>;
    static SignOut(req: AuthAuth.SignOutRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static RefreshToken(req: AuthAuth.RefreshTokenRequest, initReq?: fm.InitReq): Promise<AuthAuth.RefreshTokenResponse>;
    static GetAccount(req: GetAccountRequest, initReq?: fm.InitReq): Promise<AuthAuth.Account>;
    static AccessChannel(req: AccessChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static AddExternalAccount(req: AddExternalAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteExternalAccount(req: DeleteExternalAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static SignUp(req: SignUpRequest, initReq?: fm.InitReq): Promise<SignUpResponse>;
    static CreateTemporaryAccount(req: CreateTemporaryAccountRequest, initReq?: fm.InitReq): Promise<CreateTemporaryAccountResponse>;
    static CompleteTemporaryAccount(req: CompleteTemporaryAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static VerifySignup(req: VerifySignupRequest, initReq?: fm.InitReq): Promise<VerifySignupResponse>;
    static VerifyCaptcha(req: VerifyCaptchaRequest, initReq?: fm.InitReq): Promise<VerifyCaptchaResponse>;
    static SignAgreements(req: SignAgreementsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static SetBirthday(req: SetBirthdayRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static UpdateMarketingConsent(req: UpdateMarketingConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static GetOAuth2Consent(req: GetOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GetOAuth2ConsentResponse>;
    static AddOAuth2Consent(req: AddOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteOAuth2Consent(req: DeleteOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
export declare class AuthInternalService {
    static PasswordSignIn(req: PasswordSignInRequest, initReq?: fm.InitReq): Promise<PasswordSignInResponse>;
}
export declare class OAuthService {
    static CreateOAuthCode(req: CreateOAuthCodeRequest, initReq?: fm.InitReq): Promise<CreateOAuthCodeResponse>;
    static VerifyOAuthClient(req: VerifyOAuthClientRequest, initReq?: fm.InitReq): Promise<VerifyOAuthClientResponse>;
    static ExchangeOAuthCode(req: ExchangeOAuthCodeRequest, initReq?: fm.InitReq): Promise<ExchangeOAuthCodeResponse>;
}
export {};
//# sourceMappingURL=authv4.pb.d.ts.map