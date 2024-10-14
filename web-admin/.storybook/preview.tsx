import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/reset.css';

import '../../../lib/ts/common-ui/src/assets/css/variables.css';
import '../../../tools/postcss/src/animations.css';
import '../src/assets/css/variables.css';
import '../src/assets/css/globals.global.css';
import '../src/assets/css/inter-font.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider,
    addTypename: false,
  },
  },
   decorators: [
    (Story) => (<MemoryRouter initialEntries={['/']}><Story /></MemoryRouter>),
  ]
}

export default preview