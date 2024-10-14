import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

export class LookAt {
  private _object: Nullable<THREE.Object3D>;
  private _target: Nullable<THREE.Object3D>;

  constructor(object: Nullable<THREE.Object3D>, target: Nullable<THREE.Object3D>) {
    this._object = object;
    this._target = target;
  }

  public get object(): Nullable<THREE.Object3D> {
    return this._object;
  }

  public set object(value: THREE.Object3D) {
    this._object = value;
  }

  public get target(): Nullable<THREE.Object3D> {
    return this._target;
  }

  public set target(value: THREE.Object3D) {
    this._target = value;
  }

  public update() {
    if (!this._target || !this._object) {
      return;
    }

    const pos = new THREE.Vector3();
    this._target.getWorldPosition(pos);
    this._object.lookAt(pos);
  }
}
