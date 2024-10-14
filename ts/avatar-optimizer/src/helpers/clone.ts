import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const deepClone = async (
  obj: THREE.Object3D,
  binary = true,
): Promise<THREE.Group<THREE.Object3DEventMap>> => {
  const gltfLoader = new GLTFLoader();
  const gltfExporter = new GLTFExporter();

  const serialized = await gltfExporter.parseAsync(obj.children, {
    binary: binary,
  });

  const root = await gltfLoader.parseAsync(
    serialized instanceof ArrayBuffer ? serialized : JSON.stringify(serialized),
    '',
  );

  root.scene.name = obj.name;

  return root.scene;
};
