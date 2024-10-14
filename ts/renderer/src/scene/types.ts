import * as THREE from 'three';

export enum CameraMode {
  Game,
  Spotlight,
  SpotlightTransitionIn,
  SpotlightTransitionOut,
  Intermission,
}

export enum ProfileColor {
  // eslint-disable-next-line
  COLOR_UNSPECIFIED = 'COLOR_UNSPECIFIED',
  // eslint-disable-next-line
  COLOR_F69856 = '#F69856',
  // eslint-disable-next-line
  COLOR_F6CE56 = '#F6CE56',
  // eslint-disable-next-line
  COLOR_F6F656 = '#F6F656',
  // eslint-disable-next-line
  COLOR_63F655 = '#63F655',
  // eslint-disable-next-line
  COLOR_56F6C0 = '#56F6C0',
  // eslint-disable-next-line
  COLOR_6EC9F7 = '#6EC9F7',
  // eslint-disable-next-line
  COLOR_8686F9 = '#8686F9',
  // eslint-disable-next-line
  COLOR_B26AFB = '#B26AFB',
  // eslint-disable-next-line
  COLOR_F76EF7 = '#F76EF7',
  // eslint-disable-next-line
  COLOR_C0F656 = '#C0F656',
}

export interface CameraDescriptor {
  camera: THREE.PerspectiveCamera;
  cameraMode: CameraMode;
  clip: THREE.AnimationClip;
}
