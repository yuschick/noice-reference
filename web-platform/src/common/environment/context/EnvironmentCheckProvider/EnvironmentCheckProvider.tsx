import { useMountEffect } from '@noice-com/common-react-core';
import { WithChildren, useAnalytics } from '@noice-com/common-ui';
import { GPU } from '@noice-com/stream';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { MobileDeviceMetadata } from '@noice-com/webview-bridge';
import { createContext, useContext, useState } from 'react';

import { isReactNativeWebView } from '../../../../embeds/bridge';

import { checkBrowserSupport, getCurrentBrowser, getCurrentOS } from './utils';

const { logError, logWarn } = makeLoggers('ENVCHECK');

interface HookEnvChecks {
  isSupportedBrowser?: boolean;
  isMobile?: boolean;
  browserPlatform?: string;
  browserUserAgent?: string;
  browserViewport?: number;
  browserName?: string;
  browserOsName?: string;
}

const EnvironmentCheckContext = createContext<HookEnvChecks | Record<string, never>>({});

const getEnvironmentCheckFailed = (envChecks: HookEnvChecks) => {
  return !envChecks.isSupportedBrowser;
};

export function EnvironmentCheckProvider({ children }: WithChildren) {
  const { trackEvent } = useAnalytics();

  const [envChecks, setEnvChecks] = useState<HookEnvChecks>({});

  useMountEffect(() => {
    const getEnvironmentData = async () => {
      const data = await GPU.getTier();

      if (!data) {
        logError('Could not get GPU tier data!');
        return;
      }

      let mobileMetadata: Nullable<MobileDeviceMetadata> = null;
      if (
        isReactNativeWebView() ||
        typeof window.ReactNativeWebView?.injectedObjectJson === 'function'
      ) {
        mobileMetadata = JSON.parse(
          window.ReactNativeWebView?.injectedObjectJson?.() ?? '{}',
        ) as MobileDeviceMetadata;
      } else {
        logWarn('Device metadata is missing from this webview!');
      }

      const isSupportedBrowser = checkBrowserSupport() || isReactNativeWebView();
      const isMobile = !!data.isMobile;

      const envChecks: HookEnvChecks = {
        isSupportedBrowser,
        isMobile,
        browserPlatform: navigator.platform,
        browserUserAgent: navigator.userAgent,
        browserViewport: window.innerWidth,
        browserName: getCurrentBrowser(),
        browserOsName: getCurrentOS(),
      };

      trackEvent({
        clientEnvironmentCheck: {
          browserGpu: data.gpu || 'unknown',
          browserIsMobile: data.isMobile,
          browserGpuTier: data.tier,
          browserIsSupported: isSupportedBrowser,
          browserPlatform: navigator.platform,
          browserUserAgent: navigator.userAgent,
          browserViewport: window.innerWidth,
          browserName: getCurrentBrowser(),
          browserOsName: getCurrentOS(),
          environmentCheckFailed: getEnvironmentCheckFailed(envChecks),
          mobileBuildNumber: mobileMetadata?.buildNumber,
          mobileDeviceModel: mobileMetadata?.deviceModel,
          mobileOsName: mobileMetadata?.osName,
          mobileVersion: mobileMetadata?.version,
        },
      });

      setEnvChecks(envChecks);
    };

    getEnvironmentData();
  });

  return (
    <EnvironmentCheckContext.Provider value={envChecks}>
      {children}
    </EnvironmentCheckContext.Provider>
  );
}

export function useEnvironmentCheck(): HookEnvChecks & { isSupportedEnv: boolean } {
  const context = useContext(EnvironmentCheckContext);

  if (!context) {
    throw new Error(
      'Trying to access EnvironmentCheck from context without EnvironmentCheckProvider',
    );
  }

  return {
    isSupportedBrowser: context.isSupportedBrowser,
    isMobile: context.isMobile,
    isSupportedEnv: !getEnvironmentCheckFailed(context),
    browserPlatform: context.browserPlatform,
    browserUserAgent: context.browserUserAgent,
    browserViewport: context.browserViewport,
    browserName: context.browserName,
    browserOsName: context.browserOsName,
  };
}
