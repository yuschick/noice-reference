import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { ArenaDescriptor, ArenaState } from '../../api/types';
import { GltfGraph } from '../utilities/gltfgraph';
import { LocatorGroup, LocatorStack } from '../utilities/locatorstack';

import { Renderer } from 'renderer';
import { RendererSettingsHandler } from 'renderer/data';
import { Layer } from 'scene/layer';
import { ArenaStateController } from 'scene/statecontrollers/arenastatecontroller';
import { CameraMode } from 'scene/types';

const { logError, logWarn } = makeLoggers('Arena');

const LOCATOR_PARENT_NAME = 'Locators';
const BACKSCREEN_MESH_NAME = 'd_BackScreen';
const INTERMISSION_CAMERA_NAME_STEM = 'Camera_Intermission';

export interface ArenaSceneProps {
  descriptor: ArenaDescriptor;
  renderer: Renderer;
  rendererSettingsHandler: RendererSettingsHandler;
  arenaStateController: ArenaStateController;
}

export class ArenaLayerBuilder {
  private _descriptor: ArenaDescriptor;
  private _pmremGenerator: THREE.PMREMGenerator;
  private _drawingBufferSize: THREE.Vector2;
  private _arenaStateController: ArenaStateController;

  private _lightmapTexture: Nullable<THREE.DataTexture>;
  private _environmentMapTexture: Nullable<THREE.Texture>;

  // Tracking for supported states
  private _locatorStates: ArenaState[];
  private _cameraStates: CameraMode[];

  private _screenMaterial: Nullable<THREE.MeshBasicMaterial> | undefined;

  private _cameraModeNames = new Map<string, CameraMode>([
    ['Camera_Game', CameraMode.Game],
    ['Camera_Spotlight', CameraMode.Spotlight],
    ['Camera_Spotlight_TransitionIn', CameraMode.SpotlightTransitionIn],
    ['Camera_Spotlight_TransitionOut', CameraMode.SpotlightTransitionOut],
    ['Camera_Intermission', CameraMode.Intermission],
  ]);

  private _locatorMap = new Map<string, ArenaState>([
    ['Locators_Game', ArenaState.Game],
    ['Locators_Spotlight', ArenaState.Spotlight],
    ['Locators_Intermission', ArenaState.Intermission],
  ]);

  public constructor(props: ArenaSceneProps) {
    const { descriptor, renderer, arenaStateController } = props;

    this._descriptor = descriptor;
    this._pmremGenerator = new THREE.PMREMGenerator(renderer.getGLRenderer());
    this._drawingBufferSize = renderer.getDrawingBufferSize();
    this._arenaStateController = arenaStateController;

    this._lightmapTexture = null;
    this._environmentMapTexture = null;

    this._locatorStates = [];
    this._cameraStates = [];
  }

  private async _loadLightmap() {
    const loader = new EXRLoader();
    await loader
      .loadAsync(this._descriptor.lightmapUrl)
      .then((texture) => {
        texture.channel = 1;
        texture.flipY = !texture.flipY;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        this._lightmapTexture = texture;
        return;
      })
      .catch((error) => logError(`Error loading Lightmap: ${error}`));
  }

  private async _loadEnvironmentMap(layer: Layer) {
    const loader = new EXRLoader();
    await loader
      .loadAsync(this._descriptor.environmentMapUrl)
      .then((texture) => {
        this._pmremGenerator.compileEquirectangularShader();
        const environmentMap = this._pmremGenerator.fromEquirectangular(texture);
        texture.dispose();
        this._environmentMapTexture = environmentMap.texture;

        layer.environment = this._environmentMapTexture;
        layer.background = this._environmentMapTexture;
        return;
      })
      .catch((error) => logError(`Error loading Environment Map: ${error}`));
  }

  private async _loadArenaGlb(layer: Layer) {
    const loader = new GLTFLoader();
    await loader
      .loadAsync(this._descriptor.sceneUrl)
      .then((gltf) => {
        const graph = new GltfGraph(gltf);
        const animations = gltf.animations;
        const backScreenMesh = gltf.scene.getObjectByName(BACKSCREEN_MESH_NAME);
        if (backScreenMesh && backScreenMesh instanceof THREE.Mesh) {
          this._screenMaterial = backScreenMesh.material as THREE.MeshBasicMaterial;
          this._processStreamMesh(backScreenMesh as THREE.Mesh);
        }
        graph.traverseGraphDown((object, parent) => {
          this._processObject(object, parent, layer, animations);
        });

        layer.add(gltf.scene);
        layer.animations = animations;
        return;
      })
      .catch((error) => logError(`Error loading GLB: ${error}`));
  }

