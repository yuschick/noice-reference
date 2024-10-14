/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AgreementAgreement from "../agreement/agreement.pb"
import * as fm from "../fetch.pb"
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb"
import * as ProfileProfile from "../profile/profile.pb"
import * as AuthAuth from "./auth.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum EmailVerificationMode {
  EMAIL_VERIFICATION_MODE_UNSPECIFIED = "EMAIL_VERIFICATION_MODE_UNSPECIFIED",
  EMAIL_VERIFICATION_MODE_SIGNIN = "EMAIL_VERIFICATION_MODE_SIGNIN",
  EMAIL_VERIFICATION_MODE_SIGNUP = "EMAIL_VERIFICATION_MODE_SIGNUP",
}

export enum EmailStatus {
  EMAIL_STATUS_UNSPECIFIED = "EMAIL_STATUS_UNSPECIFIED",
  EMAIL_STATUS_ACCEPTED = "EMAIL_STATUS_ACCEPTED",
  EMAIL_STATUS_REJECTED = "EMAIL_STATUS_REJECTED",
}

export enum ErrorDetailsCause {
  CAUSE_UNSPECIFIED = "CAUSE_UNSPECIFIED",
  CAUSE_WRONG_VERIFICATION_MODE = "CAUSE_WRONG_VERIFICATION_MODE",
  CAUSE_USER_ALREADY_EXISTS = "CAUSE_USER_ALREADY_EXISTS",
  CAUSE_USER_NOT_FOUND = "CAUSE_USER_NOT_FOUND",
  CAUSE_INVALID_TOKEN = "CAUSE_INVALID_TOKEN",
  CAUSE_CAPTCHA = "CAUSE_CAPTCHA",
  CAUSE_CHANNEL_OFFLINE = "CAUSE_CHANNEL_OFFLINE",
  CAUSE_WAITLIST = "CAUSE_WAITLIST",
  CAUSE_OAUTH2_CONSENT = "CAUSE_OAUTH2_CONSENT",
  CAUSE_TEMPORARY_THROTTLED = "CAUSE_TEMPORARY_THROTTLED",
  CAUSE_INVALID_EMAIL = "CAUSE_INVALID_EMAIL",
}

export type ErrorDetails = {
  cause?: ErrorDetailsCause
}

export type VerifyEmailRequest = {
  email?: string
  mode?: EmailVerificationMode
  captchaToken?: string
}

export type VerifyEmailResponse = {
  token?: string
  exists?: boolean
}

export type AuthMethodEmail = {
  email?: string
  token?: string
  code?: string
}

export type ExchangeExtAuthCodeRequest = {
  provider?: AuthAuth.IdentityProvider
  authorizationCode?: string
  redirectUri?: string
}

export type ExchangeExtAuthCodeResponse = {
  accessToken?: string
  idToken?: string
  refreshToken?: string
}


type BaseSignInRequest = {
  sessionTokenMode?: AuthAuth.SessionTokenMode
}

export type SignInRequest = BaseSignInRequest
  & OneOf<{ email: AuthMethodEmail; discordToken: string; appleIdToken: string; streamKey: string }>

export type SignInResponse = {
  auth?: AuthAuth.Auth
  account?: AuthAuth.Account
}

export type PasswordSignInRequest = {
  username?: string
  password?: string
}

export type PasswordSignInResponse = {
  auth?: AuthAuth.Auth
}

export type SignUpRequest = {
  displayName?: string
  username?: string
  birthday?: AuthAuth.Date
  email?: string
  acceptedTerms?: AuthAuth.TermsVersion[]
  discordToken?: string
  emailVerificationToken?: string
  emailVerificationCode?: string
  sessionTokenMode?: AuthAuth.SessionTokenMode
  origin?: string
  marketingConsent?: AuthAuth.ConsentStatus
  appleIdToken?: string
  isMobile?: boolean
}

export type VerifySignupRequest = {
  displayName?: string
  username?: string
  captchaToken?: string
  appleIdToken?: string
  email?: string
}

