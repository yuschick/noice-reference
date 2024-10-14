import { ArenaConfigRenderSettings } from '@noice-com/schemas/rendering/config.pb';
import { Light, LightType } from '@noice-com/schemas/rendering/rendering.pb';
import { makeLoggers, Nullable, Observable } from '@noice-com/utils';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { Crowd } from './crowd';

import DEFAULT_ENVIRONMENT_MAP from '@assets/environment-maps/default.exr';
import * as API from '@legacy/api';
import { Graphics } from '@legacy/graphics';
import {
  convertUnityCameraRotationVectorToTHREE,
  convertUnityEntityRotationVectorToTHREE,
  convertUnityPositionVectorToTHREE,
} from '@legacy/helpers/conversions';
import { Sandbox } from '@legacy/sandbox';

const { logError } = makeLoggers('Arena');

const MAIN_CAMERA_INDEX = 0;

const WATTS_PER_SQUARE_METER_PER_STERADIAN_AT_555_NM_IN_CANDELAS = 0.0683;

const URP_TO_BLENDER_DIRECTIONAL_LIGHT_CONVERSION_COEFFICIENT = 15.0;
const URP_TO_BLENDER_POINT_LIGHT_CONVERSION_COEFFICIENT = 28.5;
const URP_TO_BLENDER_SPOTLIGHT_CONVERSION_COEFFICIENT = 10.0;

const loader = new EXRLoader();

export class Arena extends THREE.Scene implements Sandbox {
  private _descriptor: API.Arena;

  private _camera: Observable<THREE.PerspectiveCamera>;

  private _destructionCallbacks: VoidFunction[] = [];

  private _lights: THREE.Light[] = [];

  private _graphics: Graphics;

  private _screenParams: Observable<Nullable<THREE.Vector4>> = new Observable<
    Nullable<THREE.Vector4>
  >(null);
  public get screenParams(): Observable<Nullable<THREE.Vector4>> {
    return this._screenParams;
  }

  public constructor(graphics: Graphics, descriptor: API.Arena) {
    super();

    this._graphics = graphics;

    this.name = descriptor.name;

    this._descriptor = descriptor;

    this._camera = new Observable(new THREE.PerspectiveCamera());

    this._createMainCamera();
    this.createLights();
  }

  public get activeCamera(): Observable<THREE.PerspectiveCamera> {
    return this._camera;
  }

  public get renderSettings(): ArenaConfigRenderSettings {
    return this._descriptor.renderSettings;
  }

  private _getScreenParams() {
    const renderer = this._graphics.getRenderer();
    const camera = this.activeCamera.value;
    const ingestTransform = this._descriptor.ingestTransforms?.[0];

    if (!camera || !ingestTransform) {
      return null;
    }

    const position = convertUnityPositionVectorToTHREE(ingestTransform.position);

    const euler = convertUnityEntityRotationVectorToTHREE(
      ingestTransform.rotation ?? new THREE.Quaternion().identity(),
    );

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(euler);

    const scale = new THREE.Vector3(
      ingestTransform.scale?.x ?? 1,
      ingestTransform.scale?.y ?? 1,
      ingestTransform.scale?.z ?? 1,
    );

    // Get vertex positions in object space (1x1 plane)
    const vertexPositionOS = [
      new THREE.Vector3(0.5, -0.5, 0),
      new THREE.Vector3(-0.5, -0.5, 0),
      new THREE.Vector3(0.5, 0.5, 0),
      new THREE.Vector3(-0.5, 0.5, 0),
    ];

    const vertexPositionSS: THREE.Vector2[] = [];

    vertexPositionOS.forEach((positionOS) => {
      // Build TRS matrix
      const matrix = new THREE.Matrix4();
      matrix.compose(position, rotation, scale);

      // Transform Object2World
      const positionWS = new THREE.Vector3(positionOS.x, positionOS.y, positionOS.z);
      positionWS.applyMatrix4(matrix);

      // Project into NDC
      const positionNDC = new THREE.Vector3(positionWS.x, positionWS.y, positionWS.z);
      positionNDC.project(camera);

      // Convert NDC to Screen Space
      const positionSS = new THREE.Vector2(
        Math.round(
          ((positionNDC.x + 1) *
            (renderer.getCanvas().width / renderer.getGLRenderer().getPixelRatio())) /
            2,
        ),
        Math.round(
          (-(positionNDC.y - 1) *
            (renderer.getCanvas().height / renderer.getGLRenderer().getPixelRatio())) /
            2,
        ),
      );

      vertexPositionSS.push(positionSS);
    });

    const params = new THREE.Vector4(
      vertexPositionSS[2].x,
      vertexPositionSS[2].y,
      // z is height
      vertexPositionSS[0].y - vertexPositionSS[2].y,
      // width
      vertexPositionSS[1].x - vertexPositionSS[0].x,
    );

    return params;
  }