  private _processObject(
    object: THREE.Object3D,
    parent: THREE.Object3D | null,
    layer: Layer,
    animations: THREE.AnimationClip[],
  ) {
    object.matrixAutoUpdate = false;
    object.matrixWorldAutoUpdate = false;
    object.updateMatrixWorld();

    this._processObjectFlags(object, parent);

    if (object.name === LOCATOR_PARENT_NAME) {
      this._processLocators(object);
    } else if (object instanceof THREE.Light) {
      this._processLight(object as THREE.Light);
    } else if (object instanceof THREE.Mesh) {
      this._processMesh(object as THREE.Mesh);
    } else if (object instanceof THREE.PerspectiveCamera) {
      this._processCamera(object as THREE.PerspectiveCamera, layer, animations);
    }
  }

  private _processObjectFlags(object: THREE.Object3D, parent: THREE.Object3D | null) {
    const parentHidden = parent ? !parent.visible : false;
    if (object.name.startsWith(`h_`) || parentHidden) {
      object.visible = false;
    }

    const parentDynamic = parent ? parent.userData['dynamic'] : false;
    if (object.name.startsWith(`d_`) || parentDynamic) {
      object.userData['dynamic'] = true;
    }
  }

  private _processLocators(object: THREE.Object3D) {
    const processLocatorGroup = (
      root: THREE.Object3D,
      groupIndex: number,
    ): LocatorGroup => {
      const slotDatas = [];
      const slotCount = root.children.length;

      for (let i = 0; i < slotCount; i++) {
        const slotObject = root.children[i];
        slotDatas.push({
          slotIndex: i,
          userId: null,
          transform: {
            position: slotObject.position,
            rotation: slotObject.rotation,
            scale: slotObject.scale,
          },
        });
      }

      return {
        groupIndex,
        teamId: null,
        slots: slotDatas,
        userIds: [],
      };
    };

    const processLocatorStack = (root: THREE.Object3D, arenaState: ArenaState) => {
      const useGroups = arenaState !== ArenaState.Intermission;
      const groupDatas = [];

      if (useGroups) {
        for (let g = 0; g < root.children.length; g++) {
          const group = processLocatorGroup(root.children[g], g);
          groupDatas.push(group);
        }
      } else {
        const group = processLocatorGroup(root, 0);
        groupDatas.push(group);
      }

      const locatorStack = new LocatorStack(groupDatas, useGroups);
      this._arenaStateController.locatorStacks.set(arenaState, locatorStack);
    };

    const locatorRoots = object.children;
    for (let i = 0; i < locatorRoots.length; i++) {
      const child = locatorRoots[i];

      const state = this._locatorMap.get(child.name);
      if (state) {
        processLocatorStack(child, state);

        if (!this._locatorStates.includes(state)) {
          this._locatorStates.push(state);
        }
      }
    }
  }

  private _processLight(light: THREE.Light) {
    light.visible = false;
  }

  private _processMesh(mesh: THREE.Mesh) {
    if (mesh.material && mesh.material === this._screenMaterial) {
      mesh.material = this._arenaStateController.screenController.streamMaterial;
    }

    if (!mesh.userData['dynamic']) {
      this._processStaticMesh(mesh);
      return;
    }
  }

  private _processStreamMesh(mesh: THREE.Mesh) {
    const streamMaterial = this._arenaStateController.screenController.streamMaterial;
    if (streamMaterial) {
      mesh.material = streamMaterial;
    }

    this._arenaStateController.screenController.backScreenMesh = mesh;
  }

