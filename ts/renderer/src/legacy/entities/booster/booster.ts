import * as THREE from 'three';

import SPRITESHEET from '@assets/boosters/booster-spritesheet.png';
import { Stopwatch } from '@legacy/utilities';

export class Booster extends THREE.Object3D {
  public static readonly OFFSET: THREE.Vector3 = new THREE.Vector3(0.0, 2.0, 0.25);

  private _sprite: THREE.Sprite;
  private _material: THREE.SpriteMaterial;

  private _lifetime: Stopwatch;
  private _lifespan: number;

  private _origin?: THREE.Vector3;
  private _target?: THREE.Vector3;

  public get isAlive(): boolean {
    return this._lifetime.isRunning;
  }

  public constructor(lifespan: number) {
    super();

    this.visible = false;

    const material = new THREE.SpriteMaterial();

    material.side = THREE.DoubleSide;
    material.depthWrite = false;

    material.toneMapped = false;

    this._sprite = new THREE.Sprite(material);
    this._material = material;

    const loader = new THREE.ImageBitmapLoader();
    loader.setOptions({ imageOrientation: 'flipY' });

    loader.load(SPRITESHEET, (imageBitmap) => {
      const spriteSheet = new THREE.CanvasTexture(imageBitmap);

      spriteSheet.minFilter = THREE.LinearMipMapLinearFilter;
      spriteSheet.magFilter = THREE.LinearFilter;

      spriteSheet.wrapS = THREE.RepeatWrapping;
      spriteSheet.wrapT = THREE.RepeatWrapping;

      spriteSheet.repeat.set(0.166667, 1);

      material.map = spriteSheet;
    });

    this.castShadow = false;
    this.receiveShadow = false;

    this.renderOrder = 999999;

    this.add(this._sprite);

    this._lifetime = new Stopwatch();
    this._lifespan = lifespan;
  }

  public destruct(): void {
    this._material.map?.dispose();
    this._material.dispose();

    this._sprite.geometry.dispose();
  }

  public emit(id: number): void {
    this.position.copy(Booster.OFFSET);
    this.scale.set(0.325 * 1.23225, 0.325, 1.0);

    this._origin = undefined;
    this._target = undefined;

    this._lifetime.reset();
    this._lifetime.start();

    const offset = Math.min(Math.max(id - 1, 0), 6);
    this._material.map?.offset.set(offset * 0.166667, 0.0);

    this.visible = true;
  }

  public setTarget(target: THREE.Vector3): void {
    this._origin = this.position.clone();
    this._target = this.parent?.worldToLocal(target.clone());
  }

  public update(_frameTime: number): void {
    if (this.isAlive === false) {
      return;
    }

    const lifetime = this._lifetime.time;
    const progress = lifetime / this._lifespan;

    let scale = 1.0;
    let opacity = 1.0;

    if (progress < 0.125) {
      const time = 8.0 * progress;

      opacity = time;
      scale += 0.25 * time;
    } else if (progress > 0.875) {
      const time = 8.0 * (progress - 0.875);

      scale -= 0.25 * time;
      opacity = 1.0 - time;
    } else {
      scale = 1.25;
    }

    if (typeof this._origin !== 'undefined' && typeof this._target !== 'undefined') {
      const displacement = new THREE.Vector3(
        this._target.x,
        this._target.y,
        this._target.z,
      ).sub(this._origin);

      const x = displacement.x * progress;
      const y = displacement.y * progress;
      const z = displacement.z * progress;

      const distance = displacement.length();

      const arc =
        (0.5 * (x - this._origin.x) * (x - this._target.x)) /
        (-0.25 * distance * distance);

      this.position.set(this._origin.x + x, this._origin.y + y + arc, this._origin.z + z);
    }

    this.scale.set(0.4 * scale, 0.325 * scale, 1.0);

    this._material.opacity = opacity;

    if (lifetime >= this._lifespan) {
      this.visible = false;

      this._lifetime.stop();

      this.position.copy(Booster.OFFSET);
      this.scale.set(0.325 * 1.23225, 0.325, 1.0);

      this._origin = undefined;
      this._target = undefined;
    }
  }
}
