import { Nullable } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getVersion } from 'react-native-device-info';

import { AuthenticatedNavigationHookProps } from '@navigators/routes';
type Response = {
  results: {
    version: string;
    released: string;
    trackViewUrl: string;
    artistViewUrl: string;
    sellerUrl: string;
  }[];
};

type ReturnType = Promise<{ version: string | null; url: string | null }>;

const VERSION_URL =
  'https://itunes.apple.com/lookup?lang=en&bundleId=com.noice.MobilePlatform&country=us';

const getIosVersion = async (): ReturnType => {
  try {
    const data = (await (await fetch(VERSION_URL)).json()) as Response;
    if (!data) {
      throw new Error('Could not fetch data from iTunes.');
    }

    if (!data.results.length) {
      throw new Error('No results found for bundle ID.');
    }

    const { version, trackViewUrl, artistViewUrl, sellerUrl } = data.results[0];

    return {
      version: version || null,
      url: trackViewUrl || artistViewUrl || sellerUrl || null,
    };
  } catch (error) {
    return { version: null, url: null };
  }
};

const isVersionLessThan = (v1: string | null, v2: string | null) => {
  if (!v1 || !v2) {
    return false;
  }
  const v1Parts = v1.split('.').map((part) => parseInt(part, 10));
  const v2Parts = v2.split('.').map((part) => parseInt(part, 10));

  for (let i = 0; i < v1Parts.length; i++) {
    if (v1Parts[i] < v2Parts[i]) {
      return true;
    }
  }

  return false;
};

// @todo - Currently only supports iOS, needs Android implementation
export const useVersionCheck = () => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  useEffect(() => {
    const fetchVersion = async () => {
      const appVersion = getVersion();
      // ensure version number comparison is only done on semver format
      const currentVersion = appVersion.match(/\d+\.\d+\.\d+/)?.[0] ?? null;
      const { version } = await getIosVersion();

      if (!__DEV__ && isVersionLessThan(currentVersion, version)) {
        setShouldUpdate(true);
      }
    };

    fetchVersion();
  }, []);

  useEffect(() => {
    let timeoutId: Nullable<number> = null;

    if (shouldUpdate) {
      timeoutId = setTimeout(() => {
        navigation.navigate('newVersionAvailableModal');
      }, 2500); // 2.5 seconds delay
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigation, shouldUpdate]);

  return { shouldUpdate };
};
