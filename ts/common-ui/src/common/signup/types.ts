import { ConsentStatus } from '@noice-com/schemas/auth/auth.pb';

export enum SignupStage {
  CompleteAccount = 'CompleteAccount',
  VerifyEmail = 'VerifyEmail',
  AccountExists = 'AccountExists',
  Completed = 'Completed',
}

export interface SignupStagesCompletedOptions {
  userId: string;
  target?: string;
  signupMode?: SignupMode;
}

export enum SignupMode {
  SignUp,
  LogIn,
}

export interface SignupError {
  header: string;
  message: string;
  hideBackButton?: boolean;
}

export interface SignupProcessData {
  email?: string;
  verifyEmailToken?: string;
  username?: string;
  dob?: {
    day: number;
    month: number;
    year: number;
  };
  verifiedCaptchaToken?: string;
  acceptedTerms?: { name: string; revision: string; signature: string }[];
  discordToken?: string;
  appleIdToken?: string;
  marketingConsent?: ConsentStatus;
}

export type InitSignupDataOptions = {
  discordToken?: string;
  appleIdToken?: string;
};

export interface SignupRoutes extends Record<SignupStage, string> {
  errorRoute: string;
  signupRootRoute: string;
  suspensionRoute: string;
}

export interface SignupState {
  action: 'login' | 'connect';
  check: string;
  connection?: 'apple' | 'discord';
  from?: string;
}

export interface SignupDiscordProfile {
  email: string;
}

export interface SignupDiscordFragment {
  error?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  access_token?: string;
  state: string;
}
