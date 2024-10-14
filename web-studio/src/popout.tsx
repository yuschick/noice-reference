import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/animations.css';
import '@noice-com/postcss/reset.css';

// eslint-disable-next-line no-restricted-imports
import '@noice-com/common-ui/src/assets/css/variables.css';
// eslint-disable-next-line no-restricted-imports
import '@noice-com/card-game/src/assets/css/variables.css';

import './assets/css/globals.css';
import './assets/css/variables.css';

import { PopoutApp } from './PopoutApp';

Sentry.init({
  release: NOICE.BUILD_HASH,
  dsn: 'https://5b0c4cf667929faea325b423ff7af4c2@o4505482970660864.ingest.sentry.io/4506393379078144',
  environment: NOICE.SENTRY_ENVIRONMENT,
  beforeSend(event) {
    // Ignore localhost, PR builds and dev
    if (
      ['pages.gcp.dev.noice.com', 'localhost', 'studio.int.dev.noice.com'].includes(
        window.location.hostname,
      )
    ) {
      return null;
    }

    return event;
  },
  integrations: [
    new CaptureConsole({
      levels: ['error'],
    }),
  ],
});

(async () => {
  if (!('container' in document.documentElement.style)) {
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved
    await import('https://unpkg.com/container-query-polyfill@^0.2.0');
  }
})();

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <PopoutApp />
  </StrictMode>,
);
