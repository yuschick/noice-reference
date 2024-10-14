import { Helpers } from '@noice-com/avatar-builder';
import {
  getBoneIndexToNameMapping,
  getBoneNameToIndexMapping,
} from '@noice-com/avatar-builder/src/helpers';
import { makeLoggers } from '@noice-com/utils';
import { SimpleAvatarBoneNames } from '@noice-com/web-renderer/src/scene/animation/types';
import * as THREE from 'three';

import { simplifyBoneHierarchy } from 'helpers';

const { logInfoVerbose, logError } = makeLoggers('AvatarSimplifier');

export function simplifyAvatar(complexAvatar: THREE.Object3D) {
  const skinnedMeshes = Helpers.getSkinnedMeshes(complexAvatar);
  if (skinnedMeshes?.length !== 1) {
    throw new Error('Only one skinned mesh supported');
  }

  const skinnedMesh = skinnedMeshes[0];

  const rootBone = Helpers.getFirstChildBone(complexAvatar);
  if (!rootBone) {
    throw new Error('No root bone found');
  }

  const oldMapping = getBoneIndexToNameMapping(skinnedMesh.skeleton);
  const newBones = simplifyBoneHierarchy(rootBone, SimpleAvatarBoneNames);

  const skeleton = new THREE.Skeleton(newBones);
  const newMapping = getBoneNameToIndexMapping(skeleton);

  logInfoVerbose('old mapping', oldMapping);
  logInfoVerbose('new mapping', newMapping);

  skeleton.calculateInverses();

  const skinIndices = Helpers.getBufferAttributeOrThrowError(
    skinnedMesh.geometry,
    'skinIndex',
  );
  const skinWeights = Helpers.getBufferAttributeOrThrowError(
    skinnedMesh.geometry,
    'skinWeight',
  );
  const simpleSkinIndices = Helpers.getBufferAttributeOrThrowError(
    skinnedMesh.geometry,
    '_joints',
  );
  const simpleSkinWeights = Helpers.getBufferAttributeOrThrowError(
    skinnedMesh.geometry,
    '_weights',
  );

  if (
    skinIndices.count !== skinWeights.count ||
    simpleSkinIndices.count !== simpleSkinWeights.count ||
    skinIndices.count !== simpleSkinIndices.count
  ) {
    throw new Error('Buffer attribute item count does not match');
  }

  logInfoVerbose('complex skin indices', skinIndices.clone());
  logInfoVerbose('complex skin weights', skinWeights.clone());
  logInfoVerbose('simple skin indices', simpleSkinIndices.clone());
  logInfoVerbose('simple skin weights', simpleSkinWeights.clone());

  let errorCount = 0;

  for (let i = 0; i < skinIndices.count; i++) {
    let newIndex1: number | undefined;
    let newIndex2: number | undefined;
    let newIndex3: number | undefined;
    let newIndex4: number | undefined;

    const oldIndex1 = simpleSkinIndices.getX(i);
    const oldIndex2 = simpleSkinIndices.getY(i);
    const oldIndex3 = simpleSkinIndices.getZ(i);
    const oldIndex4 = simpleSkinIndices.getW(i);

    const oldBoneName1 = oldMapping.get(oldIndex1);
    const oldBoneName2 = oldMapping.get(oldIndex2);
    const oldBoneName3 = oldMapping.get(oldIndex3);
    const oldBoneName4 = oldMapping.get(oldIndex4);

    const newWeight1 = simpleSkinWeights.getX(i);
    const newWeight2 = simpleSkinWeights.getY(i);
    const newWeight3 = simpleSkinWeights.getZ(i);
    const newWeight4 = simpleSkinWeights.getW(i);

    if (oldBoneName1 && newWeight1 > Number.EPSILON) {
      newIndex1 = newMapping.get(oldBoneName1);
      if (!newIndex1) {
        logError(`new index undefined for bone ${oldBoneName1}, old index ${oldIndex1}`);
        errorCount++;
      }
    }

    if (oldBoneName2 && newWeight2 > Number.EPSILON) {
      newIndex2 = newMapping.get(oldBoneName2);
      if (!newIndex2) {
        logError(`new index undefined for bone ${oldBoneName2}, old index ${oldIndex2}`);
        errorCount++;
      }
    }

    if (oldBoneName3 && newWeight3 > Number.EPSILON) {
      newIndex3 = newMapping.get(oldBoneName3);
      if (!newIndex3) {
        logError(`new index undefined for bone ${oldBoneName3}, old index ${oldIndex3}`);
        errorCount++;
      }
    }

    if (oldBoneName4 && newWeight4 > Number.EPSILON) {
      newIndex4 = newMapping.get(oldBoneName4);
      if (!newIndex4) {
        logError(`new index undefined for bone ${oldBoneName4}, old index ${oldIndex4}`);
        errorCount++;
      }
    }

    skinIndices.setXYZW(
      i,
      newIndex1 || 0,
      newIndex2 || 0,
      newIndex3 || 0,
      newIndex4 || 0,
    );
    skinIndices.needsUpdate = true;

    skinWeights.setXYZW(
      i,
      newWeight1 || 0,
      newWeight2 || 0,
      newWeight3 || 0,
      newWeight4 || 0,
    );
    skinWeights.needsUpdate = true;
  }

  if (errorCount > 0) {
    throw new Error(`Avatar simplification failed with ${errorCount} index errors`);
  }

  logInfoVerbose('remapped simple skin indices', skinIndices);
  logInfoVerbose('remapped simple skin weights', skinWeights);

  skinnedMesh.bind(skeleton);
}
