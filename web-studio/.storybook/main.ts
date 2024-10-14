import { mergeConfig } from 'vite';

module.exports = {
  stories: [{
    directory: '../src',
    titlePrefix: 'Studio'
  }],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "storybook-addon-apollo-client"],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal(config) {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: ['.', '../../lib/ts/common-ui', '../../tools/postcss'],
        },
      },
    });
  },
};