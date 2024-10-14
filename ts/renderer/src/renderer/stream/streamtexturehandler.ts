import { Nullable, Observable } from '@noice-com/utils';
import * as THREE from 'three';

export class StreamTextureHandler {
  private _streamFrame: Nullable<VideoFrame> = null;

  private _texture = new Observable<Nullable<THREE.CanvasTexture>>(null);
  public get texture(): Observable<Nullable<THREE.CanvasTexture>> {
    return this._texture;
  }

  private _flipY = true;
  public get flipY(): boolean {
    return this._flipY;
  }
  public set flipY(value: boolean) {
    this._flipY = value;
  }

  private updateStreamTexture(frame: VideoFrame): void {
    const image = frame as any;
    image.width = frame.codedWidth;
    image.height = frame.codedHeight;

    if (
      !this._texture ||
      !this._texture?.value?.image ||
      this._texture?.value?.image.width !== frame.codedWidth ||
      this._texture?.value?.image.height !== frame.codedHeight
    ) {
      const texture = new THREE.CanvasTexture(
        image,
        THREE.UVMapping,
        THREE.ClampToEdgeWrapping,
        THREE.ClampToEdgeWrapping,
        THREE.LinearFilter,
        THREE.LinearMipmapLinearFilter,
      );

      texture.generateMipmaps = false;

      if (this._texture?.value) {
        this._texture.value.dispose();
      }

      this.texture.value = texture;

      return;
    }

    this._texture.value.flipY = this._flipY;
    this._texture.value.image = frame;
    this._texture.value.needsUpdate = true;
  }

  public updateFromVideoFrame(frame: VideoFrame): void {
    if (this._streamFrame !== null) {
      this._streamFrame.close();
    }

    this._streamFrame = frame;
    this.updateStreamTexture(frame);
  }

  public destruct(): void {
    if (this.texture) {
      this.texture.value?.dispose();
    }

    if (this._streamFrame) {
      this._streamFrame.close();
    }
  }
}
