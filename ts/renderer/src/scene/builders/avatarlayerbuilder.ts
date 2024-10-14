import * as THREE from 'three';

import { Layer } from 'scene/layer';

export class AvatarLayerBuilder {
  public async getLayer(environmentMap: THREE.Texture | null): Promise<Layer> {
    const layer = new Layer();
    layer.name = 'Avatars';
    layer.environment = environmentMap;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.name = 'DefaultLight';
    directionalLight.position.set(30.0, 30.0, -30.0);
    directionalLight.rotation.set(0, 180, 0);
    directionalLight.castShadow = false;

    layer.add(directionalLight);
    return layer;
  }
}
