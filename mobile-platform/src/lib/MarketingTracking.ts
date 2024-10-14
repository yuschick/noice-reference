/* eslint-disable @typescript-eslint/naming-convention */
import { makeLoggers } from '@noice-com/utils';
import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import {
  SerializableObject,
  Singular,
  SingularConfig,
  SingularIOSPurchase,
} from 'singular-react-native';

import { UserConsent } from './UserConsent';

import { LocalStorage } from '@utils/storage';

const logger = makeLoggers('MarketingTracking');

type MarketingEventNames =
  | 'app_open'
  | 'stream_open'
  | 'game_card_picked'
  | 'game_card_scored'
  | 'game_finished_a_match'
  | 'game_level_up'
  | 'purchased_card_pack'
  | 'channel_follow'
  | 'rewarded_video_ad_watched'
  | 'added_a_friend'
  | 'sent_chat_message'
  | 'first_open'
  | 'user_retention';

const firebaseAnalytics = analytics();

type MarketingIAPEventNames = 'purchased_a_subscription';

type MarketingEventProductInfo = {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  currencyCode: string;
};

class _MarketingTracking {
  private config = new SingularConfig(Config.SINGULAR_KEY, Config.SINGULAR_SECRET);
  private initialized = false;

  private async init(userId: string) {
    if (this.initialized) {
      return;
    }

    const userConsentStatus = await UserConsent.getUserConsentStatus();

    if (
      userConsentStatus.status === 'not-collected' ||
      userConsentStatus.status === 'error'
    ) {
      return;
    }

    const isSingularAvailable =
      userConsentStatus?.status === 'exempt' ||
      (userConsentStatus.status === 'collected' && userConsentStatus.flags.singular) ||
      __DEV__;

    const isFirebaseAnalyticsAvailable =
      userConsentStatus?.status === 'exempt' ||
      (userConsentStatus.status === 'collected' &&
        userConsentStatus.flags.firebaseAnalytics) ||
      __DEV__;

    if (isSingularAvailable) {
      this.config.withCustomUserId(userId);
      this.config.withGlobalProperty('is_production', Config.SINGULAR_IS_PRD, true);
      this.config.withFacebookAppId(Config.FACEBOOK_APP_ID);
      this.config.withSkAdNetworkEnabled(true);

      // @todo this needs to handle nav, so needs refactoring
      this.config.withSingularLink((singularLinkParams) => {
        const { deeplink, urlParameters } = singularLinkParams;
        logger.log('Singular link params', { deeplink, urlParameters });
      });

      Singular.init(this.config);

      logger.log('Initialized Singular SDK ✅');
    }

    if (isFirebaseAnalyticsAvailable) {
      // Initialize Firebase
      firebaseAnalytics.setAnalyticsCollectionEnabled(true);
      firebaseAnalytics.setUserId(userId);
      firebaseAnalytics.setConsent({
        analytics_storage: true,
        ad_storage: true,
        ad_user_data: true,
        ad_personalization: true,
      });
      firebaseAnalytics.logAppOpen();

      logger.log('Initialized Firebase Analytics SDK ✅');
    }

    this.initialized = true;

    // Track events after SDKs are intialized
    this.trackEvent('app_open');

    if (this.isFirstOpen()) {
      this.trackEvent('first_open');
    }

    const daysSinceFirstOpen = this.getRetentionDays();
    this.trackEvent('user_retention', { daysSinceFirstOpen });
  }

  private getRetentionDays(): number {
    const storedTrackingInfo = LocalStorage.getMarketingTrackingInfo();

    if (!storedTrackingInfo.firstOpen) {
      return 0;
    }

    const timeDiff = Date.now() - storedTrackingInfo.firstOpen;
    const daysSinceFirstOpen = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return daysSinceFirstOpen;
  }

  private isFirstOpen(): boolean {
    const storedTrackingInfo = LocalStorage.getMarketingTrackingInfo();

    if (!storedTrackingInfo.firstOpen) {
      LocalStorage.setMarketingTrackingInfo({ firstOpen: Date.now() });
      return true;
    }

    return false;
  }

  private trackFirebaseEvent(
    eventName: MarketingEventNames,
    params?: SerializableObject,
  ) {
    switch (eventName) {
      case 'app_open':
        firebaseAnalytics.logAppOpen();
        return;
      case 'first_open':
        // NO_OP Firebase handles first open
        return;
      default:
        firebaseAnalytics.logEvent(eventName, params);
        return;
    }
  }

  public trackEvent(eventName: MarketingEventNames, params?: SerializableObject) {
    if (!this.initialized) {
      return;
    }

    logger.log('Sent tracking event: ', eventName, ' data: ', params);

    if (params) {
      Singular.eventWithArgs(eventName, params);
    } else {
      Singular.event(eventName);
    }

    this.trackFirebaseEvent(eventName, params);
  }

  public trackPurchase(
    eventName: MarketingIAPEventNames,
    productInfo: MarketingEventProductInfo,
  ) {
    if (!this.initialized) {
      return;
    }

    if (Platform.OS === 'android') {
      logger.logError('Purchase tracking is not implemented for Android.');
      return;
    }

    // Singular
    const singularPurchase = new SingularIOSPurchase(
      productInfo.price,
      productInfo.currencyCode,
      productInfo.id,
      'undefined',
      'undefined',
    );

    Singular.inAppPurchase(eventName, singularPurchase);

    // Firebase
    firebaseAnalytics.logPurchase({
      currency: productInfo.currencyCode,
      value: productInfo.priceValue,
      items: [
        {
          item_id: productInfo.id,
          item_name: productInfo.title,
        },
      ],
    });
  }

  public trackScreenView(screenName: string) {
    if (!this.initialized) {
      return;
    }

    // Firebase screen tracking
    firebaseAnalytics.logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }

  public enable(enabled: boolean, userId: string) {
    if (!enabled) {
      Singular.stopAllTracking();
      firebaseAnalytics.setAnalyticsCollectionEnabled(false);
      logger.log('Stopped all user marketing tracking');
      return;
    }

    if (!this.initialized) {
      this.init(userId);
      return;
    }

    // Singular
    Singular.trackingOptIn();
    Singular.resumeAllTracking();

    // Firebase
    firebaseAnalytics.setAnalyticsCollectionEnabled(true);
    firebaseAnalytics.setConsent({
      analytics_storage: true,
      ad_storage: true,
      ad_user_data: true,
      ad_personalization: true,
    });

    logger.log('Resumed all user tracking');
  }
}

export const MarketingTracking = new _MarketingTracking();
