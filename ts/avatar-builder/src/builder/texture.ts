import { makeLoggers, Nullable } from '@noice-com/utils';
import * as THREE from 'three';

const { logError } = makeLoggers('TextureCache');

export class TextureCache {
  private _textureLoader: THREE.TextureLoader;
  private _cache: Map<string, THREE.Texture>;

  public constructor(textureLoader: THREE.TextureLoader) {
    this._textureLoader = textureLoader;
    this._cache = new Map<string, THREE.Texture>();
  }

  public async download(
    url: string,
    onCompleted?: (texture: THREE.Texture) => void,
  ): Promise<Nullable<THREE.Texture>> {
    if (!url) {
      return null;
    }

    try {
      const tex = await this._textureLoader.loadAsync(url);

      this._cache.set(url, tex);

      if (onCompleted) {
        onCompleted(tex);
      }

      return tex;
    } catch {
      logError(`failed to load texture ${url}`);
    }

    return null;
  }

  public set(url: string, texture: THREE.Texture) {
    if (this._cache.has(url)) {
      const tex = this._cache.get(url);
      tex?.dispose();
    }

    this._cache.set(url, texture);
  }

  public get(url: string): Nullable<THREE.Texture> {
    if (this._cache.has(url)) {
      const tex = this._cache.get(url);

      return tex ? tex : null;
    }
    return null;
  }

  public has(url: string): boolean {
    return this._cache.has(url);
  }

  public dispose() {
    for (const texture of this._cache.values()) {
      texture.dispose();
    }

    this._cache.clear();
  }
}
