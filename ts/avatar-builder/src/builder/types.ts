import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export enum AvatarPartType {
  Hair = 'hair',
  HeadItem = 'headItem',
  FaceItem = 'faceItem',
  Torso = 'torso',
  Hands = 'hands',
  Legs = 'legs',
  Shoes = 'shoes',
  Eyes = 'eyes',
  Eyelashes = 'eyelashes',
  Eyebrows = 'eyebrows',
  Teeth = 'teeth',
  Beard = 'beard',
}

export interface ColorProps {
  color?: string;
  lutUrl?: string;
  maskedColors?: string[];
}

export interface SkinProps {
  baseMapUrl: string;
  normalMapUrl: string;
  ormMapUrl: string;
  emissionMapUrl?: string;
}

export interface AvatarConfig {
  bodyUrl: string;
  headUrl: string;
  skinColor: ColorProps;
  partUrls: Partial<Record<AvatarPartType, string>>;
  partColors: Partial<Record<AvatarPartType, ColorProps>>;
  partSkins: Partial<Record<AvatarPartType, SkinProps>>;
}

export interface BuilderSettings {
  outputName: string;
  rootBoneName: string;
  neckBoneName: string;
  stitchHeadToBody: boolean;
  averageNeckVertexPositions: boolean;
  processNeckVertexNormalsAndTangents: boolean;
  averageNeckVertexNormalsAndTangents: boolean;
  intelligentHeadBodySeamSkinning: boolean;
  removeDeformationUvs: boolean;
  serializeShoeOffset: boolean;
  applyShoeOffset: boolean;
  deformNormalsAndTangents: boolean;
  smoothFaceItemDeformations: boolean;
}

export interface BodyComposition {
  avatarRoot: THREE.Group;
  skeletonRoot: THREE.Object3D;
  skeleton: THREE.Skeleton;
  bodyBoneCount: number;
  neckOffset: THREE.Vector3;
  bodySkinnedMesh: THREE.SkinnedMesh;
  headSkinnedMesh: THREE.SkinnedMesh;
  parts: Partial<Record<AvatarPartType, THREE.SkinnedMesh>>;
  bodyPosDeformationTex: THREE.DataTexture;
  bodyNATDeformationTex?: THREE.DataTexture;
  headPosDeformationTex: THREE.DataTexture;
  headPosSmoothDeformationTex?: THREE.DataTexture;
  headNATDeformationTex?: THREE.DataTexture;
}

export interface SourceAsset {
  gltf: GLTF;
  skinnedMesh: THREE.SkinnedMesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  rootBone: THREE.Bone;
}

export interface UvScalingSettings {
  body?: number;
  head?: number;
  parts: Partial<Record<AvatarPartType, number>>;
}
