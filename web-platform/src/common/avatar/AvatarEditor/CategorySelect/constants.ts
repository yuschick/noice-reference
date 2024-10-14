import { CoreAssets } from '@noice-com/assets-core';
import { AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';

import { LocalCategories } from '../types';

import { AvatarTab, CategorySettings, FocusTarget } from './types';
export const categories: CategorySettings[] = [
  {
    type: AvatarPartCategory.CATEGORY_BODY,
    icon: CoreAssets.Icons.BodyType,
    name: 'Body type',
    tab: AvatarTab.Appearance,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 4.5,
      target: FocusTarget.Hips,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_HAIR,
    icon: CoreAssets.Icons.Hair,
    name: 'Hair',
    tab: AvatarTab.Appearance,
    cameraSettings: {
      allowZoom: true,
      distance: 2.1,
      minDistance: 2.1,
      target: FocusTarget.Head,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_EYELASHES,
    icon: CoreAssets.Icons.EyeLash,
    name: 'Eyelashes',
    tab: AvatarTab.Appearance,
    cameraSettings: {
      allowZoom: true,
      distance: 2.1,
      minDistance: 2.1,
      target: FocusTarget.Head,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_EYEBROWS,
    icon: CoreAssets.Icons.EyeBrows,
    name: 'Eyebrows',
    tab: AvatarTab.Appearance,
    cameraSettings: {
      allowZoom: true,
      distance: 2.1,
      minDistance: 2.1,
      target: FocusTarget.Head,
    },
  },
  {
    type: LocalCategories.CATEGORY_OUTFIT,
    icon: CoreAssets.Icons.Outfit,
    name: 'Outfits',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 4.5,
      target: FocusTarget.Hips,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_HEAD_ITEM,
    icon: CoreAssets.Icons.Hat,
    name: 'Hats',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 2.1,
      minDistance: 2.1,
      target: FocusTarget.Head,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_FACE_ITEM,
    icon: CoreAssets.Icons.Glasses,
    name: 'Glasses',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 2.1,
      minDistance: 2.1,
      target: FocusTarget.Head,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_TORSO,
    icon: CoreAssets.Icons.Shirt,
    name: 'Shirts',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 2.75,
      target: FocusTarget.Shirt,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_HANDS,
    icon: CoreAssets.Icons.Gloves,
    name: 'Gloves',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 2.75,
      target: FocusTarget.Hips,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_LEGS,
    icon: CoreAssets.Icons.Pants,
    name: 'Pants',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 2.75,
      target: FocusTarget.Hips,
    },
  },
  {
    type: AvatarPartCategory.CATEGORY_SHOES,
    icon: CoreAssets.Icons.Shoes,
    name: 'Shoes',
    tab: AvatarTab.Outfit,
    cameraSettings: {
      allowZoom: true,
      distance: 6.0,
      minDistance: 2.75,
      target: FocusTarget.Shoes,
    },
  },
];
