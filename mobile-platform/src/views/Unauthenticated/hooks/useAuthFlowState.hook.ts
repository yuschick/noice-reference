import { ConsentStatus, TermsVersion } from '@noice-com/schemas/auth/auth.pb';
import { Nullable } from '@noice-com/utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AuthDate } from '@gen/graphql';
import { zustandPersitentStorage } from '@utils/storage';

export interface PendingEmailVerification {
  verifiedEmailToken: string;
  receivedTime: number;
  tokenSentAt: number;
}

export interface PendingSignInData {
  email: string;
  captchaToken?: string;
  emailVerification?: PendingEmailVerification;
  discordToken?: string;
  appleIdToken?: string;
}

export type PendingSignupData = {
  signedTerms: TermsVersion;
  marketingConsent: ConsentStatus;
  username: string;
  email: string;
  dob: AuthDate;
};

type ConnectableProvider = 'discord';

type AuthFlowStore = {
  pendingSignInData?: Nullable<PendingSignInData>;
  setPendingSignInData: (pendingSignInData: Nullable<PendingSignInData>) => void;
  pendingSignUpData?: Nullable<PendingSignupData>;
  setPendingSignUpData: (pendingSignUpData: Nullable<PendingSignupData>) => void;
  clearAllPendingData: () => void;
  connectSSOProviderOnSignIn?: Nullable<ConnectableProvider>;
  setConnectSSOProviderOnSignIn: (provider: ConnectableProvider) => void;
};

export const useAuthFlowState = create(
  persist<AuthFlowStore>(
    (set, get) => ({
      pendingSignInData: get()?.pendingSignInData,
      setPendingSignInData: (newData) =>
        set({
          pendingSignInData: newData
            ? {
                ...(get()?.pendingSignInData ?? {}),
                ...newData,
              }
            : null,
        }),
      pendingSignUpData: get()?.pendingSignUpData,
      setPendingSignUpData: (pendingSignUpData) => set({ pendingSignUpData }),
      clearAllPendingData: () =>
        set({
          pendingSignInData: null,
          pendingSignUpData: null,
          connectSSOProviderOnSignIn: null,
        }),
      connectSSOProviderOnSignIn: get()?.connectSSOProviderOnSignIn,
      setConnectSSOProviderOnSignIn: (provider) =>
        set({ connectSSOProviderOnSignIn: provider }),
    }),
    {
      name: 'auth-flow-storage',
      storage: createJSONStorage(() => zustandPersitentStorage),
    },
  ),
);
