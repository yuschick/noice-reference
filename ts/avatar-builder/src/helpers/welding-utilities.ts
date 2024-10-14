import { makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

const { logInfoVerbose } = makeLoggers('WeldingUtilities');

export function weldPositions(
  bodyPositionAttribute: THREE.BufferAttribute,
  headPositionAttribute: THREE.BufferAttribute,
  bodySeamVertexIndex: number,
  headSeamVertexIndex: number,
  bodyVertexPosition: THREE.Vector3,
  averageNeckVertexPositions: boolean,
) {
  if (averageNeckVertexPositions) {
    const headVertexPosition = new THREE.Vector3().fromBufferAttribute(
      headPositionAttribute,
      headSeamVertexIndex,
    );

    const averagedPosition = bodyVertexPosition.add(headVertexPosition).divideScalar(2.0);

    bodyPositionAttribute.setXYZ(
      bodySeamVertexIndex,
      averagedPosition.x,
      averagedPosition.y,
      averagedPosition.z,
    );
    headPositionAttribute.setXYZ(
      headSeamVertexIndex,
      averagedPosition.x,
      averagedPosition.y,
      averagedPosition.z,
    );
  } else {
    headPositionAttribute.setXYZ(
      headSeamVertexIndex,
      bodyVertexPosition.x,
      bodyVertexPosition.y,
      bodyVertexPosition.z,
    );
  }
}

export function weldTangentsAndNormals(
  bodyNormalAttribute: THREE.BufferAttribute,
  bodyTangentAttribute: THREE.BufferAttribute,
  headNormalAttribute: THREE.BufferAttribute,
  headTangentAttribute: THREE.BufferAttribute,
  bodySeamVertexIndex: number,
  headSeamVertexIndex: number,
  averageNeckVertexNormalsAndTangents: boolean,
) {
  const bodyVertexNormal = new THREE.Vector3().fromBufferAttribute(
    bodyNormalAttribute,
    bodySeamVertexIndex,
  );

  const bodyVertexTangent = new THREE.Vector4().fromBufferAttribute(
    bodyTangentAttribute,
    bodySeamVertexIndex,
  );

  if (averageNeckVertexNormalsAndTangents) {
    const headVertexNormal = new THREE.Vector3().fromBufferAttribute(
      headNormalAttribute,
      headSeamVertexIndex,
    );

    const headVertexTangent = new THREE.Vector4().fromBufferAttribute(
      headTangentAttribute,
      headSeamVertexIndex,
    );

    const averagedNormal = bodyVertexNormal.add(headVertexNormal).divideScalar(2.0);
    const averagedTangent = bodyVertexTangent.add(headVertexTangent).divideScalar(2.0);

    bodyNormalAttribute.setXYZ(
      bodySeamVertexIndex,
      averagedNormal.x,
      averagedNormal.y,
      averagedNormal.z,
    );
    headNormalAttribute.setXYZ(
      headSeamVertexIndex,
      averagedNormal.x,
      averagedNormal.y,
      averagedNormal.z,
    );

    bodyTangentAttribute.setXYZW(
      bodySeamVertexIndex,
      averagedTangent.x,
      averagedTangent.y,
      averagedTangent.z,
      bodyVertexTangent.w,
    );
    headTangentAttribute.setXYZW(
      headSeamVertexIndex,
      averagedTangent.x,
      averagedTangent.y,
      averagedTangent.z,
      bodyVertexTangent.w,
    );
  } else {
    headNormalAttribute.setXYZ(
      headSeamVertexIndex,
      bodyVertexNormal.x,
      bodyVertexNormal.y,
      bodyVertexNormal.z,
    );

    headTangentAttribute.setXYZW(
      headSeamVertexIndex,
      bodyVertexTangent.x,
      bodyVertexTangent.y,
      bodyVertexTangent.z,
      bodyVertexTangent.w,
    );
  }
}

export function weldSkinningData(
  bodySkinIndexAttribute: THREE.BufferAttribute,
  bodySkinWeightAttribute: THREE.BufferAttribute,
  headSkinIndexAttribute: THREE.BufferAttribute,
  headSkinWeightAttribute: THREE.BufferAttribute,
  bodySeamVertexIndex: number,
  headSeamVertexIndex: number,
  useIntelligentSeamSkinning: boolean,
) {
  const bodySkinIndex = new THREE.Vector4().fromBufferAttribute(
    bodySkinIndexAttribute,
    bodySeamVertexIndex,
  );

  const bodySkinWeight = new THREE.Vector4().fromBufferAttribute(
    bodySkinWeightAttribute,
    bodySeamVertexIndex,
  );

  if (useIntelligentSeamSkinning) {
    // This feature expects head item skinning weights to be already fixed

    const headSkinIndex = new THREE.Vector4().fromBufferAttribute(
      headSkinIndexAttribute,
      headSeamVertexIndex,
    );

    const headSkinWeight = new THREE.Vector4().fromBufferAttribute(
      headSkinWeightAttribute,
      headSeamVertexIndex,
    );

    logInfoVerbose(`Original body skinning indices: ${JSON.stringify(bodySkinIndex)}`);
    logInfoVerbose(`Original body skinning weights: ${JSON.stringify(bodySkinWeight)}`);

    logInfoVerbose(`Original head skinning indices: ${JSON.stringify(headSkinIndex)}`);
    logInfoVerbose(`Original head skinning weights: ${JSON.stringify(headSkinWeight)}`);

    const newSkinning: { index: number; weight: number }[] = [];

    newSkinning.push({
      index: bodySkinIndex.x,
      weight: bodySkinWeight.x,
    });
    newSkinning.push({
      index: bodySkinIndex.y,
      weight: bodySkinWeight.y,
    });
    newSkinning.push({
      index: bodySkinIndex.z,
      weight: bodySkinWeight.z,
    });
    newSkinning.push({
      index: bodySkinIndex.w,
      weight: bodySkinWeight.w,
    });

    newSkinning.push({
      index: headSkinIndex.x,
      weight: headSkinWeight.x,
    });
    newSkinning.push({
      index: headSkinIndex.y,
      weight: headSkinWeight.y,
    });
    newSkinning.push({
      index: headSkinIndex.z,
      weight: headSkinWeight.z,
    });
    newSkinning.push({
      index: headSkinIndex.w,
      weight: headSkinWeight.w,
    });

    newSkinning.sort((a, b) => (a.weight > b.weight ? -1 : 1));

    const newWeights = new THREE.Vector4(
      newSkinning[0].weight,
      newSkinning[1].weight,
      newSkinning[2].weight,
      newSkinning[3].weight,
    );

    const newIndices = new THREE.Vector4(
      newSkinning[0].index,
      newSkinning[1].index,
      newSkinning[2].index,
      newSkinning[3].index,
    );

    const scale = 1.0 / newWeights.manhattanLength();
    if (scale !== Infinity && !Number.isNaN(scale)) {
      newWeights.multiplyScalar(scale);
    } else {
      newWeights.set(1, 0, 0, 0);
    }

    bodySkinIndexAttribute.setXYZW(
      bodySeamVertexIndex,
      newIndices.x,
      newIndices.y,
      newIndices.z,
      newIndices.w,
    );
    bodySkinWeightAttribute.setXYZW(
      bodySeamVertexIndex,
      newWeights.x,
      newWeights.y,
      newWeights.z,
      newWeights.w,
    );

    headSkinIndexAttribute.setXYZW(
      headSeamVertexIndex,
      newIndices.x,
      newIndices.y,
      newIndices.z,
      newIndices.w,
    );
    headSkinWeightAttribute.setXYZW(
      headSeamVertexIndex,
      newWeights.x,
      newWeights.y,
      newWeights.z,
      newWeights.w,
    );

    logInfoVerbose(`Sorted skinning indices: ${JSON.stringify(newIndices)}`);
    logInfoVerbose(`Sorted skinning weights: ${JSON.stringify(newWeights)}`);
  } else {
    // Just copy neck skinning weights to the seam

    headSkinIndexAttribute.setXYZW(
      headSeamVertexIndex,
      bodySkinIndex.x,
      bodySkinIndex.y,
      bodySkinIndex.z,
      bodySkinIndex.w,
    );

    headSkinWeightAttribute.setXYZW(
      headSeamVertexIndex,
      bodySkinWeight.x,
      bodySkinWeight.y,
      bodySkinWeight.z,
      bodySkinWeight.w,
    );
  }
}
