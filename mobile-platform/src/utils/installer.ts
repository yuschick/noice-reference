import { getBundleId, getInstallerPackageNameSync } from 'react-native-device-info';

// Installers are not typed in react-native-device-info
// Play Store: "com.android.vending"
// Amazon: "com.amazon.venezia"
// Samsung App Store: "com.sec.android.app.samsungapps"
export const isTestFlightInstall = () => getInstallerPackageNameSync() === 'TestFlight';
export const isStoreInstall = () => {
  switch (getInstallerPackageNameSync()) {
    case 'com.android.vending':
    case 'AppStore':
    case 'com.amazon.venezia':
    case 'com.sec.android.app.samsungapps':
      return true;
    default:
      return false;
  }
};

export const bundleIdToEnvironment = () => {
  const bundleId = getBundleId();
  switch (bundleId) {
    case 'com.noice.MobilePlatform':
      return 'prod';
    case 'com.noice.MobilePlatform.stg':
    default:
      return 'staging';
  }
};
