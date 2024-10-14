const { getDefaultConfig: getDefaultExpoConfig } = require('expo/metro-config');
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');
const { withSentryConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const defaultExpoConfig = getDefaultExpoConfig(projectRoot)
const defaultConfig = withSentryConfig(getDefaultConfig(projectRoot))
const { assetExts, sourceExts } = defaultConfig.resolver;

config = {
  watchFolders: [monorepoRoot],
  transformer: {
    experimentalImportSupport: false,
    inlineRequires: true,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
			path.resolve(monorepoRoot, 'lib/ts/chat-react-core'),
    ],
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  }
}


module.exports = mergeConfig(defaultConfig, defaultExpoConfig, config);
