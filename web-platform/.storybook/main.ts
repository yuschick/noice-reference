import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { optimizeSvgFiles } from '@noice-com/vite-plugins';

module.exports = {
  stories: [
    {
      directory: '../src',
      titlePrefix: 'Platform App'
    },
    {
      directory: '../../../lib/ts/common-ui/src',
      titlePrefix: 'Common UI'
    },
    {
      directory: '../../../lib/ts/chat-react-web/src',
      titlePrefix: 'Chat'
    },
    {
      directory: '../../../lib/ts/social/src',
      titlePrefix: 'Social'
    },
    {
      directory: '../../../lib/ts/stream/src',
      titlePrefix: 'Stream'
    },
    {
      directory: '../../../lib/ts/card-game/src',
      titlePrefix: 'Card Game'
    },
    {
      directory: '../../../lib/ts/universal-challenges-react-core/src',
      titlePrefix: 'Universal Challenges'
    }
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    "storybook-addon-apollo-client",
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal(config) {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: [
            ".",
            "../../tools/postcss",
            "../../lib/ts/common-ui",
            "../../lib/ts/chat-react-core",
            "../../lib/ts/chat-react-web",
            "../../lib/ts/social",
            "../../lib/ts/social-react-core",
            "../../lib/ts/stream",
            "../../lib/ts/card-game",
          ],
        },
      },
      plugins: [
        tsconfigPaths(),
        optimizeSvgFiles(),
      ],
      css: {
        modules: {
          localsConvention: 'camelCaseOnly',
        },
      },
    });
  },
};
