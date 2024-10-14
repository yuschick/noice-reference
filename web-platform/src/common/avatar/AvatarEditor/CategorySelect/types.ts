import { SvgComponent } from '@noice-com/common-ui';

import { ExtendedAvatarPartCategory } from '../types';

export enum AvatarTab {
  Appearance = 'appearance',
  Outfit = 'outfit',
}

export enum FocusTarget {
  Hips = 'Hips',
  Head = 'Head01',
  Shoes = 'RightShinTwist01',
  Shirt = 'Spine_03',
}
export interface CameraSettings {
  target: FocusTarget;
  distance: number;
  minDistance: number;
  allowZoom: boolean;
}

export interface CategorySettings {
  type: ExtendedAvatarPartCategory;
  icon: SvgComponent;
  name: string;
  tab: AvatarTab;
  cameraSettings: CameraSettings;
}