  private _handleLightingTypeChange(
    light: THREE.Light,
    lightingType: API.LightingType,
  ): void {
    switch (lightingType) {
      case API.LightingType.None:
        light.visible = false;
        break;

      case API.LightingType.Full:
        light.visible = light.name !== 'DefaultLight';
        break;

      case API.LightingType.HighPriorityOnly:
        light.visible = light.userData['priority'] === 0;
        break;

      case API.LightingType.DirectionalOnly:
        light.visible = light.name === 'DefaultLight';
        break;
    }
  }

  private async _loadEnvironmentMap(): Promise<void> {
    try {
      let uri = this._descriptor.renderSettings.skyboxTexturePath;

      if (uri === '') {
        uri = DEFAULT_ENVIRONMENT_MAP;
      }

      const pmremGenerator = new THREE.PMREMGenerator(
        this._graphics.getRenderer().getGLRenderer(),
      );

      const dataTexture = await loader.loadAsync(uri ?? DEFAULT_ENVIRONMENT_MAP);

      pmremGenerator.compileEquirectangularShader();
      const environmentMap = pmremGenerator.fromEquirectangular(dataTexture);

      dataTexture.dispose();

      this.environment = environmentMap.texture;

      /* Uncomment the line below if you would like to visualize the environment map as the scene skybox.
       *
       * this.background = environmentMap.texture;
       */
    } catch (error) {
      logError('Error loading environment map:', error);
    }
  }

  private _createMainCamera(): void {
    const camera = this._descriptor.cameras.at(MAIN_CAMERA_INDEX);

    if (camera === undefined) {
      throw new Error(`Arena (${this.name}) does not contain a valid main camera.`);
    }

    const drawingBufferSize = this._graphics.getRenderer().getDrawingBufferSize();

    const newCamera = new THREE.PerspectiveCamera(
      16.0,
      drawingBufferSize.width / drawingBufferSize.height,
      camera.frustum?.nearClip,
      camera.frustum?.farClip,
    );

    newCamera.name = camera.name ?? 'Undefined';

    const position = convertUnityPositionVectorToTHREE(camera.transform?.position);
    const rotation = convertUnityCameraRotationVectorToTHREE(camera.transform?.rotation);

    newCamera.position.set(position.x, position.y, position.z);
    newCamera.rotation.set(rotation.x, rotation.y, rotation.z);

    newCamera.matrixAutoUpdate = false;

    newCamera.updateMatrix();

    this._updatePhysicalCameraSettings();

    this.activeCamera.value = newCamera;
  }

  private _updatePhysicalCameraSettings(): void {
    const camera = this._descriptor.cameras.at(MAIN_CAMERA_INDEX);

    if (camera === undefined) {
      return;
    }

    // TODO: Implement missing Unity Physical Camera properties
    // - GateFit
    // - Dutch

    /* This is what a shear matrix looks like
     * | 1    yx   zx   0 |
     * |                  |
     * | xy   1    zy   0 |
     * |                  |
     * | xz   yz   1    0 |
     * |                  |
     * | 0    0    0    1 |
     *
     * If you do the math it ends up being 2.0 * shear factor in the 10th index of the projection matrix. However the
     * way Unity calculates the shear factor is dependent on multiple things. These are the Unity rendering resolution
     * aspect ratio, and the sensor size used for rendering. */

    /* This is the aspect ratio at which Unity renders the scene. Not the aspect ratio of our own camera, this is a very
     * important distinction because using Three.js' camera's aspect ratio will lead to a wrong field of view
     * calculation. */
    const broadcastWidth = camera.frustum?.broadcastWidth ?? 0.0;
    const broadcastHeight = camera.frustum?.broadcastHeight ?? 1.0;

    const aspectRatio = broadcastWidth / broadcastHeight;

    // These values are in millimeters and come from Unity's virtual cameras
    const sensorSize = new THREE.Vector2(
      camera.frustum?.sensorSize?.x ?? 0.0,
      camera.frustum?.sensorSize?.y ?? 0.0,
    );

    const ratio = aspectRatio * (sensorSize.height / sensorSize.width);

    // The focal length is also in millimeters and comes from Unity's virtual cameras
    const focalLength = camera.frustum?.focalLength ?? 1.0;

    const fieldOfView =
      THREE.MathUtils.RAD2DEG *
      2.0 *
      Math.atan(((sensorSize.x / aspectRatio) * 0.5) / focalLength);

    this.activeCamera.value.fov = fieldOfView;

    this.activeCamera.value.updateProjectionMatrix();

    // Note: This only supports horizontal gate fit for now. The rest will be added later.
    this.activeCamera.value.projectionMatrix.elements[8] =
      2.0 * (camera.frustum?.lensShift?.x ?? 0.0);

    this.activeCamera.value.projectionMatrix.elements[9] =
      2.0 * (camera.frustum?.lensShift?.y ?? 0.0) * ratio;
  }

