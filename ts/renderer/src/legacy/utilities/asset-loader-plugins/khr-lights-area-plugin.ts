import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';
import { GLTFLoaderPlugin, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';

// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

export class KHRLightsAreaPlugin implements GLTFLoaderPlugin {
  public readonly name = 'KHR_lights_area';

  private _parser: GLTFParser;

  public constructor(parser: GLTFParser) {
    this._parser = parser;
  }

  public loadNode(index: number): Nullable<Promise<THREE.Object3D>> {
    const parser = this._parser;
    const json = parser.json;

    const node = json.nodes[index];

    if (
      Array.isArray(node.translation) === false ||
      Array.isArray(node.rotation) === false
    ) {
      return null;
    }

    const position = new THREE.Vector3(...node.translation);
    const rotation = new THREE.Quaternion(...node.rotation);

    if (typeof node.extensions !== 'object' || typeof json.extensions !== 'object') {
      return null;
    }

    const extension = node.extensions[this.name];

    if (extension === undefined || typeof extension.light !== 'number') {
      return null;
    }

    const lights = json.extensions[this.name]?.lights;

    if (Array.isArray(lights) === false) {
      return null;
    }

    const light = lights[extension.light];

    if (light === null) {
      return null;
    }

    if (typeof light.color === 'undefined' || Array.isArray(light.color) === false) {
      return null;
    }

    const color = new THREE.Color(light.color[0], light.color[1], light.color[2]);

    const object = new THREE.RectAreaLight(
      color,
      light.intensity,
      light.width,
      light.height,
    );

    object.name = light.name ?? 'AreaLight';

    object.position.set(position.x, position.y, position.z);
    object.rotation.setFromQuaternion(rotation);

    /*
     * const helper = new RectAreaLightHelper(object);
     * object.add(helper);
     */

    return Promise.resolve(object);
  }
}
