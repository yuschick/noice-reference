import { makeLoggers } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { AlertModal } from '@components/Modal/AlertModal';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import IOSTrackingPermissions, {
  IOSTrackingPermissionStatus,
} from '@native/IOSTrackingPermissions';

const { logInfo, logError } = makeLoggers('Test ad view');

export const TestAdView = () => {
  const [showTrackingPrompt, setShowTrackingPrompt] = useState(false);

  const askUserForTracking = () => {
    setShowTrackingPrompt(true);
  };

  const onContinueAskUserForTracking = () => {
    setShowTrackingPrompt(false);
    // TODO prompt
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    IOSTrackingPermissions.isAvailable()
      .then((res) => logInfo('is availble', res))
      .catch((err) => logError(err));

    IOSTrackingPermissions.getAuthorizationStatus()
      .then((res) => {
        if (res === IOSTrackingPermissionStatus.notDetermined) {
          logInfo('Not determined yet prompt user to accept ATT');
        }

        logInfo('Status', res);
        return;
      })
      .catch((err) => logError(err));
  }, []);

  return (
    <PageLayout>
      <Typography>Show rewarded video</Typography>
      <Gutter height={16} />
      <ButtonLarge onPress={askUserForTracking}>Ask user for tracking</ButtonLarge>
      <AlertModal
        action={{
          label: 'Continue',
          onPress: onContinueAskUserForTracking,
        }}
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempor libero ut sem molestie, ac lobortis purus consequat. Sed molestie hendrerit massa, sed placerat nulla convallis ac. Aliquam luctus metus vitae faucibus fermentum. Maecenas vitae sem quis lectus tincidunt ornare sit amet eget ex. Mauris justo dui, ornare sed rhoncus a, pulvinar eu risus. Quisque sit amet feugiat felis. Sed facilisis eu ante vel volutpat. Curabitur sem mauris, condimentum ac porttitor nec, cursus a est. Aliquam porta ipsum id orci placerat, ac blandit neque vehicula."
        title="Sharing data with Noice"
        visible={showTrackingPrompt}
      />
      <ButtonLarge
        onPress={() =>
          Platform.OS === 'ios' && IOSTrackingPermissions.askATTPermissions()
        }
      >
        Native tracking prompt
      </ButtonLarge>
    </PageLayout>
  );
};
