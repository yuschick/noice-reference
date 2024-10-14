import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { MockChannelProvider, MockChannelRouteProvider } from '../src/common/channel';

import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/reset.css';

import '../../../lib/ts/common-ui/src/assets/css/variables.css';
import '../../../lib/ts/card-game/src/assets/css/variables.css';
import '../../../tools/postcss/src/animations.css';
import '../src/assets/css/variables.css';
import '../src/assets/css/globals.css';
import {
  MockAuthProvider,
  MockFeatureFlagProvider,
  SoundController,
  SoundControllerProvider,
  MockAnalyticProvider,
} from '@noice-com/common-ui';
import { SocialPackageProvider } from '@noice-com/social';

const soundController = new SoundController();

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
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
    (Story) => (
      <MockAuthProvider>
        <MockFeatureFlagProvider> <MockAnalyticProvider>
          <SoundControllerProvider soundController={soundController}>
            <MockChannelProvider>
              <MockChannelRouteProvider>  
                <SocialPackageProvider
                      createProfileRoutePath={(username: string) =>
                        `/made-up-profile-path-for-storybook/${username}`
                      }
                    >
                  <Story />
                  </SocialPackageProvider>
              </MockChannelRouteProvider>
            </MockChannelProvider>
          </SoundControllerProvider>
          </MockAnalyticProvider>
        </MockFeatureFlagProvider>
      </MockAuthProvider>
    ),
  ],
};

export default preview;
