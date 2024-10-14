import { NativeModules } from 'react-native';

const { HomeIndicatorModule } = NativeModules;

interface IOSHomeIndicatorModule {
  setHomeIndicatorPreference(shouldHide: boolean): void;
}

export const IOSHomeIndicatorModule = HomeIndicatorModule as IOSHomeIndicatorModule;
