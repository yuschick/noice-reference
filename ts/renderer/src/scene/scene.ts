import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import { Layer } from './layer';
import { SceneStateController } from './scenestatecontroller';

const { logWarn } = makeLoggers('Scene');

function sortLayer(a: Layer, b: Layer) {
  if (a.sortingOrder < b.sortingOrder) {
    return -1;
  }

  if (a.sortingOrder > b.sortingOrder) {
    return 1;
  }
  return 0;
}

export class Scene {
  private _stateController: Nullable<SceneStateController>;
  public get stateController() {
    return this._stateController;
  }

  private _camera: Nullable<THREE.Camera>;
  public get camera() {
    return this._camera;
  }

  private _layers: Layer[];
  public get layers() {
    return this._layers;
  }

  constructor() {
    this._stateController = null;
    this._camera = null;
    this._layers = [];
  }

  private _sortLayers() {
    this.layers.sort(sortLayer);
  }

  public setStateController(stateController: SceneStateController) {
    this._stateController = stateController;
  }

  public setMainCamera(camera: THREE.Camera) {
    this._camera = camera;
  }

  public addLayer(layer: Layer) {
    if (this.layers.includes(layer)) {
      logWarn(`Already contains Layer ${layer.name}`);
      return;
    }

    this._layers.push(layer);
    this._sortLayers();
  }

  public removeLayer(layer: Layer) {
    if (!this.layers.includes(layer)) {
      logWarn(`Does not contain Layer ${layer.name}`);
      return;
    }

    this._layers.push(layer);
    this._sortLayers();
  }

  public hasLayers(): boolean {
    return this._layers.length > 0;
  }

  public resize(width: number, height: number) {
    if (!this.camera) {
      return;
    }

    const perspectiveCamera = this.camera as THREE.PerspectiveCamera;
    if (perspectiveCamera) {
      perspectiveCamera.aspect = width / height;
      perspectiveCamera.updateProjectionMatrix();
    }
  }

  public dispose() {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.dispose();
    }
  }
}
