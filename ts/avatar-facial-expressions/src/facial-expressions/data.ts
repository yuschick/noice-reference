import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { BlendShapeData, BlendShapeAtlasData } from './types';

export async function downloadBlendShapeData(
  exrLoader: EXRLoader,
  url = 'https://client-assets-cdn.gcp.dev.noice.com/proto/noice-avatars/blendshape-textures-0.0.0.1/CheekPuff_PXR24.exr',
): Promise<BlendShapeData | undefined> {
  if (!exrLoader || !url) {
    return undefined;
  }

  const response = await fetch(url.replace('.exr', '.json'));
  if (!response.ok) {
    return undefined;
  }

  const dataSrc: BlendShapeAtlasData = await response.json();
  if (!dataSrc) {
    return undefined;
  }

  const dataTex = await exrLoader.loadAsync(url);
  if (!dataTex) {
    return undefined;
  }

  dataTex.minFilter = THREE.NearestFilter;
  dataTex.magFilter = THREE.NearestFilter;
  dataTex.generateMipmaps = false;

  return {
    texture: dataTex,
    atlas: dataSrc,
  };
}
