import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/animations.css';
import '@noice-com/postcss/reset.css';

// eslint-disable-next-line no-restricted-imports
import '@noice-com/common-ui/src/assets/css/variables.css';
// eslint-disable-next-line no-restricted-imports
import '@noice-com/card-game/src/assets/css/variables.css';
import './assets/css/variables.css';
import './assets/css/global-styles.css';
import '@reach/dialog/styles.css';

import './window-noice-helpers';

import { DebugView } from '@noice-com/card-game';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './sentry';
import { registerServiceWorker } from './service-worker-registration';

registerServiceWorker();

const IS_DEBUG =
  window.location.pathname.includes('/debug') || window.location.hash.includes('/debug');
const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(<StrictMode>{!IS_DEBUG ? <App /> : <DebugView />}</StrictMode>);
