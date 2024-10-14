import { Optional } from '@noice-com/utils';
import * as THREE from 'three';

import { Emoji } from '../emoji';

import { Clock, Stopwatch } from '@legacy/utilities';

const DEFAULT_FRAME_DURATION = 40.0;

const FRICTION = 0.9;

const HORIZONTAL_IMPULSE = 2.25;
const VERTICAL_IMPULSE = 1.575;
const SPREAD = 1.125;

interface Metadata {
  columns: number;
  rows: number;

  frameCount: number;
  frameDuration: number;
}

const isAnimated = (name: string) =>
  [
    'emotes/catjam',
    'emotes/dogjam',
    'emotes/bluhazy-vibing',
    'emotes/bluhazy-w',
  ].includes(name);

const getSpritesheetPath = (name: string, extension = '.png') => {
  if (isAnimated(name) === false) {
    return `${name}${extension}`;
  }

  const [prefix, file] = name.split('/');
  const [emojiName] = file.split('.');

  return `${prefix}/spritesheets/${emojiName}${extension}`;
};

export class EmojiV2 extends THREE.Sprite implements Emoji {
  private static _TextureMap: Map<string, THREE.Texture> = new Map();
  private static _MetadataMap: Map<string, Promise<Metadata>> = new Map();

  private _url: string;
  private _isAnimated: boolean;

  private _timestamp: number;
  private _index: THREE.Vector2;

  private _lifetime: Stopwatch;
  private _lifespan: number;

  private _origin: THREE.Vector3;
  private _velocity: THREE.Vector3;
  private _originalScale: THREE.Vector3;

  private _shader?: THREE.WebGLProgramParametersWithUniforms;

  public constructor(name: string, url: string, lifespan: number) {
    super();

    this.name = name;
    this.renderOrder = 999999;

    this.castShadow = false;
    this.receiveShadow = false;

    this._url = url;

    this._timestamp = Clock.timestamp * 0.001;
    this._index = new THREE.Vector2();

    this._lifetime = new Stopwatch();
    this._lifespan = lifespan;

    this._origin = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
    this._originalScale = new THREE.Vector3(0.25, 0.25, 1);
    this._isAnimated = false;
  }

  public get isAlive(): boolean {
    return this._lifetime.isRunning;
  }

  public get isLoaded(): boolean {
    return EmojiV2._TextureMap.has(this.name);
  }

  private async _loadTexture(): Promise<THREE.Texture> {
    let texture = EmojiV2._TextureMap.get(this.name);

    if (texture !== undefined) {
      return texture;
    }

    const loader = new THREE.ImageBitmapLoader();
    loader.setOptions({ imageOrientation: 'flipY' });

    const imageBitmap = await loader.loadAsync(this._url);

    texture = new THREE.CanvasTexture(imageBitmap);

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    EmojiV2._TextureMap.set(this.name, texture);

    return texture;
  }

  private async _loadMetadata(): Promise<Optional<Metadata>> {
    return undefined;
  }

  private _load() {
    if (this._isAnimated === false) {
      return Promise.all([this._loadTexture()]);
    }

    return Promise.all([this._loadTexture(), this._loadMetadata()]);
  }

  private _updateMaterialProperties(metadata: Metadata): void {
    if (this._shader === undefined) {
      return;
    }

    this._shader.uniforms.columns.value = metadata.columns;
    this._shader.uniforms.rows.value = metadata.rows;

    this.material.opacity = 1.0;
    this.material.needsUpdate = true;
  }

  private _animate(): void {
    if (this._isAnimated === false) {
      return;
    }

    const promise = EmojiV2._MetadataMap.get(getSpritesheetPath(this.name, '.json'));

    promise
      ?.then((metadata) => {
        this._updateMaterialProperties(metadata);

        const frameDuration = (metadata.frameDuration ?? DEFAULT_FRAME_DURATION) * 0.001;

        if (this._lifetime.time >= this._timestamp + frameDuration) {
          this._index.x += 1.0;

          if (this._index.x >= metadata.columns) {
            this._index.x = 0.0;
            this._index.y += 1.0;

            if (this._index.y >= metadata.rows) {
              this._index.y = 0.0;
            }
          }

          if (this._index.x + metadata.columns * this._index.y >= metadata.frameCount) {
            this._index.set(0.0, 0.0);
          }

          if (this._shader !== undefined) {
            this._shader.uniforms.index.value = this._index;
          }

          this._timestamp = this._lifetime.time;
        }

        return;
      })
      .catch((reason) => {
        console.error(`Failed loading Emoji('${this.name}') metadata: ${reason}`);
      });
  }

  public emit(): void {
    this._load()
      .then(([texture]) => {
        this.visible = true;

        this.material = new THREE.SpriteMaterial({ map: texture });

        this.material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',

            'uniform float columns;\n' +
              'uniform float rows;\n' +
              '\n' +
              'uniform vec2 index;\n' +
              '\n' +
              '#include <common>',
          );

          shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',

            '#include <uv_vertex>\n' +
              '\n' +
              'vec2 size = vec2(1.0 / columns, 1.0 / rows);\n' +
              'vec2 offset = size * index * vec2(1.0, -1.0);\n' +
              'vec2 newUv = MAP_UV * size;\n' +
              'newUv.y = newUv.y + size.y * (rows  - 1.0);\n' +
              'vMapUv = newUv + offset;',
          );

          shader.uniforms.rows = { value: 1.0 };
          shader.uniforms.columns = { value: 1.0 };

          shader.uniforms.index = { value: new THREE.Vector2() };

          this._shader = shader;
        };

        this.material.depthTest = false;
        this.material.depthWrite = false;

        this.material.needsUpdate = true;

        this._lifetime.reset();
        this._lifetime.start();

        this._timestamp = this._lifetime.time;

        const angle = Math.PI * 0.5 + 2.0 * Math.random() - 1.0;

        this._origin = this.position.clone();
        this._origin.x = -4.25;
        this._origin.y = 1.25;

        this._velocity.set(
          Math.cos(angle) * SPREAD + Math.cos(Math.PI * 0.25) * HORIZONTAL_IMPULSE,
          Math.sin(angle) * VERTICAL_IMPULSE,
          0.0,
        );

        this._originalScale.copy(this.scale);

        return;
      })
      .catch((reason) =>
        console.error(`Failed emitting Emoji('${this.name}'): ${reason}`),
      );
  }

  public update(): void {
    if (this.isLoaded === false || this.isAlive === false) {
      return;
    }

    this._animate();

    const lifetime = this._lifetime.time;
    const normalizedLife = THREE.MathUtils.clamp(lifetime / this._lifespan, 0.0, 1.0);

    const velocity = this._velocity.clone();

    velocity.x *= 1.0 - Math.min(FRICTION * normalizedLife);
    this.material.opacity = 1.0 - normalizedLife;

    this.position.x = this._origin.x + velocity.x * normalizedLife;
    this.position.y = this._origin.y + velocity.y * normalizedLife;

    const size = THREE.MathUtils.clamp(
      Math.sqrt(Math.sin(normalizedLife * Math.PI)),
      0.0,
      1.0,
    );

    this.scale.set(
      this._originalScale.x * size,
      this._originalScale.y * size,
      this._originalScale.z * size,
    );

    if (lifetime >= this._lifespan) {
      this.visible = false;

      this._lifetime.stop();
      this._timestamp = 0;
    }
  }

  public destruct(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
