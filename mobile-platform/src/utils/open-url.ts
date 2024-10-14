import { makeLoggers } from '@noice-com/utils';
import { Alert, Linking } from 'react-native';

const { logInfo, logError } = makeLoggers('open-url');

/**
 * Open a URL in the system browser.
 * Handle errors and unsupported URLs without crashing the app.
 */
export const openURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      logInfo(`Cannot open URL: ${url}`);
    }
  } catch (error) {
    logError(`Error opening URL: ${url}`, error);
  }
};

export const promptOpenURL = (url: string) => () => {
  Alert.alert('Open in browser', 'This link will open in a new browser window.', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Open',
      onPress: () => {
        openURL(`https://${url}`);
      },
    },
  ]);
};