  private _createDefaultDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
    directionalLight.name = 'DefaultLight';

    directionalLight.position.set(5.0, 10.0, 7.5);
    directionalLight.intensity = 2;
    directionalLight.castShadow = false;

    directionalLight.visible = false;

    this.add(directionalLight);

    this._destructionCallbacks.push(
      this._graphics.renderQualityObservables.lightingType.onValue((value) => {
        if (directionalLight === null) {
          return;
        }

        this._handleLightingTypeChange(directionalLight, value);
      }),
    );
  }

  private _setShadowSettings(light: THREE.Light): void {
    const shadowType = this._graphics.renderQualityObservables.shadowType.value;
    const shadowQuality = this._graphics.renderQualityObservables.shadowQuality.value;
    light.castShadow = shadowType !== API.ShadowType.Disabled;

    if (light.shadow) {
      switch (shadowQuality) {
        case API.ShadowQuality.Low:
          light.shadow.mapSize.set(512, 512);
          light.shadow.radius = 5;
          light.shadow.blurSamples = 1;
          break;
        case API.ShadowQuality.Medium:
          light.shadow.mapSize.set(1024, 1024);
          light.shadow.radius = 5;
          light.shadow.blurSamples = 5;
          break;
        case API.ShadowQuality.High:
          light.shadow.mapSize.set(1024, 1024);
          light.shadow.radius = 5;
          light.shadow.blurSamples = 25;
          break;
      }
    }

    if (light.type === 'DirectionalLight') {
      const directionalLight = light as THREE.DirectionalLight;

      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
  }

  private _createDirectionalLight(
    color: THREE.ColorRepresentation,
    intensity: number,
    position: THREE.Vector3,
    rotation: THREE.Quaternion,
    priority: number,
  ): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(color, intensity);

    light.position.set(position.x, position.y, position.z);

    light.intensity *= URP_TO_BLENDER_DIRECTIONAL_LIGHT_CONVERSION_COEFFICIENT;

    let target = new THREE.Vector3(0.0, 0.0, -1.0);

    target.applyEuler(convertUnityEntityRotationVectorToTHREE(rotation));
    target = target.normalize();

    target = target.add(light.getWorldPosition(new THREE.Vector3()));

    light.rotation.set(0.0, 0.0, 0.0);

    light.target.position.set(target.x, target.y, target.z);
    light.target.updateMatrixWorld();

    light.userData = { priority: priority };

    this._setShadowSettings(light);
    return light;
  }

  private _createPointLight(
    color: THREE.ColorRepresentation,
    intensity: number,
    range: number,
    position: THREE.Vector3,
    priority: number,
  ): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity, range, 2.0);

    light.position.set(position.x, position.y, position.z);

    light.intensity *= URP_TO_BLENDER_POINT_LIGHT_CONVERSION_COEFFICIENT;

    /*
     * const helper = new THREE.PointLightHelper(light);
     * light.add(helper);
     */

    light.userData = { priority: priority };

    this._setShadowSettings(light);
    return light;
  }

  private _createSpotlight(
    color: THREE.ColorRepresentation,
    intensity: number,
    range: number,
    innerAngle: number,
    outerAngle: number,
    position: THREE.Vector3,
    rotation: THREE.Quaternion,
    priority: number,
  ): THREE.SpotLight {
    const light = new THREE.SpotLight(
      color,
      intensity,
      range,
      THREE.MathUtils.degToRad(outerAngle * 0.5),
      1.0 -
        THREE.MathUtils.degToRad(innerAngle * 0.5) /
          THREE.MathUtils.degToRad(outerAngle * 0.5),
      2.0,
    );

    light.position.set(position.x, position.y, position.z);

    let target = new THREE.Vector3(0.0, 0.0, -1.0);

    target.applyEuler(convertUnityEntityRotationVectorToTHREE(rotation));
    target = target.normalize();

    target.multiplyScalar(light.distance);
    target = target.add(light.getWorldPosition(new THREE.Vector3()));

    light.rotation.set(0.0, 0.0, 0.0);

    light.target.position.set(target.x, target.y, target.z);
    light.target.updateMatrixWorld();

    light.intensity *= URP_TO_BLENDER_SPOTLIGHT_CONVERSION_COEFFICIENT;

    light.userData = { priority: priority };

    /*
     * const helper = new THREE.SpotLightHelper(light);
     * light.add(helper);
     */

    this._setShadowSettings(light);
    return light;
  }

  private _createLight(light: Light, index: number): Nullable<THREE.Light> {
    const color = new THREE.Color(
      light.color?.r ?? 0.0,
      light.color?.g ?? 0.0,
      light.color?.b ?? 0.0,
    );

    const intensity =
      WATTS_PER_SQUARE_METER_PER_STERADIAN_AT_555_NM_IN_CANDELAS *
      (light.intensity ?? 1.0);

    const innerAngle = light.angle?.x ?? 0.0;
    const outerAngle = light.angle?.y ?? 0.0;

    const range = light.range ?? 0.0;

    const transform = light.transform;
    const position = convertUnityPositionVectorToTHREE({
      x: transform?.position?.x ?? 0.0,
      y: transform?.position?.y ?? 0.0,
      z: transform?.position?.z ?? 0.0,
    });

    const rotation = new THREE.Quaternion(
      transform?.rotation?.x ?? 0.0,
      transform?.rotation?.y ?? 0.0,
      transform?.rotation?.z ?? 0.0,
      transform?.rotation?.w ?? 1.0,
    );

    const priority = index < 2 ? 0 : 1; // TODO: Light Priority sent from CR?
    let object3D: Nullable<THREE.Light> = null;

    switch (light.type) {
      case LightType.TYPE_DIRECTIONAL:
        object3D = this._createDirectionalLight(
          color,
          intensity,
          position,
          rotation,
          priority,
        );

        break;

      case LightType.TYPE_POINT:
        object3D = this._createPointLight(color, intensity, range, position, priority);
        break;

      case LightType.TYPE_SPOT:
        object3D = this._createSpotlight(
          color,
          intensity,
          range,
          innerAngle,
          outerAngle,
          position,
          rotation,
          priority,
        );

        break;
    }

    this._destructionCallbacks.push(
      this._graphics.renderQualityObservables.lightingType.onValue((value) => {
        if (object3D === null) {
          return;
        }

        this._handleLightingTypeChange(object3D, value);
      }),
    );

    return object3D;
  }

  public createLights(): void {
    this.removeLights();

    const lights = this._descriptor.lights;

    this._createDefaultDirectionalLight();

    for (let i = 0; i < lights.length; i++) {
      const metadata = lights[i];
      const light = this._createLight(metadata, i);

      if (light === null) {
        continue;
      }

      // Do not allow PointLights to cast shadows
      if (light instanceof THREE.PointLight) {
        light.castShadow = false;
      }

      this._lights.push(light);
      this.add(light);
    }
  }

  public removeLights(): void {
    if (this._lights) {
      for (let i = 0; i < this._lights.length; i++) {
        const light = this._lights[i];
        this.remove(light);
      }
    }

    this._lights = [];
  }

  public async load(): Promise<void> {
    await this._loadEnvironmentMap();
  }

  public update(deltaTime: number): void {
    for (const child of this.children) {
      if (child instanceof Crowd === false) {
        continue;
      }

      const crowd = child as Crowd;
      crowd.update(deltaTime);
    }

    this._updatePhysicalCameraSettings();

    const screenParams = this._getScreenParams();
    if (screenParams && !this._screenParams.value?.equals(screenParams)) {
      this.screenParams.value = screenParams;
    }
  }

  public resize(width: number, height: number): void {
    this.activeCamera.value.aspect = width / height;
  }

  public setAvatarsHidden(hidden: boolean): void {
    for (const child of this.children) {
      if (child instanceof Crowd === false) {
        continue;
      }

      child.visible = !hidden;
    }
  }

  public destruct(): void {
    for (const callback of this._destructionCallbacks) {
      callback();
    }

    this._destructionCallbacks = [];

    this.environment?.dispose();
    this.removeFromParent();
  }
}
