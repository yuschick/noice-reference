import { Nullable } from '@noice-com/utils';
import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

import { Primitive } from './types';

// Ignore localhost & PR builds
const SKIP_SENTRY = [
  'pages.gcp.dev.noice.com',
  'localhost',
  'mvp.int.dev.noice.com',
].includes(window.location.hostname);

Sentry.init({
  release: NOICE.BUILD_HASH,
  dsn: 'https://1f5cf344e0b6986725c757108373301c@o4505482970660864.ingest.sentry.io/4506280598896640',
  environment: NOICE.SENTRY_ENVIRONMENT,
  beforeSend(event) {
    if (SKIP_SENTRY) {
      return null;
    }

    return event;
  },
  integrations: [
    new CaptureConsole({
      levels: ['error'],
    }),
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
  ],
  beforeBreadcrumb(breadcrumb, hint) {
    // If the breadcrumb is a query fetch request, try to parse the body and add it to the breadcrumb
    if (
      breadcrumb.data?.url.endsWith('/query') &&
      breadcrumb.category === 'fetch' &&
      hint
    ) {
      try {
        const body = JSON.parse(hint.input?.[1].body as string);

        return {
          ...breadcrumb,
          data: {
            ...breadcrumb.data,
            variables: body?.variables,
            operationName: body?.operationName,
          },
        };
      } catch (err) {
        // If we can't parse the body, just return the breadcrumb
        return breadcrumb;
      }
    }

    return breadcrumb;
  },
  tracesSampleRate: SKIP_SENTRY ? 0.0 : 0.1,
});

export function setUserID(id: Nullable<string>) {
  if (!id) {
    Sentry.setUser(null);
  } else {
    Sentry.setUser({ id });
  }
}

export function setTag(key: string, value: Primitive) {
  Sentry.setTag(key, value);
}
