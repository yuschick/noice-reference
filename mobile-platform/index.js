/**
 * @format
 */
/* Polyfills | Note: needs to imported first */
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en'; // locale-data for en
import 'react-native-url-polyfill/auto' // polyfill for URL

import { AppRegistry } from 'react-native';
import 'react-native-random-uuid'
import analytics from '@react-native-firebase/analytics';
import { App } from './src/App';

// Default disable all firebase analytics events
analytics().setAnalyticsCollectionEnabled(false);

AppRegistry.registerComponent(`MobilePlatform`, () => App);
