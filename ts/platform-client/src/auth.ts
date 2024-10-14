import {
  AgreementRevision,
  AgreementService,
} from '@noice-com/schemas/agreement/agreement.pb';
import {
  Auth,
  RefreshTokenRequest,
  Account,
  AuthAdminService as AuthAdminServicePb,
  Invitation,
  IdentityType,
  UpdateAccountRequest,
  CreateAccountRequest,
  GenerateAccessTokenRequest,
  ConsentStatus,
} from '@noice-com/schemas/auth/auth.pb';
import {
  AuthServiceV4,
  CompleteTemporaryAccountRequest,
  CreateTemporaryAccountRequest,
  CreateTemporaryAccountResponse,
  EmailVerificationMode,
  ExchangeExtAuthCodeRequest,
  ExchangeExtAuthCodeResponse,
  SignAgreementsRequest,
  SignInRequest as SignInRequestV4,
  SignInResponse as SignInResponseV4,
  SignUpRequest as SignUpRequestV4,
  SignUpResponse as SignUpResponseV4,
  VerifySignupRequest,
  VerifySignupResponse,
} from '@noice-com/schemas/auth/authv4.pb';

import { IRequestParamsProvider, SubService } from './types';

export class AuthService extends SubService {
  constructor(provider: IRequestParamsProvider) {
    super(provider);
  }

  public async refreshSession(req?: RefreshTokenRequest): Promise<Auth> {
    const { auth } = await AuthServiceV4.RefreshToken(req || {}, this._getInitAuthReq());

    return auth;
  }

  public async signOut(refreshToken?: string): Promise<void> {
    await AuthServiceV4.SignOut({ refreshToken }, this._getInitAuthReq());
  }

  public async verifyEmail(
    email: string,
    mode?: EmailVerificationMode,
    captchaToken?: string,
  ): Promise<string> {
    const { token } = await AuthServiceV4.VerifyEmail(
      { email, mode, captchaToken },
      await this._getInitReq(),
    );

    return token;
  }

  /**
   * @deprecated use verifyCaptcha method with hCaptcha
   */
  public async verifyRecaptcha(recaptchaToken: string): Promise<string> {
    const { token } = await AuthServiceV4.VerifyCaptcha(
      { recaptchaToken },
      await this._getInitReq(),
    );

    return token;
  }

  public async verifyCaptcha(hcaptchaToken: string): Promise<string> {
    const { token } = await AuthServiceV4.VerifyCaptcha(
      { hcaptchaToken },
      await this._getInitReq(),
    );

    return token;
  }

  public async exchangeAuthCode(
    req: ExchangeExtAuthCodeRequest,
  ): Promise<ExchangeExtAuthCodeResponse> {
    return await AuthServiceV4.ExchangeExtAuthCode(req, await this._getInitReq());
  }

  public async passwordlessSignIn(req: SignInRequestV4): Promise<SignInResponseV4> {
    return await AuthServiceV4.SignIn(req, this._getInitAuthReq());
  }

  public async completeAccount(req: SignUpRequestV4): Promise<SignUpResponseV4> {
    return await AuthServiceV4.SignUp(req, this._getInitAuthReq());
  }

  public async createTemporaryAccount(
    req: CreateTemporaryAccountRequest,
  ): Promise<CreateTemporaryAccountResponse> {
    return await AuthServiceV4.CreateTemporaryAccount(req, await this._getInitAuthReq());
  }

  public async completeTemporaryAccount(
    req: CompleteTemporaryAccountRequest,
  ): Promise<void> {
    await AuthServiceV4.CompleteTemporaryAccount(req, await this._getInitReq());
  }

  public async verifySignup(req: VerifySignupRequest): Promise<VerifySignupResponse> {
    return await AuthServiceV4.VerifySignup(req, await this._getInitReq());
  }

  public async getAccount(uid: string): Promise<Account> {
    return await AuthServiceV4.GetAccount({ userId: uid }, await this._getInitReq());
  }

  public async accessChannel(channelName: string): Promise<void> {
    await AuthServiceV4.AccessChannel({ channelName }, await this._getInitReq());
  }

  public async signAgreements(req: SignAgreementsRequest): Promise<void> {
    await AuthServiceV4.SignAgreements(req, await this._getInitReq());
  }

  public async updateMarketingConsent(marketingConsent: ConsentStatus): Promise<void> {
    await AuthServiceV4.UpdateMarketingConsent(
      { marketingConsent },
      await this._getInitReq(),
    );
  }

  public async listAgreements(): Promise<AgreementRevision[]> {
    const { agreements } = await AgreementService.ListAgreements(
      {},
      await this._getInitReq(),
    );

    return agreements;
  }

  public async addDiscordAccount(discordToken: string): Promise<void> {
    await AuthServiceV4.AddExternalAccount({ discordToken }, await this._getInitReq());
  }

  public async addAppleAccount(appleIdToken: string): Promise<void> {
    await AuthServiceV4.AddExternalAccount({ appleIdToken }, await this._getInitReq());
  }

  public async deleteDiscordAccount(): Promise<void> {
    await AuthServiceV4.DeleteExternalAccount(
      { idType: IdentityType.IDENTITY_TYPE_DISCORD },
      await this._getInitReq(),
    );
  }

  public async deleteAppleAccount(): Promise<void> {
    await AuthServiceV4.DeleteExternalAccount(
      { idType: IdentityType.IDENTITY_TYPE_APPLE },
      await this._getInitReq(),
    );
  }
}

export class AuthAdminService extends SubService {
  constructor(provider: IRequestParamsProvider) {
    super(provider);
  }

  public async resolveEmails(emails: string[]): Promise<{ [key: string]: string }> {
    const { userIds } = await AuthAdminServicePb.ResolveEmails(
      { emails },
      await this._getInitReq(),
    );

    return userIds;
  }

  public async createInvitationForEmail(email: string): Promise<string> {
    const { uid } = await AuthAdminServicePb.CreateInvitation(
      { identities: [{ type: IdentityType.IDENTITY_TYPE_EMAIL, id: email }] },
      await this._getInitReq(),
    );

    return uid;
  }

  public async getAccounts(userIds: string[]): Promise<Account[]> {
    const { accounts } = await AuthAdminServicePb.BatchGetAccounts(
      { userIds },
      await this._getInitReq(),
    );

    return accounts;
  }

  public async getInvitations(userIds: string[]): Promise<Invitation[]> {
    const { invitations } = await AuthAdminServicePb.BatchGetInvitations(
      { userIds },
      await this._getInitReq(),
    );

    return invitations;
  }

  public async updateAccount(req: UpdateAccountRequest): Promise<Account> {
    return await AuthAdminServicePb.UpdateAccount(req, await this._getInitReq());
  }

  public async createAccount(req: CreateAccountRequest): Promise<Account> {
    return await AuthAdminServicePb.CreateAccount(req, await this._getInitReq());
  }

  public async generateAccessToken(req: GenerateAccessTokenRequest): Promise<Auth> {
    const { auth } = await AuthAdminServicePb.GenerateAccessToken(
      req,
      await this._getInitReq(),
    );

    return auth;
  }
}
