import { isIos } from '@braintree/browser-detection';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  ButtonLink,
  IconButton,
  NoiceLogo,
  useAnalytics,
  useSessionStorage,
} from '@noice-com/common-ui';
import { AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction } from '@noice-com/schemas/analytics/analytics.pb';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import styles from './MobileAppCtaBanner.module.css';

const unsupportedCountries = ['France', 'Cuba', 'Iran', 'North Korea', 'Sudan', 'Syria'];

export function MobileAppCtaBanner() {
  const [isSupportedCountry, setIsSupportedCountry] = useState(false);
  const sessionStorage = useSessionStorage();
  const [isShown, setIsShown] = useState(
    sessionStorage.getValue('platform.mobileAppBanner.isShown') ?? true,
  );
  const location = useLocation();

  const { trackEvent } = useAnalytics();

  const isIOS = isIos();
  const version = Number(
    /iP(hone|ad) OS ([1-9]*)/i.exec(window.navigator.userAgent)?.[2],
  );

  const handleCloseBanner = () => {
    trackEvent({
      clientWebMobileAppBannerAction: {
        pathname: location.pathname,
        action:
          AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction.WEB_MOBILE_APP_BANNER_ACTION_TYPE_DISMISS,
      },
    });
    setIsShown(false);
    sessionStorage.setValue('platform.mobileAppBanner.isShown', false);
  };

  const handleGetAppClick = () => {
    trackEvent({
      clientWebMobileAppBannerAction: {
        pathname: location.pathname,
        action:
          AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction.WEB_MOBILE_APP_BANNER_ACTION_TYPE_DOWNLOAD,
      },
    });
    setIsShown(false);
    sessionStorage.setValue('platform.mobileAppBanner.isShown', false);
  };

  useEffect(() => {
    // https://stackoverflow.com/a/54437940/544847
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((response) => {
        const isSupported = !unsupportedCountries.find((country) =>
          // We check like this in case the returned country is something like The Democratic People's Republic of Korea,
          // yet we only have North Korea in our list
          response.country.includes(country),
        );
        setIsSupportedCountry(isSupported);
        return;
      })
      .catch(() => {
        setIsSupportedCountry(false);
      });
  }, []);

  useMountEffect(() => {
    if (!isIOS || version < 16 || !isSupportedCountry) {
      return;
    }

    trackEvent({
      clientWebMobileAppBannerAction: {
        pathname: location.pathname,
        action:
          AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction.WEB_MOBILE_APP_BANNER_ACTION_TYPE_SHOWN,
      },
    });
  });

  if (!isShown || !isIOS || version < 16 || !isSupportedCountry) {
    return null;
  }

  return (
    <section className={styles.ctaBannerWrapper}>
      <IconButton
        icon={CoreAssets.Icons.Close}
        label="Close banner"
        level="secondary"
        size="xs"
        theme="dark"
        variant="ghost"
        onClick={handleCloseBanner}
      />
      <div className={styles.bannerContentWrapper}>
        <div className={styles.logoWrapper}>
          <NoiceLogo
            theme="spectrum"
            variant="mark"
            width={25}
          />
        </div>
        <span className={styles.textContent}>
          What are you doing here? We&apos;ve got an app now!
        </span>
        <ButtonLink
          fit="content"
          rel="noopener noreferrer"
          size="xs"
          target="_blank"
          theme="dark"
          to="https://noice.sng.link/D3eop/ha3o?_smtype=3"
          onClick={handleGetAppClick}
        >
          Get the App
        </ButtonLink>
      </div>
    </section>
  );
}
