import { NativeModules } from 'react-native';

const { TrackingPermissions } = NativeModules;

export const IOSTrackingPermissionStatus = {
  notDetermined: 0,
  statusRestricted: 1,
  statusDenied: 2,
  statusAuthorized: 3,
} as const;

export type IOSTrackingPermissionStatus =
  (typeof IOSTrackingPermissionStatus)[keyof typeof IOSTrackingPermissionStatus];

interface IOSTrackingPermissions {
  askATTPermissions: () => Promise<IOSTrackingPermissionStatus>;
  isAvailable: () => Promise<boolean>;
  getAuthorizationStatus: () => Promise<IOSTrackingPermissionStatus>;
}

export default TrackingPermissions as IOSTrackingPermissions;
