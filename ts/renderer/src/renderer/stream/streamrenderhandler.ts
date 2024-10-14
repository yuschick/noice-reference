import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

import { StreamTextureHandler } from './streamtexturehandler';

export class StreamRenderHandler {
  private _streamTextureHandler: StreamTextureHandler = new StreamTextureHandler();
  public get streamTextureHandler(): StreamTextureHandler {
    return this._streamTextureHandler;
  }

  public get streamTexture(): Nullable<THREE.CanvasTexture> {
    return this._streamTextureHandler.texture.value;
  }

  private _streamScene: Nullable<THREE.Scene> = null;
  private _streamCamera: Nullable<THREE.Camera> = null;
  private _streamMesh: Nullable<THREE.Mesh> = null;
  private _streamMaterial: Nullable<THREE.MeshBasicMaterial> = null;

  constructor(canvas: HTMLCanvasElement) {
    this._streamScene = new THREE.Scene();

    // Camera
    this._streamCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this._streamCamera.position.z = 1;

    // Material
    this._streamMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(canvas),
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

    // Mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    this._streamMesh = new THREE.Mesh(geometry, this._streamMaterial);
    this._streamScene.add(this._streamMesh);

    // Handlers
    this._streamTextureHandler.texture.onValue(() => this._onStreamTextureChanged());
  }

  private _onStreamTextureChanged() {
    if (this._streamMaterial && this.streamTexture) {
      this._streamMaterial.map = this.streamTexture;
    }
  }

  public updateVideoFrame(frame: VideoFrame): void {
    this._streamTextureHandler.updateFromVideoFrame(frame);
  }

  public render(renderer: THREE.WebGLRenderer) {
    const texture = this.streamTexture;
    if (!texture) {
      return;
    }

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const drawingBufferSize = renderer.getDrawingBufferSize(new THREE.Vector2());
    const factor =
      (texture.image.width * drawingBufferSize.height) /
      (drawingBufferSize.width * texture.image.height);

    if (
      this._streamMaterial &&
      this._streamMesh &&
      this._streamScene &&
      this._streamCamera
    ) {
      this._streamMesh?.scale.set(factor, 1, 1);
      renderer.render(this._streamScene, this._streamCamera);
    }
  }

  public dispose() {
    this._streamTextureHandler.destruct();
  }
}
