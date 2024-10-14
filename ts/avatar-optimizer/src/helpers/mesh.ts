import { getMeshes, isBone } from '@noice-com/avatar-builder/src/helpers';
import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

export function createVertexRemapping(
  oldVertexCount: number,
  keptVertexIndices: number[],
): [Map<number, number>, number[]] {
  const remapping: Map<number, number> = new Map<number, number>();
  const removedVertexIndices: number[] = [];
  let newIndex = 0;

  for (let i = 0; i < oldVertexCount; i++) {
    if (keptVertexIndices.includes(i)) {
      remapping.set(i, newIndex);
      newIndex++;
    } else {
      removedVertexIndices.push(i);
    }
  }

  return [remapping, removedVertexIndices];
}

export function trimIndexBuffer(
  buffer: THREE.BufferAttribute,
  oldVertexCount: number,
  hiddenVertices: number[],
): [buffer: Nullable<THREE.BufferAttribute>, removedVertices: number[]] {
  const newIndices: number[] = [];
  const keptVertexIndices: number[] = [];

  for (let i = 0; i < buffer.count; i += 3) {
    const a = buffer.getX(i),
      b = buffer.getX(i + 1),
      c = buffer.getX(i + 2);

    // Remove triangle only if all it's vertices are hidden
    if (
      hiddenVertices.includes(a) &&
      hiddenVertices.includes(b) &&
      hiddenVertices.includes(c)
    ) {
      continue;
    }

    if (!keptVertexIndices.includes(a)) {
      keptVertexIndices.push(a);
    }

    if (!keptVertexIndices.includes(b)) {
      keptVertexIndices.push(b);
    }

    if (!keptVertexIndices.includes(c)) {
      keptVertexIndices.push(c);
    }
  }

  const [vertexRemapping, removedVertexIndices] = createVertexRemapping(
    oldVertexCount,
    keptVertexIndices,
  );

  for (let i = 0; i < buffer.count; i += 3) {
    const a = buffer.getX(i),
      b = buffer.getX(i + 1),
      c = buffer.getX(i + 2);

    const newA = vertexRemapping.get(a),
      newB = vertexRemapping.get(b),
      newC = vertexRemapping.get(c);

    if (newA !== undefined && newB !== undefined && newC !== undefined) {
      newIndices.push(newA);
      newIndices.push(newB);
      newIndices.push(newC);
    }
  }

  const newBuffer: THREE.BufferAttribute = createBufferLike(buffer, newIndices.length);

  for (let i = 0; i < newIndices.length; i++) {
    newBuffer.setX(i, newIndices[i]);
  }

  return [newBuffer, removedVertexIndices];
}

export function trimBuffer(
  buffer: THREE.BufferAttribute,
  vertexIndices: number[],
): Nullable<THREE.BufferAttribute> {
  const newVertexCount = buffer.count - vertexIndices?.length;
  if (newVertexCount < 1) {
    return null;
  }

  const newBuffer = createBufferLike(buffer, newVertexCount);

  let newIndex = 0;

  for (let i = 0; i < buffer.count; i++) {
    if (!vertexIndices.includes(i)) {
      switch (newBuffer.itemSize) {
        case 4: {
          newBuffer.setXYZW(
            newIndex,
            buffer.getX(i),
            buffer.getY(i),
            buffer.getZ(i),
            buffer.getW(i),
          );
          break;
        }

        case 3: {
          newBuffer.setXYZ(newIndex, buffer.getX(i), buffer.getY(i), buffer.getZ(i));
          break;
        }

        case 2: {
          newBuffer.setXY(newIndex, buffer.getX(i), buffer.getY(i));
          break;
        }

        default: {
          newBuffer.setX(newIndex, buffer.getX(i));
          break;
        }
      }

      newIndex++;
    }
  }

  return newBuffer;
}

export function createBufferLike(
  buffer: THREE.BufferAttribute,
  numItems: number,
): THREE.BufferAttribute {
  if (buffer.array instanceof Uint8Array) {
    return new THREE.BufferAttribute(
      new Uint8Array(numItems * buffer.itemSize),
      buffer.itemSize,
      buffer.normalized,
    );
  } else if (buffer.array instanceof Uint16Array) {
    return new THREE.BufferAttribute(
      new Uint16Array(numItems * buffer.itemSize),
      buffer.itemSize,
      buffer.normalized,
    );
  } else if (buffer.array instanceof Float64Array) {
    return new THREE.BufferAttribute(
      new Float64Array(numItems * buffer.itemSize),
      buffer.itemSize,
      buffer.normalized,
    );
  }

  // Return Float32Array by default (todo: add other TypedArray when needed)
  return new THREE.BufferAttribute(
    new Float32Array(numItems * buffer.itemSize),
    buffer.itemSize,
    buffer.normalized,
  );
}

export function cleanBufferAttributes(mesh: THREE.Mesh, keptAttributes: string[]): void {
  if (!mesh || !mesh.geometry || !mesh.geometry.attributes) {
    return;
  }

  for (const attribute in mesh.geometry.attributes) {
    if (!keptAttributes.includes(attribute)) {
      mesh.geometry.deleteAttribute(attribute);
    }
  }
}

export function cleanAllBufferAttributes(
  obj: THREE.Group | THREE.Object3D,
  keptAttributes: string[],
): void {
  const meshes = getMeshes(obj);
  for (const mesh of meshes) {
    cleanBufferAttributes(mesh, keptAttributes);
  }
}

export function simplifyBoneHierarchy(
  root: THREE.Bone,
  keptBoneNames: string[],
): THREE.Bone[] {
  const objectsToRemove: THREE.Object3D[] = [];
  const keptBones: THREE.Bone[] = [];

  root.traverse((bone) => {
    if (!isBone(bone) || !keptBoneNames.includes(bone.name)) {
      objectsToRemove.push(bone);
    } else {
      keptBones.push(bone);
    }
  });

  for (const obj of objectsToRemove) {
    obj.removeFromParent();
  }

  return keptBones;
}
