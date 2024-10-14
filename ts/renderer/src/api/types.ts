import { AvatarAssetsLod } from '@noice-com/schemas/avatar/avatar.pb';
import * as THREE from 'three';

import { RendererFlags, RendererProps } from 'renderer/data/types';

export interface GraphicsControllerProps {
  rendererProps: RendererProps;
  rendererFlags: RendererFlags;
}

export interface ArenaDescriptor {
  name: string;
  version: string;
  sceneUrl: string;
  lightmapUrl: string;
  environmentMapUrl: string;
}

export enum ArenaState {
  None,
  Game,
  Spotlight,
  Intermission,
}

export interface TransformData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export type AvatarData = {
  userId: string;
  groupId: string;
  slotIndex: number;
  url: string;
  lodUrls: string[];
  lods: AvatarAssetsLod[] | undefined;
  generatorVersion: string | undefined;
  temporaryFlag: string | undefined;
};
