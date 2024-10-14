module.exports = {
  presets: ['module:@react-native/babel-preset'],
	plugins: [
		'@babel/plugin-transform-export-namespace-from',
		[
			"module-resolver",
			{
				extensions: [
					'.js',
					'.jsx',
					'.ts',
					'.tsx',
					'.android.js',
					'.android.tsx',
					'.ios.js',
					'.ios.tsx'
				],
				alias: {
					'@gen': './gen',
					"@components": "./src/components",
					"@utils": "./src/utils",
					"@views": "./src/views",
					"@assets": "./src/assets",
					"@providers": "./src/providers",
					"@navigators": "./src/navigators",
					"@constants": "./src/constants",
					"@native": "./src/native",
					"@hooks": "./src/hooks",
					"@lib": "./src/lib"
				},
			}
		],
		'react-native-reanimated/plugin',
	]
};
