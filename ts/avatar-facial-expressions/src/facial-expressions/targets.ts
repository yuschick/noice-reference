import * as THREE from 'three';

import { BlendShape } from './types';

export function createBlendShapeTargets(avatar: THREE.Object3D) {
  if (!avatar) {
    return;
  }

  const root = avatar.getObjectByName('Root');
  if (!root) {
    return;
  }

  if (root.getObjectByName('Blendshapes')) {
    return;
  }

  const blendShapeGroup = new THREE.Group();
  blendShapeGroup.name = 'Blendshapes';
  blendShapeGroup.matrixAutoUpdate = false;
  blendShapeGroup.matrixWorldAutoUpdate = false;

  for (const blendShapeName in BlendShape) {
    if (!isNaN(Number(blendShapeName))) {
      continue;
    }

    const blendShapeObj = new THREE.Object3D();
    blendShapeObj.name = blendShapeName;
    blendShapeObj.matrixAutoUpdate = false;
    blendShapeObj.matrixWorldAutoUpdate = false;

    blendShapeGroup.add(blendShapeObj);
  }

  root.add(blendShapeGroup);
}

export function removeBlendShapeTargets(avatar: THREE.Object3D) {
  if (!avatar) {
    return;
  }

  const root = avatar.getObjectByName('Root');
  if (!root) {
    return;
  }

  const blendShapeTargets = root.getObjectByName('Blendshapes');
  if (!blendShapeTargets) {
    return;
  }

  blendShapeTargets.removeFromParent();
}
