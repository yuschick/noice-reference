import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import GEOMETRY from '@assets/models/card.glb';
import { mapRarityToColor } from '@legacy/helpers/conversions';

export class GameCard extends THREE.Object3D {
  private static k_Geometry?: THREE.Object3D;

  private _material?: THREE.MeshStandardMaterial;

  constructor() {
    super();

    GameCard._CreateGeometry()
      .then((geometry) => {
        const mesh = geometry.getObjectByName('Card') as THREE.Mesh;
        this._material = mesh.material as THREE.MeshStandardMaterial;
        geometry.scale.set(0.8, 0.8, 0.8);

        this.add(geometry);

        return;
      })
      .catch(() => console.error('Failed constructing GameCard'));
  }

  public set rarity(value: Rarity) {
    if (this._material === undefined) {
      return;
    }

    this._material.color = mapRarityToColor(value);
  }

  private static async _CreateGeometry(): Promise<THREE.Object3D> {
    if (GameCard.k_Geometry !== undefined) {
      return GameCard.k_Geometry.clone(true);
    }

    const { scene } = await new GLTFLoader().loadAsync(GEOMETRY);

    if (GameCard.k_Geometry === undefined) {
      GameCard.k_Geometry = scene;
    }

    return scene;
  }

  public destruct(): void {
    // The geometry and the mask textures are static cached. They will have to be disposed of elsewhere.
    this._material?.dispose();
  }
}
