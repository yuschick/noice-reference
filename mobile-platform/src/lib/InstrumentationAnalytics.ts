import { logger } from '@noice-com/platform-client/src/lib';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

import {
  bundleIdToEnvironment,
  isStoreInstall,
  isTestFlightInstall,
} from '@utils/installer';

interface Breadcrumb {
  data?: { [key: string]: unknown };
  message?: string;
  category?: string;
  severityLevel?: SeverityLevel;
}

interface ExceptionOptions {
  severityLevel?: SeverityLevel;
  tags?: Tags;
  extra?: { [key: string]: unknown };
}

interface Tags {
  [key: string]: number | string | boolean;
}

type SeverityLevel = 'error' | 'debug' | 'log' | 'info' | 'warning' | 'fatal';

const log = logger('Sentry');

// Our Sentry setup has two envs, prod and staging
// App Store releases should go to prod, TestFlight to either that or staging depending bundle id
// Local prod builds are considered staging, even when running a prod build
const resolveSentryEnvironment = () => {
  if (isStoreInstall() || (isTestFlightInstall() && bundleIdToEnvironment() === 'prod')) {
    return 'prod';
  }

  return 'staging';
};

// eslint-disable-next-line @typescript-eslint/naming-convention
class _InstrumentationAnalytics {
  public routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

  constructor() {
    Sentry.init({
      // Note: running a local prod build will have __DEV__ set to false
      enabled: !__DEV__ && Config.IS_RELEASE_BUILD === 'true',
      dsn: Config.SENTRY_DSN,
      /// enviroment is set to prod if the app is installed from TestFlight or the App Store,
      // otherwise it's set to staging, even on local prod builds
      environment: resolveSentryEnvironment(),
      beforeBreadcrumb(breadcrumb) {
        // filter out breadcrumbs that contain email addresses
        const emailRegex = /[\w-]+@([\w-]+\.)+[\w-]+/;
        if (breadcrumb.message && emailRegex.test(breadcrumb.message)) {
          return null;
        }

        return breadcrumb;
      },
      integrations: [
        new Sentry.ReactNativeTracing({
          routingInstrumentation: this.routingInstrumentation,
          enableUserInteractionTracing: true,
          enableStallTracking: true,
          enableAppStartTracking: true,
          enableNativeFramesTracking: true,
        }),
      ],
    });
  }

  public wrapRoot(rootComponent: React.ComponentType<JSX.IntrinsicAttributes>) {
    return Sentry.wrap(rootComponent);
  }

  public captureException(error: Error, options?: ExceptionOptions) {
    const { tags, severityLevel, extra } = options ?? {};
    log.error(error.message);
    Sentry.captureException(error, {
      tags,
      level: severityLevel,
      extra,
    });
  }

  public captureMessage(message: string, tags?: Tags, severityLevel?: SeverityLevel) {
    log.info(message);
    Sentry.captureMessage(message, { tags, level: severityLevel });
  }

  public addBreadcrumb({ data, message, category, severityLevel = 'info' }: Breadcrumb) {
    log.info(message ?? '');
    Sentry.addBreadcrumb({
      data,
      message,
      category,
      level: severityLevel,
      timestamp: Date.now(),
    });
  }
}

export const InstrumentationAnalytics = new _InstrumentationAnalytics();
