import { Nullable } from '@noice-com/utils';
import {
  NetInfoState,
  NetInfoSubscription,
  addEventListener as addNetInfoListener,
  fetch as fetchNetInfo,
} from '@react-native-community/netinfo';

export const customLinkConnectionRetryWait = async (retries: number) => {
  const netInfo = await fetchNetInfo();
  // When online, retry after 2, 4, 8, 16, 32, 64.... seconds
  if (netInfo.isConnected) {
    const time = Math.min(Math.pow(2, retries), 64) * 100;

    return await new Promise<void>((resolve) => setTimeout(resolve, time));
  }

  // When offline, wait for the user to come back online
  return await new Promise<void>((resolve) => {
    let unsubscribe: Nullable<NetInfoSubscription> = null;

    const connectionChangeListener = (listener: NetInfoState) => {
      if (!listener.isConnected) {
        return;
      }

      unsubscribe?.();
      resolve();
    };

    unsubscribe = addNetInfoListener(connectionChangeListener);
  });
};