export type CompleteTemporaryAccountRequest = {
  username?: string
  birthday?: AuthAuth.Date
  email?: string
  acceptedTerms?: AuthAuth.TermsVersion[]
  discordToken?: string
  emailVerificationToken?: string
  emailVerificationCode?: string
  sessionTokenMode?: AuthAuth.SessionTokenMode
  marketingConsent?: AuthAuth.ConsentStatus
  appleIdToken?: string
}

export type VerifySignupResponse = {
  displayNameStatus?: ProfileProfile.UsernameStatus
  usernameStatus?: ProfileProfile.UsernameStatus
  emailStatus?: EmailStatus
}

export type SignUpResponse = {
  auth?: AuthAuth.Auth
  account?: AuthAuth.Account
}

export type SignAgreementsRequest = {
  agreements?: AuthAuth.TermsVersion[]
}

export type UpdateMarketingConsentRequest = {
  marketingConsent?: AuthAuth.ConsentStatus
}

export type SetBirthdayRequest = {
  birthday?: AuthAuth.Date
}

export type GetAccountRequest = {
  userId?: string
}

export type AccessChannelRequest = {
  channelName?: string
}

export type VerifyCaptchaRequest = {
  recaptchaToken?: string
  hcaptchaToken?: string
}

export type VerifyCaptchaResponse = {
  token?: string
}


type BaseAddExternalAccountRequest = {
}

export type AddExternalAccountRequest = BaseAddExternalAccountRequest
  & OneOf<{ discordToken: string; appleIdToken: string }>

export type DeleteExternalAccountRequest = {
  userId?: string
  idType?: AuthAuth.IdentityType
}

export type GetOAuth2ConsentRequest = {
  userId?: string
  clientId?: string
  scopes?: string[]
}

export type GetOAuth2ConsentResponse = {
  clientId?: string
  clientName?: string
  scopes?: string[]
}

export type AddOAuth2ConsentRequest = {
  userId?: string
  clientId?: string
  scopes?: string[]
}

export type DeleteOAuth2ConsentRequest = {
  userId?: string
  clientId?: string
}

export type CreateTemporaryAccountRequest = {
  captchaToken?: string
  origin?: string
  sessionTokenMode?: AuthAuth.SessionTokenMode
}

export type CreateTemporaryAccountResponse = {
  auth?: AuthAuth.Auth
  account?: AuthAuth.Account
}

export type GetExternalAccountsRequest = {
  userId?: string
}

export type GetExternalAccountsResponse = {
  externalAccounts?: AuthAuth.Identity[]
}

export type GetAcceptedTermsRequest = {
  userId?: string
}

export type GetAcceptedTermsResponse = {
  acceptedTerms?: AuthAuth.TermsVersion[]
}

export type GetPendingAgreementsRequest = {
  userId?: string
}

export type GetPendingAgreementsResponse = {
  pendingAgreements?: AgreementAgreement.AgreementRevision[]
}

export type GetFingerprintChannelStatusRequest = {
  fingerprint?: string
  channelId?: string
}

export type GetFingerprintChannelStatusResponse = {
  blocked?: boolean
}

export type GetRandomAccountsRequest = {
  count?: number
  excludeIds?: string[]
}

export type GetRandomAccountsResponse = {
  accounts?: AuthAuth.Account[]
}

export type CreateOAuthCodeRequest = {
  clientId?: string
  redirectUri?: string
  refreshToken?: string
  scopes?: string[]
}

export type CreateOAuthCodeResponse = {
  authorizationCode?: string
}

export type VerifyOAuthClientRequest = {
  clientId?: string
  redirectUri?: string
  refreshToken?: string
  scopes?: string[]
}

export type VerifyOAuthClientResponse = {
}

export type ExchangeOAuthCodeRequest = {
  clientId?: string
  redirectUri?: string
  authorizationCode?: string
  clientSecret?: string
}

export type ExchangeOAuthCodeResponse = {
  auth?: AuthAuth.Auth
}




export interface ISignInRequestMethodDelegate<C> {
  onEmail(ctx: C, ev: AuthMethodEmail): void
  onDiscordToken(ctx: C, ev: string): void
  onAppleIdToken(ctx: C, ev: string): void
  onStreamKey(ctx: C, ev: string): void
}

