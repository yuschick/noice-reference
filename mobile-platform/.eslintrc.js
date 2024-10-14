module.exports = {
	root: true,
	env: {
		es2021: true,
	},
	extends: [
		'@react-native',
		'@noice-com/react', // This must be last to override the others!
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		}
	},
	plugins: [
		"react-native",
		"jest"
	],
	settings: {
		react: {
			version: "detect"
		},
	},
	rules: {
    "react-native/no-unused-styles": 2,
	  "react-native/no-raw-text": [
			2,
			{
				skip: [
					"GradientText",
					"CheckBox",
					"ButtonLarge",
					"Typography",
					"ContextMenu.ItemTitle"
				],
			}
		],
		"react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 2,
    "react-native/no-single-element-style-arrays": 2,
    "react-native/split-platform-components": 2,
		"@typescript-eslint/no-non-null-assertion": 1,
		'react/prop-types': [
			1,
			{
				ignore: ['navigation', 'route'],
			},
		]
  },
	ignorePatterns: [
		"ios/Pods/**",
	]
};
