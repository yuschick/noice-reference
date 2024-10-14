import * as THREE from 'three';

export interface Emoji extends THREE.Object3D {
  isLoaded: boolean;
  isAlive: boolean;

  emit(): void;
  update(): void;

  destruct(): void;
}
