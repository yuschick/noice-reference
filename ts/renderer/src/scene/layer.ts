import * as THREE from 'three';

import { ClearFlags } from 'renderer/stats/types';

export class Layer extends THREE.Scene {
  private _sortingOrder: number;
  public get sortingOrder() {
    return this._sortingOrder;
  }
  public set sortingOrder(value: number) {
    this._sortingOrder = value;
  }

  private _clearFlags: ClearFlags;
  public get clearFlags() {
    return this._clearFlags;
  }
  public set clearFlags(value: ClearFlags) {
    this._clearFlags = value;
  }

  // Only used for Legacy path
  private _lights: THREE.Light[] = [];
  public get lights() {
    return this._lights;
  }

  constructor() {
    super();
    this._clearFlags = ClearFlags.DontClear;
    this._sortingOrder = 0;
  }

  public dispose() {
    this.environment?.dispose();
    this.removeFromParent();
  }
}
