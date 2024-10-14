import { AvatarBuilder, Helpers } from '@noice-com/avatar-builder';

import { ChartOptions, PackOptions } from 'xatlas-three/types';

export interface OptimizerSettings {
  bodySkinnedMeshName: string;
  removeUnwantedAttributes?: boolean;
  wantedAttributes?: string[];
  applyTextureAtlasing?: boolean;
  atlasChartOptions?: ChartOptions;
  atlasPackOptions?: PackOptions;
  atlasedMapTypes?: Helpers.MapType[];
  dilateTextureAtlas?: boolean;
  useAoMapForMetalnessAndRoughness?: boolean;
  mergeSkinnedMeshes?: boolean;
  textureResolution: number;
  uvScalingSettings: AvatarBuilder.UvScalingSettings;
  removeHiddenGeometry?: boolean;
  addBodyPartMaskAttribute: boolean;
  removeTeeth: boolean;
}

export const MeshNameToInt: Map<string, number> = new Map<string, number>([
  ['body', 1],
  ['head', 2],
  ['hair', 3],
  ['headItem', 4],
  ['faceItem', 5],
  ['torso', 6],
  ['hands', 7],
  ['legs', 8],
  ['shoes', 9],
  ['eyes', 10],
  ['eyelashes', 11],
  ['eyebrows', 12],
  ['teeth', 13],
  ['beard', 14],
]);
