import * as THREE from 'three';

export enum BlendShape {
  BrowInnerLeft = 0,
  BrowInnerRight,
  BrowOuterLeft,
  BrowOuterRight,
  BrowsFrown,
  CheekPuff,
  CheekSquintLeft,
  CheekSquintRight,
  EyeBlinkLeft,
  EyeBlinkRight,
  EyeSquintLeft,
  EyeSquintRight,
  EveWideLeft,
  EyeWideRight,
  JawDownClosed,
  JawDownOpen,
  JawForwardClosed,
  JawForwardOpen,
  JawLeftClosed,
  JawLeftOpen,
  JawRightClosed,
  JawRightOpen,
  JawUpClosed,
  JawUpOpen,
  LowerLipShrugOpen,
  MouthClose,
  MouthDimpleLeft,
  MouthDimpleRight,
  MouthFunnel,
  MouthHorizontal,
  MouthLeftDown,
  MouthLeftUp,
  MouthLowerDownLeft,
  MouthLowerDownRight,
  MouthRightDown,
  MouthRightUp,
  MouthRoll,
  MouthSharpLeft,
  MouthSharpRight,
  MouthUpperUpLeft,
  MouthUpperUpRight,
  MouthVertical,
  NoseNostrilLeft,
  NoseNostrilRight,
  NoseSneerLeft,
  NoseSneerRight,
  UpperLipShrugOpen,
}

export interface BlendShapeAtlasItem {
  name: string;
  index: number;
}

export interface BlendShapeAtlasData {
  columns: number;
  items: BlendShapeAtlasItem[];
}

export interface BlendShapeData {
  texture: THREE.DataTexture;
  atlas: BlendShapeAtlasData;
}
