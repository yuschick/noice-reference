import { Optional } from '@noice-com/utils';
import * as THREE from 'three';

import { Emoji } from '../emoji';

import FRAGMENT_SHADER from './emoji.fragment.glsl';
import VERTEX_SHADER from './emoji.vertex.glsl';

import { Stopwatch } from '@legacy/utilities';

interface Metadata {
  columns: number;
  rows: number;

  frameCount: number;
  frameDuration: number;
}

const DEFAULT_FRAME_DURATION = 40.0;

const GRAVITY = 4.5;

const FRICTION = 0.9;

const VERTICAL_IMPULSE = 1.575;
const SPREAD = 1.125;

const animatedEmojis = [
  'emotes/catjam',
  'emotes/dogjam',
  'emotes/bluhazy-vibing',
  'emotes/bluhazy-w',
];

const isAnimated = (name: string) => animatedEmojis.includes(name);

const getSpritesheetPath = (name: string, extension = '.png') => {
  if (isAnimated(name) === false) {
    return `${name}${extension}`;
  }

  const [prefix, file] = name.split('/');
  const [emojiName] = file.split('.');

  return `${prefix}/spritesheets/${emojiName}${extension}`;
};

export class EmojiV1 extends THREE.Object3D implements Emoji {
  private static _TextureMap: Map<string, THREE.Texture> = new Map();
  private static _MetadataMap: Map<string, Promise<Metadata>> = new Map();

  private _name: string;
  private _url: string;

  private _mesh: THREE.Mesh;
  private _material: THREE.ShaderMaterial;

  private _isAnimated: boolean;

  // @todo Refactor to use Clock
  private _timestamp = performance.now();
  private _index = new THREE.Vector2();

  private _lifetime: Stopwatch;
  private _lifespan: number;

  private _origin: THREE.Vector3;
  private _velocity: THREE.Vector3;
  private _originalScale: THREE.Vector3;

  public get isAnimated(): boolean {
    return this._isAnimated;
  }

  public get isAlive(): boolean {
    return this._lifetime.isRunning;
  }

  public get isLoaded(): boolean {
    return EmojiV1._TextureMap.has(this._name);
  }

  public constructor(name: string, url: string, lifespan: number) {
    super();

    this._name = name;
    this._url = url;

    const geometry = new THREE.PlaneGeometry(1.0, 1.0);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,

      uniforms: {
        source: { value: null },

        columns: { value: 1 },
        rows: { value: 1 },

        speed: { value: 1 },

        index: { value: new THREE.Vector2(0.0, 0.0) },
      },
    });

    material.side = THREE.DoubleSide;

    material.depthWrite = false;
    material.depthTest = false;

    material.transparent = true;

    this._mesh = new THREE.Mesh(geometry, material);
    this._mesh.renderOrder = 999999;

    this._material = material;

    this.castShadow = false;
    this.receiveShadow = false;

    this._isAnimated = false;
    this._originalScale = new THREE.Vector3(0.25, 0.25, 1);

    this.add(this._mesh);

    this._lifetime = new Stopwatch();
    this._lifespan = lifespan;

    this._origin = new THREE.Vector3();
    this._velocity = new THREE.Vector3();
  }

  private async _loadTexture(): Promise<THREE.Texture> {
    let texture = EmojiV1._TextureMap.get(this._name);

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

    EmojiV1._TextureMap.set(this._name, texture);

    return texture;
  }

  private async _loadMetadata(): Promise<Optional<Metadata>> {
    return undefined;
  }

  private _load() {
    if (this.isAnimated === false) {
      return Promise.all([this._loadTexture()]);
    }

    return Promise.all([this._loadTexture(), this._loadMetadata()]);
  }

  private _updateMaterialProperties(metadata: Metadata): void {
    this._material.uniforms.columns.value = metadata.columns;
    this._material.uniforms.rows.value = metadata.rows;

    this._material.opacity = 1.0;
    this._material.needsUpdate = true;
  }

  private _animate(): void {
    if (this._isAnimated === false) {
      return;
    }

    const promise = EmojiV1._MetadataMap.get(getSpritesheetPath(this._name, '.json'));

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

          this._material.uniforms.index.value = this._index;
          this._timestamp = this._lifetime.time;
        }

        return;
      })
      .catch((reason) => {
        console.error(`Failed loading Emoji('${this._name}') metadata: ${reason}`);
      });
  }

  public emit(): void {
    this._load()
      .then(([texture]) => {
        this._mesh.visible = true;

        this._material.uniforms.source.value = texture;
        this._material.uniformsNeedUpdate = true;

        this._material.needsUpdate = true;

        this._lifetime.reset();
        this._lifetime.start();

        this._timestamp = this._lifetime.time;
        this._originalScale.copy(this.scale);

        const angle = Math.PI * 0.5 + 2.0 * Math.random() - 1.0;

        this._origin = this.position.clone();

        this._velocity.set(
          Math.cos(angle) * SPREAD,
          Math.sin(angle) * VERTICAL_IMPULSE,
          0.0,
        );

        return;
      })
      .catch((reason) =>
        console.error(`Failed emitting Emoji('${this._name}'): ${reason}`),
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
    velocity.y -= GRAVITY * normalizedLife;

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
    /* The textures are pooled in a static pool and they will need to be released separately. Graphics should handle
     * these gracefully upon exit. */

    this._material.dispose();

    this._mesh.geometry.dispose();
  }
}
