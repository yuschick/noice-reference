import { useMountEffect } from '@noice-com/common-react-core';
import {
  useAuthenticatedUser,
  useConversionEvents,
  useInitWalletAndListenWalletUpdates,
} from '@noice-com/common-ui';
import { useUpdateSocialCacheOnEvents } from '@noice-com/social';
import { useEffect } from 'react';

import * as Sentry from '../../../sentry';

import { useForceLogout, usePlatformBan } from './hooks';

import { useListenGoalCardSlotsUpdates } from '@common/goal-card';
import { useInitialRewardsFetch, useListenRewardClaimedUpdates } from '@common/placement';
import { useListenUsernameChangeNotificationUpdateCache } from '@common/profile';
import { useListenGiftNotificationUpdateCache } from '@common/send-gift-dialog';
import { useAppSounds } from '@common/sound';

export function PlatformAppAuthHooks() {
  const { userId } = useAuthenticatedUser();

  // Here we have hooks that update apollo cache on events
  useUpdateSocialCacheOnEvents();
  useInitWalletAndListenWalletUpdates();
  useListenGiftNotificationUpdateCache();
  useListenUsernameChangeNotificationUpdateCache();
  useInitialRewardsFetch();
  useListenRewardClaimedUpdates();
  useListenGoalCardSlotsUpdates();

  usePlatformBan();
  useAppSounds();
  useForceLogout();

  const { sendLoginConversionEvent } = useConversionEvents();

  useMountEffect(() => {
    sendLoginConversionEvent({ userId });
  });

  useEffect(() => {
    Sentry.setUserID(userId);

    return () => {
      Sentry.setUserID(null);
    };
  }, [userId]);

  return <></>;
}
