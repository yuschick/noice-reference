import { Nullable, Observable, Optional, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { NoiceOrbitControls } from '../../../js/NoiceOrbitControls.js';
import { Graphics } from '../../graphics';

import { Avatar } from '@legacy/entities';
import { disposeObject } from '@legacy/helpers/mesh';
import { Sandbox } from '@legacy/sandbox';
import { AvatarViewerControls } from '@legacy/sandboxes/avatar-viewer/avatar-viewer-controls';
import { KHRLightsAreaPlugin } from '@legacy/utilities';

export const AVATAR_VIEWER_LIGHTING = `https://client-assets-cdn.gcp.dev.noice.com/proto/assets/avatar-selector/lighting-with-branding-shadows-v4.glb`;
export const AVATAR_VIEWER_ENVIRONMENT_MAP = `https://client-assets-cdn.gcp.dev.noice.com/proto/environment-maps/avatar-editor-background-v2.exr`;
export const AVATAR_VIEWER_ENVIRONMENT_MESH = `https://client-assets-cdn.gcp.dev.noice.com/proto/assets/avatar-selector/avatar-editor-background-mesh-v3.glb`;
export const AVATAR_VIEWER_ENVIRONMENT_SHADOWCATCHER = `https://client-assets-cdn.gcp.dev.noice.com/proto/assets/avatar-selector/avatar-editor-shadowcatcher.glb`;

// These default values need to be like this now for AvatarSelector
const CAMERA_DEFAULT_DISTANCE = 6.0;
const CAMERA_DEFAULT_Y = 0.85;
const CAMERA_MIN_DISTANCE = 2.75;
const CAMERA_MAX_DISTANCE = 6.0;

const { logInfo, logError } = makeLoggers('AvatarViewer');

export interface AnimatableObject extends THREE.Object3D {
  update?(deltaTime: number): void;
  animate?(deltaTime: number): void;
}

export interface AvatarViewerProps {
  loadShadowCatcher: boolean;
  loadBackgroundMesh: boolean;
  applyShoeOffset: boolean;
  setCameraYForDistance?: boolean;
}

export class AvatarViewer extends THREE.Scene implements Sandbox {
  protected _graphics: Graphics;
  protected _props: AvatarViewerProps;

  private _camera = new Observable(new THREE.PerspectiveCamera());
  private _avatar?: AnimatableObject;
  private _orbitControls: NoiceOrbitControls;
  private _avatarViewerControls: AvatarViewerControls;
  private _cameraZoomOutPos: THREE.Vector3;
  private _cameraTargetPos: THREE.Vector3;
  private _lightGroup: Nullable<THREE.Group> = null;
  private _shadowCatcher: Nullable<THREE.Group> = null;
  private _backgroundMesh: Nullable<THREE.Group> = null;

  constructor(
    graphics: Graphics,
    props: AvatarViewerProps = {
      loadBackgroundMesh: true,
      loadShadowCatcher: true,
      applyShoeOffset: false,
      setCameraYForDistance: false,
    },
  ) {
    super();

    this._graphics = graphics;
    this._props = props;

    this.fog = new THREE.Fog(new THREE.Color(0.5, 0.2, 2), 1, 100);

    const camera = this._createCamera();
    camera.position.set(0, CAMERA_DEFAULT_Y, CAMERA_DEFAULT_DISTANCE);
    this.activeCamera.value = camera;

    this._cameraZoomOutPos = new THREE.Vector3(
      0,
      CAMERA_DEFAULT_Y,
      CAMERA_DEFAULT_DISTANCE,
    );

    this._cameraTargetPos = new THREE.Vector3(0, CAMERA_DEFAULT_Y, 0);

    this._orbitControls = this._createOrbitControls();
    this._avatarViewerControls = this._createAvatarViewerControls();

    this._loadEnvironmentMap(AVATAR_VIEWER_ENVIRONMENT_MAP);
    this._loadLighting(AVATAR_VIEWER_LIGHTING);

    if (props?.loadBackgroundMesh) {
      this._loadBackgroundMesh(AVATAR_VIEWER_ENVIRONMENT_MESH);
    }

    if (props?.loadShadowCatcher) {
      this._loadShadowCatcher(AVATAR_VIEWER_ENVIRONMENT_SHADOWCATCHER);
    }
  }

  public get cameraZoomOutPos(): THREE.Vector3 {
    return this._cameraZoomOutPos;
  }

  public set cameraZoomOutPos(pos: THREE.Vector3) {
    this._cameraZoomOutPos = pos;
  }

  public get cameraTargetPos(): THREE.Vector3 {
    return this._cameraTargetPos;
  }

  public set cameraTargetPos(pos: THREE.Vector3) {
    this._cameraTargetPos = pos;
  }

  public get activeCamera(): Observable<THREE.PerspectiveCamera> {
    return this._camera;
  }

  public get avatar(): Optional<AnimatableObject> {
    return this._avatar;
  }

  public get orbitControls(): NoiceOrbitControls {
    return this._orbitControls;
  }

  public get usePostProcessMask(): boolean {
    return false;
  }

  private _loadEnvironmentMap(url: string): void {
    if (!url) {
      return;
    }

    try {
      const pmremGenerator = new THREE.PMREMGenerator(
        this._graphics.getRenderer().getGLRenderer(),
      );

      const loader = new EXRLoader();

      loader.load(url, (dataTexture) => {
        pmremGenerator.compileEquirectangularShader();
        const environmentMap = pmremGenerator.fromEquirectangular(dataTexture);

        dataTexture.dispose();

        this.environment = environmentMap.texture;

        /* Uncomment the line below if you would like to visualize the environment map as the scene skybox.
         *
         * this.background = environmentMap.texture;
         */
      });

      logInfo(`Loaded environment map.`);
    } catch (e) {
      logError(`Error loading environment map:`, e);
    }
  }

  private _removeEnvironmentMap(): void {
    if (!this.environment) {
      return;
    }

    this.environment.dispose();
    this.environment = null;
  }

  private _loadLighting(url: string): void {
    if (!url) {
      return;
    }

    const loader = new GLTFLoader();
    loader.register((parser) => new KHRLightsAreaPlugin(parser));

    loader.load(url, (gltf) => {
      const scene = gltf.scene;

      scene.traverse((entity) => {
        if (entity instanceof THREE.Light === false) {
          return;
        }

        const light = entity as THREE.Light;

        light.intensity *= 0.00146412884;

        if (entity instanceof THREE.RectAreaLight === true) {
          return;
        }

        if (light.name === 'key-light') {
          const keylight = light as THREE.SpotLight;
          keylight.castShadow = true;

          keylight.shadow.mapSize.set(2048, 2048);
          keylight.shadow.bias = -0.0001;
          keylight.shadow.camera.fov = 15;
          keylight.shadow.blurSamples = 32;
        } else if (light.name === 'rim-light') {
          const spotLight = light as THREE.SpotLight;
          spotLight.distance = 2.4;
          spotLight.castShadow = true;

          spotLight.shadow.mapSize.set(512, 512);
          spotLight.shadow.bias = -0.000125;
          spotLight.shadow.camera.fov = 15;
          spotLight.shadow.blurSamples = 16;
        }

        /*
         * const helper = new THREE.SpotLightHelper(light);
         * this.add(helper);
         */
      });

      this._lightGroup = scene;
      this.add(scene);
    });
  }

  private _removeLighting() {
    if (!this._lightGroup) {
      return;
    }

    disposeObject(this._lightGroup);
    this._lightGroup = null;
  }

  private _loadBackgroundMesh(url: string): void {
    if (!url) {
      return;
    }

    const loader = new GLTFLoader();

    loader.load(url, (gltf) => {
      const scene = gltf.scene;

      scene.traverse((entity) => {
        if (entity instanceof THREE.Mesh === false) {
          return;
        }

        const material = entity.material as THREE.Material;
        material.depthWrite = false;
      });

      this._backgroundMesh = scene;
      this.add(scene);
    });
  }

  private _removeBackgroundMesh(): void {
    if (!this._backgroundMesh) {
      return;
    }

    disposeObject(this._backgroundMesh);
    this._backgroundMesh = null;
  }

  private _loadShadowCatcher(url: string): void {
    if (!url) {
      return;
    }

    const loader = new GLTFLoader();

    loader.load(url, (gltf) => {
      const scene = gltf.scene;

      scene.traverse((entity) => {
        if (entity instanceof THREE.Mesh === false) {
          return;
        }

        const mesh = entity as THREE.Mesh;

        mesh.receiveShadow = true;
        mesh.material = new THREE.ShadowMaterial();
        mesh.material.opacity = 0.6;
      });

      this._shadowCatcher = scene;
      this.add(scene);
    });
  }

  private _removeShadowCatcher(): void {
    if (!this._shadowCatcher) {
      return;
    }

    disposeObject(this._shadowCatcher);
    this._shadowCatcher = null;
  }

  private _createCamera(): THREE.PerspectiveCamera {
    const graphics = this._graphics;
    const drawingBufferSize = graphics.getRenderer().getDrawingBufferSize();

    const aspectRatio = drawingBufferSize.width / drawingBufferSize.height;

    return new THREE.PerspectiveCamera(25.0, aspectRatio, 0.1, 50.0);
  }

  private _createOrbitControls(): NoiceOrbitControls {
    const canvas = this._graphics.getRenderer().getCanvas();
    const camera = this.activeCamera.value;
    const orbitControls = new NoiceOrbitControls(camera, canvas);

    orbitControls.enablePan = false;
    orbitControls.enableRotate = true;
    orbitControls.enableZoom = false;

    orbitControls.minDistance = CAMERA_MIN_DISTANCE;
    orbitControls.maxDistance = CAMERA_MAX_DISTANCE;

    orbitControls.minPolarAngle = Math.PI * 0.5;
    orbitControls.maxPolarAngle = Math.PI * 0.5;

    orbitControls.target.y = camera.position.y;

    orbitControls.update();

    return orbitControls;
  }

  private _createAvatarViewerControls(): AvatarViewerControls {
    const canvas = this._graphics.getRenderer().getCanvas();
    const avatarViewerControls = new AvatarViewerControls(this._avatar, canvas);

    avatarViewerControls.enabled = false;

    return avatarViewerControls;
  }

  public setAvatar(avatar: Optional<AnimatableObject>, dispose = true) {
    if (this._avatar) {
      if (dispose) {
        disposeObject(this._avatar);
      } else {
        this._avatar.removeFromParent();
      }
    }

    this._avatar = avatar;

    if (!this._avatar) {
      return;
    }

    Avatar.ConfigureMaterialProperties(this._avatar);

    if (this._props?.applyShoeOffset) {
      Avatar.ApplyShoeOffset(this._avatar);
    }

    this.add(this._avatar);
  }

  public resize(width: number, height: number): void {
    this.activeCamera.value.aspect = width / height;
    this.activeCamera.value.updateProjectionMatrix();
    this._orbitControls.update();
  }

  public getCameraYForDistance(distance: number) {
    const zoom =
      (distance - this._orbitControls.minDistance) /
      (this._orbitControls.maxDistance - this._orbitControls.minDistance);

    return THREE.MathUtils.lerp(this._cameraTargetPos.y, this._cameraZoomOutPos.y, zoom);
  }

  public update(deltaTime: number): void {
    const avatar = this._avatar;

    if (!avatar) {
      return;
    }

    avatar.animate?.(deltaTime);
    avatar.update?.(deltaTime);

    let forward = new THREE.Vector3();
    this.activeCamera.value.getWorldDirection(forward);
    forward = new THREE.Vector3(-forward.x, 0, -forward.z);

    if (this._lightGroup) {
      this._lightGroup.lookAt(forward);
    }

    if (this._backgroundMesh) {
      this._backgroundMesh.lookAt(forward);
    }

    if (this._props.setCameraYForDistance) {
      this._orbitControls.target.y = this.getCameraYForDistance(
        this._orbitControls.getDistance(),
      );
    }
  }

  public loadLighting(url: string): void {
    this._removeLighting();
    this._loadLighting(url);
  }

  public loadEnvironmentMap(url: string): void {
    this._removeEnvironmentMap();
    this._loadEnvironmentMap(url);
  }

  public loadBackgroundMesh(url: string): void {
    this._removeBackgroundMesh();
    this._loadBackgroundMesh(url);
  }

  public loadShadowCatcher(url: string): void {
    this._removeShadowCatcher();
    this._loadShadowCatcher(url);
  }

  public createLights(): void {}

  public removeLights(): void {}

  public destruct(): void {
    this._removeBackgroundMesh();
    this._removeEnvironmentMap();
    this._removeShadowCatcher();

    this._orbitControls.dispose();
    this._avatarViewerControls.dispose();

    if (this._avatar) {
      disposeObject(this._avatar);
    }

    this._avatar = undefined;
  }
}
