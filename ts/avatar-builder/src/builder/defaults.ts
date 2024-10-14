import { BuilderSettings } from './types';

export const AVERAGE_MESH_HIP_Y_POSITION = 0.931943;

export const DefaultBuilderSettings: BuilderSettings = {
  outputName: 'Avatar',
  rootBoneName: 'Root',
  neckBoneName: 'Neck02',
  stitchHeadToBody: true,
  averageNeckVertexPositions: true,
  processNeckVertexNormalsAndTangents: true,
  averageNeckVertexNormalsAndTangents: true,
  intelligentHeadBodySeamSkinning: true,
  removeDeformationUvs: true,
  serializeShoeOffset: false,
  applyShoeOffset: false,
  deformNormalsAndTangents: false,
  smoothFaceItemDeformations: false,
};
