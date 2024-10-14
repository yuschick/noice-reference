import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing';
import * as jest from 'jest-mock';
import type { Preview } from '@storybook/react';

import {
  UIEventHandlerProvider,
  UIEventsHandler,
  SoundController,
  SoundControllerProvider,
  MockAuthProvider,
  FTUEActionHandlerProvider,
  FTUEActionsHandler,
  MockAnalyticProvider,
  MockFeatureFlagProvider,
  MockConversionEventsProvider,
  MockAuthenticatedUserProvider,
} from '@noice-com/common-ui';
import { SocialPackageProvider, MockPartyProvider } from '@noice-com/social';

import { MockMicroSurveyProvider } from '../src/context/MicroSurveyProvider';
import { MockSelectedUIStateProvider } from '../src/context/SelectedUIStateProvider';
import { MockCardGameUIGameStateProvider, MockLeaderboardProvider } from '@noice-com/card-game';
import { MockImplicitAccountUpSellingProvider } from '../src/common/implicit-account';

import '@noice-com/postcss/fonts.css';
import '@noice-com/design-tokens/gen/brand.css';
import '@noice-com/postcss/reset.css';

import '../../../tools/postcss/src/animations.css';
import '../../../lib/ts/common-ui/src/assets/css/variables.css';
import '../../../lib/ts/card-game/src/assets/css/variables.css';
import '../src/assets/css/variables.css';

import '@reach/dialog/styles.css';

const uiEventsHandler = new UIEventsHandler();
const soundController = new SoundController();
const ftueActionHandler = new FTUEActionsHandler();

// @ts-expect-error
window.jest = jest;

const preview: Preview = {
  parameters: {
    layout: 'centered',
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
    options: {
      storySort: {
        method: 'alphabetical',
      },
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
        <MockAuthenticatedUserProvider>
          <MockFeatureFlagProvider>
            <SoundControllerProvider soundController={soundController}>
              <UIEventHandlerProvider uiEventsHandler={uiEventsHandler}>
                <MockConversionEventsProvider>
                  <MockAnalyticProvider>
                    <FTUEActionHandlerProvider actionHandler={ftueActionHandler}>
                      <SocialPackageProvider
                        createProfileRoutePath={(username: string) =>
                          `/made-up-profile-path-for-storybook/${username}`
                        }
                      >
                        <MockSelectedUIStateProvider>
                          <MockCardGameUIGameStateProvider>
                            <MockPartyProvider>
                              <MockMicroSurveyProvider>
                                <MockLeaderboardProvider>
                                  <MockImplicitAccountUpSellingProvider>
                                  <Story />
                                  </MockImplicitAccountUpSellingProvider>
                                </MockLeaderboardProvider>
                              </MockMicroSurveyProvider>
                            </MockPartyProvider>
                          </MockCardGameUIGameStateProvider>
                        </MockSelectedUIStateProvider>
                      </SocialPackageProvider>
                    </FTUEActionHandlerProvider>
                  </MockAnalyticProvider>
                </MockConversionEventsProvider>
              </UIEventHandlerProvider>
            </SoundControllerProvider>
          </MockFeatureFlagProvider>
        </MockAuthenticatedUserProvider>
      </MockAuthProvider>
    ),
  ],
};

export default preview;
