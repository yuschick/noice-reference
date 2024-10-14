import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type GltfGraphElementCallback = (
  object: THREE.Object3D,
  parent: THREE.Object3D | null,
) => void;

export class GltfGraph {
  private _gltf: GLTF;

  constructor(gltf: GLTF) {
    this._gltf = gltf;
  }

  private _traverseHierarchyRecursiveDown(
    object: THREE.Object3D,
    parent: THREE.Object3D | null,
    callback: GltfGraphElementCallback,
  ) {
    callback(object, parent);

    const childCount = object.children.length;
    for (let i = 0; i < childCount; i++) {
      const child = object.children[i];
      this._traverseHierarchyRecursiveDown(child, object, callback);
    }
  }

  public traverseGraphDown(
    callback: GltfGraphElementCallback,
    startNode?: THREE.Object3D,
  ) {
    if (!startNode) {
      startNode = this._gltf.scene;
    }

    this._traverseHierarchyRecursiveDown(startNode, null, callback);
  }
}
