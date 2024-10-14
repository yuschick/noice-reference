import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export class OverlayRenderer {
  private _renderer: CSS3DRenderer;

  private _videoElement: Nullable<HTMLVideoElement> = null;
  private _videoObject: Nullable<CSS3DObject> = null;

  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;

  constructor(container: HTMLElement) {
    const renderer = new CSS3DRenderer({
      element: container,
    });

    this._renderer = renderer;

    this._camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );
    this._camera.position.set(200, 200, 200);

    this._scene = new THREE.Scene();
  }

  public async addVideo(mediaStream: Nullable<MediaStream>): Promise<void> {
    if (this._videoObject) {
      this._scene.remove(this._videoObject);
    }

    if (this._videoElement) {
      this._videoElement.pause();
      this._videoElement.srcObject = null;
    }

    if (!mediaStream) {
      return;
    }

    const videoElement = document.createElement('video');
    videoElement.playsInline = true;
    videoElement.autoplay = true;
    videoElement.muted = true;

    videoElement.srcObject = mediaStream;

    const videoObject = new CSS3DObject(videoElement);
    this._scene.add(videoObject);

    this._videoElement = videoElement;
    this._videoObject = videoObject;

    await videoElement.play();
  }

  public render() {
    this._renderer.render(this._scene, this._camera);
  }

  public resize(width: number, height: number, _devicePixelRatio: number): void {
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }

  public dispose() {
    if (this._videoElement) {
      this._videoElement.pause();
      this._videoElement.srcObject = null;
    }

    this._videoObject && this._scene.remove(this._videoObject);
  }
}