  private _processStaticMesh(mesh: THREE.Mesh) {
    if (!mesh.material) {
      return;
    }

    // Process Materials
    const materials = (
      Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    ) as THREE.MeshStandardMaterial[];

    for (let i = 0; i < materials.length; i++) {
      const material = materials[i];
      const newMaterial = new THREE.MeshLambertMaterial();
      newMaterial.copy(material);
      newMaterial.lightMap = this._lightmapTexture ?? null;
      newMaterial.lightMapIntensity = 2.0;
      newMaterial.needsUpdate = true;

      if (Array.isArray(mesh.material)) {
        mesh.material[i] = newMaterial;
      } else {
        mesh.material = newMaterial;
      }
    }
  }

  private _processCamera(
    camera: THREE.PerspectiveCamera,
    layer: Layer,
    animations: THREE.AnimationClip[],
  ) {
    let cameraName = camera.name;
    if (camera.name.includes(INTERMISSION_CAMERA_NAME_STEM)) {
      cameraName = INTERMISSION_CAMERA_NAME_STEM;
    }

    const cameraMode = this._cameraModeNames.get(cameraName);
    if (cameraMode === undefined) {
      return;
    }

    if (!this._cameraStates.includes(cameraMode)) {
      this._cameraStates.push(cameraMode);
    }

    // Game Camera must be duplicated and handled separately
    // Note that will still add the original camera to the CameraController
    // This is because we still use the original camera to set the state
    if (cameraMode === CameraMode.Game) {
      const mainCamera = this._duplicateCamera(camera, this._drawingBufferSize);
      layer.add(mainCamera);
      this._arenaStateController.cameraController.setMainCamera(mainCamera);
    }

    const clip = THREE.AnimationClip.findByName(animations, camera.name);
    this._arenaStateController.cameraController.addCamera({ camera, cameraMode, clip });
  }

  private _duplicateCamera(
    camera: THREE.PerspectiveCamera,
    drawingBufferSize: THREE.Vector2,
  ): THREE.PerspectiveCamera {
    // Create Camera
    const fov = camera.fov;
    const aspect = drawingBufferSize.width / drawingBufferSize.height;
    const near = camera.near;
    const far = camera.far;
    const newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // Set props
    newCamera.name = `Camera_Game`;
    newCamera.matrixAutoUpdate = false;
    newCamera.filmOffset = 0.1;
    newCamera.filmGauge = 35;
    newCamera.zoom = 1.2;

    // Set Transform
    const position = camera.position;
    const rotation = camera.rotation;
    newCamera.position.set(position.x, position.y, position.z);
    newCamera.rotation.set(rotation.x, rotation.y, rotation.z);
    newCamera.updateMatrix();

    return newCamera;
  }

  private _getSupportedStates(): ArenaState[] {
    const supportedStates: ArenaState[] = [];
    const missingStates: string[] = [];

    // Game
    if (
      this._locatorStates.includes(ArenaState.Game) &&
      this._cameraStates.includes(CameraMode.Game)
    ) {
      supportedStates.push(ArenaState.Game);
    } else {
      missingStates.push('Game');
    }

    // Intermission
    if (
      this._locatorStates.includes(ArenaState.Intermission) &&
      this._cameraStates.includes(CameraMode.Intermission)
    ) {
      supportedStates.push(ArenaState.Intermission);
    } else {
      missingStates.push('Intermission');
    }

    // Spotlight
    if (
      this._locatorStates.includes(ArenaState.Spotlight) &&
      this._cameraStates.includes(CameraMode.Spotlight) &&
      this._cameraStates.includes(CameraMode.SpotlightTransitionIn) &&
      this._cameraStates.includes(CameraMode.SpotlightTransitionOut)
    ) {
      supportedStates.push(ArenaState.Spotlight);
    } else {
      missingStates.push('Spotlight');
    }

    if (missingStates.length > 0) {
      logWarn(
        `Loaded Arema (${this._descriptor.name} ${
          this._descriptor.version
        }) does not support ArenaStates:\n${missingStates.join('\n')}`,
      );
    }

    return supportedStates;
  }

  public async getLayer(): Promise<Layer> {
    const layer = new Layer();
    layer.name = this._descriptor.name;

    await this._loadEnvironmentMap(layer);
    await this._loadLightmap();
    await this._loadArenaGlb(layer);

    const supportedStates = this._getSupportedStates();
    this._arenaStateController.setSupportedStates(supportedStates);

    return layer;
  }
}
