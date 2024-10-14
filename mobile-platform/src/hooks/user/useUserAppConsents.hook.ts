import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

import { useMountEffect } from '@hooks/useMountEffect.hook';
import { UserConsent } from '@lib/UserConsent';
import TrackingPermissions, {
  IOSTrackingPermissionStatus,
} from '@native/IOSTrackingPermissions';
import { RootNavigatorParams } from '@navigators/routes';

type Props = {
  onComplete?: () => void;
};

export const useUserAppConsents = ({ onComplete }: Props) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParams>>();

  useMountEffect(() => {
    const handleConsent = async () => {
      const consent = await UserConsent.getUserConsentStatus();
      if (consent.status === 'not-collected') {
        await UserConsent.showUserConsentView();
      }

      // do navigation action last
      if (Platform.OS === 'ios') {
        const isTrackingAvailableOnOSVersion = await TrackingPermissions.isAvailable();
        const authStatus = await TrackingPermissions.getAuthorizationStatus();
        if (
          isTrackingAvailableOnOSVersion &&
          authStatus === IOSTrackingPermissionStatus.notDetermined
        ) {
          let resolver = (_?: unknown) => {};
          const completed = new Promise((resolve) => (resolver = resolve));
          navigation.navigate('userAdsTrackingPermission', {
            permissionsRequested: resolver,
          });
          await completed;
        }
      }

      onComplete?.();
    };

    handleConsent();
  });
};
