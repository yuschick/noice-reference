import { AvatarBuilder, Helpers } from '@noice-com/avatar-builder';

import { OptimizerSettings } from './types';

import { ChartOptions, PackOptions } from 'xatlas-three/types';

export const DefaultChartOptions: ChartOptions = {
  maxChartArea: 0.0,
  maxBoundaryLength: 0.0,
  normalDeviationWeight: 2.0,
  roundnessWeight: 0.01,
  straightnessWeight: 6.0,
  normalSeamWeight: 4.0,
  textureSeamWeight: 0.5,
  maxCost: 3,
  maxIterations: 1,
  useInputMeshUvs: true,
  fixWinding: false,
};

export const DefaultPackOptions: PackOptions = {
  maxChartSize: 0,
  padding: 2,
  texelsPerUnit: 0.0,
  resolution: 2048,
  bilinear: false,
  blockAlign: false,
  bruteForce: false,
  createImage: false,
  rotateCharts: false,
  rotateChartsToAxis: false,
};

export const DefaultUvScalingSettings: AvatarBuilder.UvScalingSettings = {
  body: 1.0,
  head: 4.0,
  parts: {
    eyebrows: 6.0,
    eyelashes: 6.0,
    eyes: 6.0,
    hair: 3.0,
    torso: 3.0,
    shoes: 1.5,
    legs: 1.5,
    teeth: 2.0,
    beard: 1.0,
  },
};

export const DefaultOptimizerSettings: OptimizerSettings = {
  bodySkinnedMeshName: 'body',
  removeUnwantedAttributes: true,
  wantedAttributes: [
    'position',
    'normal',
    'tangent',
    'uv',
    'uv2',
    'skinWeight',
    'skinIndex',
    'bodyPartMask',
  ],
  applyTextureAtlasing: true,
  atlasPackOptions: DefaultPackOptions,
  atlasChartOptions: DefaultChartOptions,
  atlasedMapTypes: [
    Helpers.MapType.BaseMap,
    Helpers.MapType.NormalMap,
    Helpers.MapType.AoMap,
  ],
  dilateTextureAtlas: true,
  useAoMapForMetalnessAndRoughness: true,
  mergeSkinnedMeshes: true,
  textureResolution: 2048,
  uvScalingSettings: DefaultUvScalingSettings,
  removeHiddenGeometry: false,
  addBodyPartMaskAttribute: false,
  removeTeeth: true,
};
