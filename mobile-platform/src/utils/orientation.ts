import Orientation, { OrientationType } from 'react-native-orientation-locker';

export const getDeviceOrientation = async () => {
  return new Promise<OrientationType>((resolve) => {
    Orientation.getDeviceOrientation((orientation) => resolve(orientation));
  });
};

export const getVirtualOrientation = async () => {
  return new Promise<OrientationType>((resolve) => {
    Orientation.getOrientation((orientation) => resolve(orientation));
  });
};
