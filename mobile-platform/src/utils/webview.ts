import { MobileDeviceMetadata } from '@noice-com/webview-bridge';
import { Platform } from 'react-native';
import { getBuildNumber, getModel, getVersion } from 'react-native-device-info';

export const INJECT_JS_NO_ZOOM_META_DATA = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  meta.setAttribute('name', 'viewport'); 
  document.getElementsByTagName('head')[0].appendChild(meta); 
`;

export const INJECT_JS_DISABLE_USER_SELECT = `
  const style = document.createElement('style');
  style.innerHTML = 'body { -webkit-user-select: none; }';
  document.getElementsByTagName('head')[0].appendChild(style); 
`;

export const INJECT_JS_ALL_MODIFICATIONS = `
${INJECT_JS_NO_ZOOM_META_DATA}
${INJECT_JS_DISABLE_USER_SELECT}
`;

export const webviewMetaData: MobileDeviceMetadata = {
  osName: Platform.OS,
  buildNumber: getBuildNumber(),
  version: getVersion(),
  deviceModel: getModel(),
};
