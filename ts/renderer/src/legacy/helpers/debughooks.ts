import * as THREE from 'three';

// @ts-ignore
const updateMatrixWorldTemp = THREE.Object3D.prototype.updateMatrixWorld;
const updateWorldMatrixTemp = THREE.Object3D.prototype.updateWorldMatrix;
const updateMatrixTemp = THREE.Object3D.prototype.updateMatrix;

export class MatrixUpdateStats {
  public matriceWorldCount = 0;
  public matriceCount = 0;

  public reset() {
    this.matriceWorldCount = 0;
    this.matriceCount = 0;
  }
}

export function hookUpdateMatrix(stats: MatrixUpdateStats) {
  THREE.Object3D.prototype.updateMatrixWorld = function () {
    // eslint-disable-next-line prefer-rest-params
    if (this.matrixWorldNeedsUpdate || arguments[0] /*force*/) {
      stats.matriceWorldCount++;
    }

    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    updateMatrixWorldTemp.apply(this, arguments);
  };

  THREE.Object3D.prototype.updateWorldMatrix = function () {
    stats.matriceWorldCount++;
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    updateWorldMatrixTemp.apply(this, arguments);
  };

  THREE.Object3D.prototype.updateMatrix = function () {
    stats.matriceCount++;
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    updateMatrixTemp.apply(this, arguments);
  };
}

export function unhookUpdateMatrix() {
  THREE.Object3D.prototype.updateMatrixWorld = updateMatrixWorldTemp;
  THREE.Object3D.prototype.updateWorldMatrix = updateWorldMatrixTemp;
  THREE.Object3D.prototype.updateMatrix = updateMatrixTemp;
}
