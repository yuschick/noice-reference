import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/animations.css';
import '@noice-com/postcss/reset.css';

// eslint-disable-next-line no-restricted-imports
import '@noice-com/common-ui/src/assets/css/variables.css';

import './assets/css/inter-font.css';
import './assets/css/globals.global.css';
import './assets/css/variables.css';

import '@reach/dialog/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