export function routeSignInRequestMethodDelegate<C>(ctx: C, val: SignInRequest, delegate: ISignInRequestMethodDelegate<C>) {
  val?.email && delegate.onEmail(ctx, val.email)
  val?.discordToken && delegate.onDiscordToken(ctx, val.discordToken)
  val?.appleIdToken && delegate.onAppleIdToken(ctx, val.appleIdToken)
  val?.streamKey && delegate.onStreamKey(ctx, val.streamKey)
}




export interface IAddExternalAccountRequestMethodDelegate<C> {
  onDiscordToken(ctx: C, ev: string): void
  onAppleIdToken(ctx: C, ev: string): void
}

export function routeAddExternalAccountRequestMethodDelegate<C>(ctx: C, val: AddExternalAccountRequest, delegate: IAddExternalAccountRequestMethodDelegate<C>) {
  val?.discordToken && delegate.onDiscordToken(ctx, val.discordToken)
  val?.appleIdToken && delegate.onAppleIdToken(ctx, val.appleIdToken)
}

export class AuthServiceV4 {
  static VerifyEmail(req: VerifyEmailRequest, initReq?: fm.InitReq): Promise<VerifyEmailResponse> {
    return fm.fetchReq<VerifyEmailRequest, VerifyEmailResponse>(`/v4/auth:verify_email`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ExchangeExtAuthCode(req: ExchangeExtAuthCodeRequest, initReq?: fm.InitReq): Promise<ExchangeExtAuthCodeResponse> {
    return fm.fetchReq<ExchangeExtAuthCodeRequest, ExchangeExtAuthCodeResponse>(`/v4/auth:exchangeExtAuthCode`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SignIn(req: SignInRequest, initReq?: fm.InitReq): Promise<SignInResponse> {
    return fm.fetchReq<SignInRequest, SignInResponse>(`/v4/auth:signin`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SignOut(req: AuthAuth.SignOutRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AuthAuth.SignOutRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/session/session:signout`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static RefreshToken(req: AuthAuth.RefreshTokenRequest, initReq?: fm.InitReq): Promise<AuthAuth.RefreshTokenResponse> {
    return fm.fetchReq<AuthAuth.RefreshTokenRequest, AuthAuth.RefreshTokenResponse>(`/v4/auth/session/session:refresh`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetAccount(req: GetAccountRequest, initReq?: fm.InitReq): Promise<AuthAuth.Account> {
    return fm.fetchReq<GetAccountRequest, AuthAuth.Account>(`/v4/auth/accounts/${req["userId"]}?${fm.renderURLSearchParams(req, ["userId"])}`, {...initReq, method: "GET"})
  }
  static AccessChannel(req: AccessChannelRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AccessChannelRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/account:access_channel`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static AddExternalAccount(req: AddExternalAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AddExternalAccountRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/account:add_external_account`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteExternalAccount(req: DeleteExternalAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteExternalAccountRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/account:delete_external_account`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SignUp(req: SignUpRequest, initReq?: fm.InitReq): Promise<SignUpResponse> {
    return fm.fetchReq<SignUpRequest, SignUpResponse>(`/v4/auth:signup`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CreateTemporaryAccount(req: CreateTemporaryAccountRequest, initReq?: fm.InitReq): Promise<CreateTemporaryAccountResponse> {
    return fm.fetchReq<CreateTemporaryAccountRequest, CreateTemporaryAccountResponse>(`/v4/auth:signupTemporary`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static CompleteTemporaryAccount(req: CompleteTemporaryAccountRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<CompleteTemporaryAccountRequest, GoogleProtobufEmpty.Empty>(`/v4/auth:completeTemporary`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static VerifySignup(req: VerifySignupRequest, initReq?: fm.InitReq): Promise<VerifySignupResponse> {
    return fm.fetchReq<VerifySignupRequest, VerifySignupResponse>(`/v4/auth:verify_signup`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static VerifyCaptcha(req: VerifyCaptchaRequest, initReq?: fm.InitReq): Promise<VerifyCaptchaResponse> {
    return fm.fetchReq<VerifyCaptchaRequest, VerifyCaptchaResponse>(`/v4/auth:verify_captcha`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SignAgreements(req: SignAgreementsRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SignAgreementsRequest, GoogleProtobufEmpty.Empty>(`/v4/auth:sign_agreements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetBirthday(req: SetBirthdayRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<SetBirthdayRequest, GoogleProtobufEmpty.Empty>(`/v4/auth:set_birthday`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static UpdateMarketingConsent(req: UpdateMarketingConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<UpdateMarketingConsentRequest, GoogleProtobufEmpty.Empty>(`/v4/auth:marketing_consent`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetOAuth2Consent(req: GetOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GetOAuth2ConsentResponse> {
    return fm.fetchReq<GetOAuth2ConsentRequest, GetOAuth2ConsentResponse>(`/v4/auth/accounts/${req["userId"]}/oauth2consent/${req["clientId"]}?${fm.renderURLSearchParams(req, ["userId", "clientId"])}`, {...initReq, method: "GET"})
  }
  static AddOAuth2Consent(req: AddOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<AddOAuth2ConsentRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/accounts/${req["userId"]}/oauth2consent:add`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static DeleteOAuth2Consent(req: DeleteOAuth2ConsentRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty> {
    return fm.fetchReq<DeleteOAuth2ConsentRequest, GoogleProtobufEmpty.Empty>(`/v4/auth/accounts/${req["userId"]}/oauth2consent/${req["clientId"]}`, {...initReq, method: "DELETE"})
  }
}
export class AuthInternalService {
  static PasswordSignIn(req: PasswordSignInRequest, initReq?: fm.InitReq): Promise<PasswordSignInResponse> {
    return fm.fetchReq<PasswordSignInRequest, PasswordSignInResponse>(`/auth.v4.AuthInternalService/PasswordSignIn`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetExternalAccounts(req: GetExternalAccountsRequest, initReq?: fm.InitReq): Promise<GetExternalAccountsResponse> {
    return fm.fetchReq<GetExternalAccountsRequest, GetExternalAccountsResponse>(`/auth.v4.AuthInternalService/GetExternalAccounts`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetAcceptedTerms(req: GetAcceptedTermsRequest, initReq?: fm.InitReq): Promise<GetAcceptedTermsResponse> {
    return fm.fetchReq<GetAcceptedTermsRequest, GetAcceptedTermsResponse>(`/auth.v4.AuthInternalService/GetAcceptedTerms`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetPendingAgreements(req: GetPendingAgreementsRequest, initReq?: fm.InitReq): Promise<GetPendingAgreementsResponse> {
    return fm.fetchReq<GetPendingAgreementsRequest, GetPendingAgreementsResponse>(`/auth.v4.AuthInternalService/GetPendingAgreements`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetFingerprintChannelStatus(req: GetFingerprintChannelStatusRequest, initReq?: fm.InitReq): Promise<GetFingerprintChannelStatusResponse> {
    return fm.fetchReq<GetFingerprintChannelStatusRequest, GetFingerprintChannelStatusResponse>(`/auth.v4.AuthInternalService/GetFingerprintChannelStatus`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static GetRandomAccounts(req: GetRandomAccountsRequest, initReq?: fm.InitReq): Promise<GetRandomAccountsResponse> {
    return fm.fetchReq<GetRandomAccountsRequest, GetRandomAccountsResponse>(`/auth.v4.AuthInternalService/GetRandomAccounts`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}
export class OAuthService {
  static CreateOAuthCode(req: CreateOAuthCodeRequest, initReq?: fm.InitReq): Promise<CreateOAuthCodeResponse> {
    return fm.fetchReq<CreateOAuthCodeRequest, CreateOAuthCodeResponse>(`/auth.v4.OAuthService/CreateOAuthCode`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static VerifyOAuthClient(req: VerifyOAuthClientRequest, initReq?: fm.InitReq): Promise<VerifyOAuthClientResponse> {
    return fm.fetchReq<VerifyOAuthClientRequest, VerifyOAuthClientResponse>(`/auth.v4.OAuthService/VerifyOAuthClient`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static ExchangeOAuthCode(req: ExchangeOAuthCodeRequest, initReq?: fm.InitReq): Promise<ExchangeOAuthCodeResponse> {
    return fm.fetchReq<ExchangeOAuthCodeRequest, ExchangeOAuthCodeResponse>(`/auth.v4.OAuthService/ExchangeOAuthCode`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}