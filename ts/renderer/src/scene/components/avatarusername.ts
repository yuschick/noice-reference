import { Color } from '@noice-com/schemas/profile/profile.pb';
import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

import { ProfileColor } from '../types';

import { Avatar } from './avatar';

import { disposeObject } from '@legacy/helpers/mesh';

export class AvatarUsername extends THREE.Object3D {
  private _avatar?: Nullable<Avatar> = null;
  private _text?: Nullable<THREE.Mesh> = null;
  private _camera?: Nullable<THREE.Camera> = null;
  private _headTarget?: Nullable<THREE.Object3D> = null;

  constructor(avatar: Avatar, font: Font, camera: Nullable<THREE.Camera>) {
    super();

    this._avatar = avatar;
    this._camera = camera;

    if (!this._avatar.userName || !this._avatar.preferredColor) {
      return;
    }

    const username = this._avatar?.userName;

    let truncatedUsername = username?.slice(0, 10);
    if (username && username?.length > 10) {
      truncatedUsername += '...';
    }

    const text = new TextGeometry(truncatedUsername, {
      font: font,
      size: 0.08,
      height: 0.001,
      depth: 0,
      curveSegments: 5,
      bevelEnabled: false,
    });

    text.computeBoundingBox();
    text.center();
    text.computeVertexNormals();

    let color = new THREE.Color('#F69856');
    color.copySRGBToLinear(color);

    const preferredColor = this._avatar?.preferredColor;
    if (preferredColor !== Color.COLOR_UNSPECIFIED) {
      const colorString = preferredColor as string;
      const colorCode = ProfileColor[colorString as keyof typeof ProfileColor];
      color = new THREE.Color(colorCode);
      color.copySRGBToLinear(color);
    }

    this._text = new THREE.Mesh(
      text,
      new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }),
    );
    this._text.name = `mesh-${username}`;
    this._text.position.set(0, 0, 0);
    this.add(this._text);
    avatar.add(this);
  }

  public get headTarget(): Nullable<THREE.Object3D> | undefined {
    return this._headTarget;
  }

  public setHeadTarget(target: Nullable<THREE.Object3D> | undefined) {
    this._headTarget = target;
  }

  public update() {
    if (this._avatar && this._text && this._headTarget && this._camera) {
      let pos = new THREE.Vector3(0, 0, 0);
      pos = this._headTarget.getWorldPosition(pos);
      pos = pos.sub(this._avatar.position);

      this._text.position.set(-pos.x, pos.y + 0.2, -pos.z);

      const cam = this._camera;
      const rot = this._text.rotation;

      this._text.rotation.set(rot.x, cam.rotation.y, rot.z);
    }
  }

  public dispose() {
    disposeObject(this);
  }
}
