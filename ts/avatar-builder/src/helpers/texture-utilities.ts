import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

export enum MapType {
  BaseMap = 1,
  NormalMap = 2,
  AoMap = 3,
  RoughnessMap = 4,
  MetalnessMap = 5,
  LightMap = 6,
  EmissiveMap = 7,
  BumpMap = 8,
  AlphaMap = 9,
  EnvMap = 10,
  DisplacementMap = 11,
}

export function getTexture(
  material: THREE.MeshStandardMaterial,
  mapType: MapType,
): Nullable<THREE.Texture> {
  switch (mapType) {
    case MapType.BaseMap:
      return material.map;

    case MapType.NormalMap:
      return material.normalMap;

    case MapType.AoMap:
      return material.aoMap;

    case MapType.MetalnessMap:
      return material.metalnessMap;

    case MapType.RoughnessMap:
      return material.roughnessMap;

    case MapType.LightMap:
      return material.lightMap;

    case MapType.EmissiveMap:
      return material.emissiveMap;

    case MapType.BumpMap:
      return material.bumpMap;

    case MapType.AlphaMap:
      return material.alphaMap;

    case MapType.EnvMap:
      return material.envMap;

    case MapType.DisplacementMap:
      return material.displacementMap;

    default:
      return null;
  }
}

export function setTexture(
  material: THREE.MeshStandardMaterial,
  mapType: MapType,
  texture: THREE.Texture,
): void {
  switch (mapType) {
    case MapType.BaseMap:
      material.map = texture;
      break;

    case MapType.NormalMap:
      material.normalMap = texture;
      break;

    case MapType.AoMap:
      material.aoMap = texture;
      break;

    case MapType.MetalnessMap:
      material.metalnessMap = texture;
      break;

    case MapType.RoughnessMap:
      material.roughnessMap = texture;
      break;

    case MapType.LightMap:
      material.lightMap = texture;
      break;

    case MapType.EmissiveMap:
      material.emissiveMap = texture;
      break;

    case MapType.BumpMap:
      material.bumpMap = texture;
      break;

    case MapType.AlphaMap:
      material.alphaMap = texture;
      break;

    case MapType.EnvMap:
      material.envMap = texture;
      break;

    case MapType.DisplacementMap:
      material.displacementMap = texture;
      break;
  }
}

export function decodeFloat16(binary: number) {
  const exponent = (binary & 0x7c00) >> 10,
    fraction = binary & 0x03ff;

  return (
    (binary >> 15 ? -1 : 1) *
    (exponent
      ? exponent === 0x1f
        ? fraction
          ? NaN
          : Infinity
        : Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
      : 6.103515625e-5 * (fraction / 0x400))
  );
}

export function sampleExr(tex: THREE.DataTexture, uv: THREE.Vector2): THREE.Vector4 {
  const data = tex.image.data;
  const result = new THREE.Vector4();
  const width = tex.image.width;
  const x = Math.round(
    Math.max(Math.min(tex.image.width - 1, uv.x * tex.image.width), 0),
  );
  const y = Math.round(
    Math.max(Math.min(tex.image.height - 1, uv.y * tex.image.height), 0),
  );
  const startOffset = (y * width + x) * 4;
  result.x = decodeFloat16(data[startOffset]);
  result.y = decodeFloat16(data[startOffset + 1]);
  result.z = decodeFloat16(data[startOffset + 2]);
  result.w = decodeFloat16(data[startOffset + 3]);
  return result;
}

export function getDefaultMapURL(
  skinnedMesh: THREE.SkinnedMesh,
  type: MapType.BaseMap | MapType.NormalMap | MapType.AoMap | MapType.EmissiveMap,
): string {
  switch (type) {
    case MapType.BaseMap:
      return `${skinnedMesh.name}-${skinnedMesh.id}-default-baseMap`;
    case MapType.NormalMap:
      return `${skinnedMesh.name}-${skinnedMesh.id}-default-normalMap`;
    case MapType.AoMap:
      return `${skinnedMesh.name}-${skinnedMesh.id}-default-ormMap`;
    case MapType.EmissiveMap:
      `${skinnedMesh.name}-${skinnedMesh.id}-default-emissionMap`;
  }
  return '';
}
