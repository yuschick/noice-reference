import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

const { logInfo } = makeLoggers('MeshUtilities');

export function isMesh(obj: THREE.Object3D): obj is THREE.SkinnedMesh {
  return obj.type === 'Mesh';
}

export function isSkinnedMesh(obj: THREE.Object3D): obj is THREE.SkinnedMesh {
  return obj.type === 'SkinnedMesh';
}

export function isBone(obj: THREE.Object3D): obj is THREE.Bone {
  return obj.type === 'Bone';
}

export function getFirstSkinnedMesh(
  group: THREE.Group | THREE.Object3D,
): Nullable<THREE.SkinnedMesh> {
  for (const obj of group.children) {
    if (isSkinnedMesh(obj)) {
      return obj;
    }
  }

  return null;
}

export function getSkinnedMeshes(obj: THREE.Object3D): THREE.SkinnedMesh[] {
  const skinnedMeshes: THREE.SkinnedMesh[] = [];
  obj.traverse((obj) => {
    if (isSkinnedMesh(obj)) {
      skinnedMeshes.push(obj);
    }
  });
  return skinnedMeshes;
}

export function getMeshes(obj: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  obj.traverse((obj) => {
    if (isMesh(obj)) {
      meshes.push(obj);
    }
  });
  return meshes;
}

export function getFirstChildBone(
  group: THREE.Group | THREE.Object3D,
): Nullable<THREE.Bone> {
  for (const obj of group.children) {
    if (isBone(obj)) {
      return obj;
    }
  }

  return null;
}

export function findSkeletonBoneIndex(
  skeleton: THREE.Skeleton,
  bone: THREE.Bone,
): number {
  const bones = skeleton.bones;

  for (let i = 0; i < bones.length; i++) {
    if (bones[i] === bone) {
      return i;
    }
  }

  return -1;
}

export function findSkeletonBoneIndexByName(
  skeleton: THREE.Skeleton,
  boneName: string,
): number {
  const bones = skeleton.bones;

  for (let i = 0; i < bones.length; i++) {
    if (bones[i].name === boneName) {
      return i;
    }
  }

  return -1;
}

export function findSkinnedMeshByGeometryName(
  skinnedMeshes: THREE.SkinnedMesh[],
  uuid: string,
): Nullable<THREE.SkinnedMesh> {
  for (const skinnedMesh of skinnedMeshes) {
    if (skinnedMesh.geometry.uuid === uuid) {
      return skinnedMesh;
    }
  }

  return null;
}

export function getBufferAttributeOrThrowError(
  geometry: THREE.BufferGeometry,
  attribute: string,
): THREE.BufferAttribute {
  const bufferAttribute = geometry.getAttribute(attribute) as THREE.BufferAttribute;
  if (!bufferAttribute) {
    throw new Error(`Geometry did not contain ${attribute} attribute`);
  }
  return bufferAttribute;
}

export function disposeSkinnedMesh(skinnedMesh: THREE.SkinnedMesh) {
  skinnedMesh.skeleton.dispose();

  disposeMesh(skinnedMesh);
}

export function disposeMesh(mesh: THREE.Mesh) {
  mesh.geometry.dispose();

  const material = mesh.material;

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

export function normalize(buf: THREE.BufferAttribute) {
  for (let i = 0; i < buf.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(buf, i);

    v.normalize();
    buf.setXYZ(i, v.x, v.y, v.z);
  }
}

export function scaleMeshGeometry(mesh: THREE.Mesh, scale: number) {
  const positions = getBufferAttributeOrThrowError(mesh.geometry, 'position');
  const vertexCount = positions.count;

  for (let i = 0; i < vertexCount; i++) {
    positions.setXYZ(
      i,
      positions.getX(i) * scale,
      positions.getY(i) * scale,
      positions.getZ(i) * scale,
    );
  }
}

export function getBoneNameToIndexMapping(skeleton: THREE.Skeleton): Map<string, number> {
  const bones = skeleton?.bones;
  const mapping = new Map<string, number>();

  for (let i = 0; i < bones?.length; i++) {
    mapping.set(bones[i].name, i);
  }

  return mapping;
}

export function getBoneIndexToNameMapping(skeleton: THREE.Skeleton): Map<number, string> {
  const bones = skeleton?.bones;
  const mapping = new Map<number, string>();

  for (let i = 0; i < bones?.length; i++) {
    mapping.set(i, bones[i].name);
  }

  return mapping;
}

export function logUsedBones(
  skeleton: THREE.Skeleton,
  skinAttribute: THREE.BufferAttribute,
  weightsAttribute: THREE.BufferAttribute,
) {
  const boneRefs = new Map<number, number>();
  const boneWeights = new Map<number, number>();

  for (let i = 0; i < skinAttribute.count; i++) {
    const x = skinAttribute.getX(i);
    const xw = weightsAttribute.getX(i);

    if (x >= 0 && xw > 0) {
      boneRefs.set(x, (boneRefs.get(x) || 0) + 1);
      boneWeights.set(x, (boneWeights.get(x) || 0) + xw);
    }

    const y = skinAttribute.getY(i);
    const yw = weightsAttribute.getY(i);

    if (y >= 0 && yw > 0) {
      boneRefs.set(y, (boneRefs.get(y) || 0) + 1);
      boneWeights.set(y, (boneWeights.get(y) || 0) + yw);
    }

    const z = skinAttribute.getZ(i);
    const zw = weightsAttribute.getZ(i);

    if (z >= 0 && zw > 0) {
      boneRefs.set(z, (boneRefs.get(z) || 0) + 1);
      boneWeights.set(z, (boneWeights.get(z) || 0) + zw);
    }

    const w = skinAttribute.getW(i);
    const ww = weightsAttribute.getW(i);

    if (w >= 0 && ww > 0) {
      boneRefs.set(w, (boneRefs.get(w) || 0) + 1);
      boneWeights.set(w, (boneWeights.get(w) || 0) + ww);
    }
  }

  // Houdini generated index buffers might have float indices, validate
  for (const [index, references] of boneRefs) {
    if (
      index >= 0 &&
      index < skeleton.bones.length &&
      Math.abs(index - Math.round(index)) < Number.EPSILON
    ) {
      const bone = skeleton.bones[index];
      logInfo(`bone ${index} = ${bone?.name} (vertex references ${references})`);
      // average weight ${((boneWeights.get(index) || 0) / (boneRefs.get(index) || 1)) * 100.0}%
    } else {
      logInfo(`no bone for ${index} in skeleton (vertex references ${references})`);
    }
  }
}

export function logBones(skeleton: THREE.Skeleton) {
  for (let i = 0; i < skeleton.bones.length; i++) {
    const bone = skeleton.bones[i];
    logInfo(`bone ${i} = ${bone.name}`);
  }
}

export function removeBlendShapes(mesh: THREE.SkinnedMesh) {
  mesh.morphTargetInfluences = undefined;
  mesh.morphTargetDictionary = undefined;

  mesh.geometry.morphAttributes = {};
  mesh.geometry.morphTargetsRelative = false;

  mesh.updateMorphTargets();
}

export function offsetVertices(skinnedMesh: THREE.SkinnedMesh, offset: THREE.Vector3) {
  const positions = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'position');

  for (let i = 0; i < positions.count; i++) {
    positions.setX(i, positions.getX(i) - offset.x);
    positions.setY(i, positions.getY(i) - offset.y);
    positions.setZ(i, positions.getZ(i) - offset.z);
  }
}
