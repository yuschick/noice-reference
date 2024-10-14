import { AnalyticsEventClientSignupStepSignupMode } from '@noice-com/schemas/analytics/analytics.pb';

import {
  SignupDiscordFragment,
  SignupDiscordProfile,
  SignupMode,
  SignupState,
} from './types';

export const encodeDiscordState = (state: SignupState) => {
  try {
    return encodeURIComponent(window.btoa(JSON.stringify(state)));
  } catch (e) {
    return null;
  }
};

export const getDiscordStateFromFragment = (fragment: SignupDiscordFragment) => {
  try {
    return JSON.parse(window.atob(decodeURIComponent(fragment.state))) as SignupState;
  } catch (e) {
    return null;
  }
};

export const getDiscordAuthorizeUrl = (
  clientId: string,
  redirectUrl: string,
  state: string,
) => {
  return `https://discord.com/oauth2/authorize?response_type=token&state=${state}&client_id=${clientId}&scope=email%20identify&prompt=none&redirect_uri=${redirectUrl}`;
};

export const fetchDiscordProfile = async (discordToken: string) => {
  try {
    return (await (
      await fetch('https://discord.com/api/users/@me', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${discordToken}`,
        },
      })
    ).json()) as SignupDiscordProfile;
  } catch (e) {
    return null;
  }
};

export const SIGNUP_DISABLED_LOCALSTORAGE_KEY = '__NoiceSignupDisabled__';

export const isSignupDisabledByBirthDate = (day: number, month: number, year: number) => {
  // Is the user 13th birthday in future or past
  return new Date(year + 13, month - 1, day) > new Date();
};

export const getAnalyticsSignupMode = (mode?: SignupMode) => {
  if (mode === SignupMode.SignUp) {
    return AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP;
  }

  if (mode === SignupMode.LogIn) {
    return AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNIN;
  }

  return AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_UNSPECIFIED;
};
