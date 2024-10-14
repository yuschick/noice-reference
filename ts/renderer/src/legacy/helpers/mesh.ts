import * as THREE from 'three';

export function disposeSkinnedMesh(skinnedMesh: THREE.SkinnedMesh) {
  if (!skinnedMesh) {
    return;
  }

  skinnedMesh.skeleton?.dispose();

  disposeMesh(skinnedMesh);
}

export function disposeMesh(mesh: THREE.Mesh) {
  if (!mesh) {
    return;
  }

  mesh.geometry?.dispose();

  const material = mesh?.material;

  const materials =
    Array.isArray(material) === true
      ? (material as THREE.MeshStandardMaterial[])
      : [material as THREE.MeshStandardMaterial];

  for (const material of materials) {
    material.map?.dispose();
    material.lightMap?.dispose();
    material.aoMap?.dispose();
    material.emissiveMap?.dispose();
    material.bumpMap?.dispose();
    material.normalMap?.dispose();
    material.displacementMap?.dispose();
    material.roughnessMap?.dispose();
    material.metalnessMap?.dispose();
    material.alphaMap?.dispose();

    material.dispose();
  }
}

export function disposeObject(obj: THREE.Object3D) {
  if (obj?.parent) {
    obj.removeFromParent();
  }

  obj?.traverse((obj) => {
    if (obj instanceof THREE.SkinnedMesh === true) {
      disposeSkinnedMesh(obj as THREE.SkinnedMesh);
    } else if (obj instanceof THREE.Mesh === true) {
      disposeMesh(obj as THREE.Mesh);
    }
  });
}
