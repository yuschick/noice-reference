import { makeLoggers } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';
import {
  InitializationListener,
  IronSource,
  IronSourceError,
  IronSourceRVPlacement,
  LevelPlayRewardedVideoManualListener,
} from 'ironsource-mediation';
import Config from 'react-native-config';

import { UserConsent } from './UserConsent';

import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';

export type AdPlacementName = 'Home_Screen';

const { logError } = makeLoggers('Ad network');

type AdNetworkEvents = {
  availabilityChange: (available: boolean) => void;
  error: (error: IronSourceError) => void;
  rewarded: (placement: IronSourceRVPlacement) => void;
  closed: () => void;
};

const adNetworkEvents = new EventEmitter<AdNetworkEvents>();

// eslint-disable-next-line @typescript-eslint/naming-convention
class _AdNetwork {
  private addListenerWithCleanup<K extends keyof AdNetworkEvents>(
    eventName: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (...args: any[]) => {
      callback(...args);
      adNetworkEvents.removeListener(eventName, listener);
    };

    adNetworkEvents.addListener(eventName, listener);
  }

  public listenToRewardedAdEvents() {
    const listeners: LevelPlayRewardedVideoManualListener = {
      onAdReady: () => {
        InstrumentationAnalytics.addBreadcrumb({
          message: '[Ad network]: Rewarded video ad is ready.',
          severityLevel: 'log',
        });

        adNetworkEvents.emit('availabilityChange', true);
      },
      onAdLoadFailed: (error: IronSourceError) => {
        InstrumentationAnalytics.captureException(
          new Error(
            `[Ad network]: failed to load video ad. Code: ${error.errorCode} Message: ${error.message}`,
          ),
        );

        adNetworkEvents.emit('error', error);
      },
      onAdShowFailed: (error: IronSourceError) => {
        InstrumentationAnalytics.captureException(
          new Error(
            `[Ad network]: failed to show video ad. Code: ${error.errorCode} Message: ${error.message}`,
          ),
        );

        adNetworkEvents.emit('error', error);
      },
      onAdRewarded: (placement) => {
        InstrumentationAnalytics.addBreadcrumb({
          message: '[Ad network]: User got rewarded from rewarded video ad.',
          data: placement,
          severityLevel: 'log',
        });

        adNetworkEvents.emit('rewarded', placement);
        IronSource.loadRewardedVideo();
      },
      onAdClosed: () => {
        InstrumentationAnalytics.addBreadcrumb({
          message: '[Ad network]: Rewarded video ad closed.',
          severityLevel: 'log',
        });

        adNetworkEvents.emit('closed');
      },
    };

    IronSource.setLevelPlayRewardedVideoManualListener(listeners);
  }

  public async init(): Promise<void> {
    try {
      const listener: InitializationListener = {
        onInitializationComplete: () => {
          InstrumentationAnalytics.captureMessage(
            'Succesfully initalized IronSource SDK ✅',
          );
        },
      };

      IronSource.setInitializationListener(listener);

      await IronSource.init(Config.IRON_SOURCE_APP_KEY, ['REWARDED_VIDEO']);
      await IronSource.validateIntegration();

      const userConsent = await UserConsent.getUserConsentStatus();

      if (userConsent.status === 'not-collected') {
        const errorMessage = `User consent is not collected, aborting IronSource setup. Reason: ${userConsent.status}`;
        throw new Error(errorMessage);
      }

      const hasConsent =
        userConsent.status === 'exempt' ??
        (userConsent.status === 'collected' && userConsent.flags.ironSource) ??
        false;

      // Metadata
      await IronSource.setConsent(hasConsent);
      await IronSource.setMetaData('do_not_sell', ['true']);
      await IronSource.setMetaData('is_child_directed', ['false']);
      await IronSource.shouldTrackNetworkState(true);
      await IronSource.setAdaptersDebug(true);

      // Adapter setup
      await IronSource.setMetaData('UnityAds_coppa', ['false']);

      // Rewarded video setup
      this.listenToRewardedAdEvents();
      await IronSource.loadRewardedVideo();
    } catch (err) {
      logError('Failed to initalize Ad Network, ', err);
      if (typeof err === 'string') {
        InstrumentationAnalytics.captureException(new Error(err));
      }
    }
  }

  public async setNetworkConsent(consent: boolean) {
    await IronSource.setConsent(consent);
  }

  public showRewardedVideo(
    placementName: AdPlacementName,
    onComplete: (placement: IronSourceRVPlacement) => void,
    onClose: () => void,
  ) {
    // incase called again before cleanup
    adNetworkEvents.removeAllListeners('rewarded');
    adNetworkEvents.removeAllListeners('closed');

    this.addListenerWithCleanup('rewarded', onComplete);
    this.addListenerWithCleanup('closed', onClose);
    IronSource.showRewardedVideo(placementName);
  }

  public removeRewardedVideoListeners() {
    adNetworkEvents.removeAllListeners();
  }

  public onRewardedVideoAvailabilityChanged(callback: (available: boolean) => void) {
    adNetworkEvents.removeAllListeners('availabilityChange');
    adNetworkEvents.addListener('availabilityChange', callback);
  }

  public onRewardedVideoError(callback: (error: IronSourceError) => void) {
    adNetworkEvents.removeAllListeners('error');
    adNetworkEvents.addListener('error', callback);
  }

  public isRewardedVideoAvailable() {
    return IronSource.isRewardedVideoAvailable();
  }
}

export const AdNetwork = new _AdNetwork();
