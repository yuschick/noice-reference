import { Observable } from '@noice-com/utils';
import * as THREE from 'three';

export interface Sandbox extends THREE.Scene {
  readonly activeCamera: Observable<THREE.PerspectiveCamera>;
  destruct(): void;

  resize?(width: number, height: number, renderScale: number): void;
  update(delta: number): void;
  removeLights(): void;
  createLights(): void;
}
