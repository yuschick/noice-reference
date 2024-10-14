import { makeLoggers } from '@noice-com/utils';
import { createNavigationContainerRef } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import {
  TabNavigatorTabParams,
  MainScreenNavigatorParams,
  RootNavigatorParams,
} from '@navigators/routes';

const { logWarn } = makeLoggers('deepNavigate');

export const navigationRef = createNavigationContainerRef<RootNavigatorParams>();

export function deepNavigate<
  Route extends keyof MainScreenNavigatorParams &
    TabNavigatorTabParams = keyof MainScreenNavigatorParams & TabNavigatorTabParams,
>(routeName: Route, params?: (MainScreenNavigatorParams & TabNavigatorTabParams)[Route]) {
  if (navigationRef.isReady()) {
    // @ts-expect-error: For some reason the type is turning into a conditional that defaults to undefined.
    navigationRef.current?.navigate(routeName, params);
  } else {
    logWarn(
      `Tried deep linking to ${routeName} with params ${JSON.stringify(
        params,
      )} but navigationRef is not ready.`,
    );
  }
}

export const useOptions = (): NativeStackNavigationOptions => {
  return navigationRef.current?.getCurrentOptions() ?? {};
};
