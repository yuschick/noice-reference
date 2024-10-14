import { makeLoggers } from '@noice-com/utils';
import {
  Usercentrics,
  UsercentricsOptions,
  UsercentricsServiceConsent,
} from '@usercentrics/react-native-sdk';
import Config from 'react-native-config';

import { InstrumentationAnalytics } from './InstrumentationAnalytics';

const logger = makeLoggers('[User Consent]');

type ConsentType =
  | 'ironSource'
  | 'userCentricPlatform'
  | 'singular'
  | 'firebaseAnalytics';

const templateIds: Record<ConsentType, string> = {
  ironSource: '9dchbL797',
  userCentricPlatform: 'H1Vl5NidjWX',
  singular: 'OxsYgtMfe7aP8u',
  firebaseAnalytics: 'kjk3gPD2cxt_Ea',
} as const;

type UserConsentFlags = Partial<Record<ConsentType, boolean>>;

export type UserConsentStatus =
  | {
      status: 'exempt';
    }
  | {
      status: 'not-collected';
    }
  | {
      status: 'error';
    }
  | {
      status: 'collected';
      flags: UserConsentFlags;
    };

// eslint-disable-next-line @typescript-eslint/naming-convention
class _UserConsent {
  private getStatusFlags(consents: UsercentricsServiceConsent[]): UserConsentFlags {
    const flags: UserConsentFlags = {};

    const templateKeys = Object.keys(templateIds) as ConsentType[];
    for (const consent of consents) {
      for (const key of templateKeys) {
        if (consent.templateId === templateIds[key]) {
          flags[key] = consent.status;
        }
      }
    }

    return flags;
  }

  public configure() {
    const options = new UsercentricsOptions({
      settingsId: Config.USER_CENTRIC_SETTINGS_ID,
    });

    Usercentrics.configure(options);
  }

  public async getUserConsentStatus(): Promise<UserConsentStatus> {
    try {
      const status = await Usercentrics.status();

      if (
        status.geolocationRuleset &&
        !status.geolocationRuleset.bannerRequiredAtLocation
      ) {
        return {
          status: 'exempt',
        };
      }

      if (status.shouldCollectConsent) {
        return {
          status: 'not-collected',
        };
      } else {
        const flags = this.getStatusFlags(status.consents);

        return {
          status: 'collected',
          flags,
        };
      }
    } catch (err) {
      logger.logError(err);
      if (typeof err === 'string') {
        InstrumentationAnalytics.captureException(new Error(err));
      }
      return {
        status: 'error',
      };
    }
  }

  public async showUserConsentView(): Promise<UserConsentFlags | undefined> {
    try {
      const userResponse = await Usercentrics.showFirstLayer();
      const flags = this.getStatusFlags(userResponse.consents);

      return flags;
    } catch (err) {
      logger.logError(err);
      if (typeof err === 'string') {
        InstrumentationAnalytics.captureException(new Error(err));
      }
    }
  }
}

export const UserConsent = new _UserConsent();
