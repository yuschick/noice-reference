import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import { ArenaState } from '../../api/types';

import { LookAt } from './constraints/lookat';

import { Renderer } from 'renderer';
import { ClearFlags } from 'renderer/stats/types';
import { StreamRenderHandler } from 'renderer/stream';
import { Layer } from 'scene/layer';
import { Scene } from 'scene/scene';

const { logWarn } = makeLoggers('ScreenController');

export class ScreenController {
  private _videoScreenPosition: Nullable<THREE.Vector3> = null;
  private _videoScreenSize: Nullable<THREE.Box3> = null;
  private _videoScreen: Nullable<THREE.Mesh> = null;
  private _videoScreenDummy: Nullable<THREE.Object3D> = null;
  private _cameraDistance = 0;
  private _cameraYShift = 0;
  private _cameraRotation = 0;
  private _arenaStateTimer = 0;

  private _renderer: Renderer;
  private _scene: Nullable<Scene>;
  private _layer: Nullable<Layer>;
  private _streamRenderHandler: StreamRenderHandler;
  private _arenaState: ArenaState;
  private _previousArenaState: ArenaState;
  private _lookAt: LookAt;

  public set setLookAtTarget(value: THREE.Object3D) {
    if (this._lookAt) {
      this._lookAt.target = value;
    }
  }

  private _streamMaterial: THREE.MeshBasicMaterial;
  public get streamMaterial(): THREE.MeshBasicMaterial {
    return this._streamMaterial;
  }

  private _gameScreen: Nullable<THREE.Mesh>;
  public get backScreenMesh(): Nullable<THREE.Mesh> {
    return this._gameScreen;
  }
  public set backScreenMesh(value: THREE.Mesh) {
    this._gameScreen = value;
  }

  private _enabled: boolean;
  public get enabled() {
    return this._enabled;
  }
  public set enabled(value: boolean) {
    this._setActive(value);
  }

  constructor(renderer: Renderer, target: THREE.Object3D) {
    this._renderer = renderer;
    this._streamRenderHandler = renderer.streamRenderHandler;
    this._scene = null;
    this._layer = null;
    this._gameScreen = null;
    this._arenaState = ArenaState.None;
    this._previousArenaState = ArenaState.None;
    this._streamMaterial = this._createStreamMaterial();
    this._enabled = false;
    this._lookAt = new LookAt(null, target);
  }

  private _setActive(value: boolean) {
    this._enabled = value;

    if (this._gameScreen && this._videoScreen) {
      this._gameScreen.visible = value;
      this._videoScreen.visible = value;
    }
  }

  private _createStreamMaterial(): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial({
      color: 0x111111,
      map: null,
      toneMapped: false,
    });

    // Add custom Linear > sRGB
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <tonemapping_fragment>`,
        `gl_FragColor = pow(gl_FragColor, vec4(2.2));`,
      );
    };

    return material;
  }

  private _updateStreamMaterial() {
    if (
      this._streamMaterial !== null &&
      this._streamMaterial.map !== this._streamRenderHandler.streamTexture
    ) {
      this._streamMaterial.color.set(0xffffff);
      this._streamMaterial.map = this._streamRenderHandler.streamTexture;
      this._streamMaterial.needsUpdate = true;

      if (this._streamMaterial.map) {
        this._streamMaterial.map.flipY = false;
      }
    }
  }

  private _initVideoScreen() {
    if (this._gameScreen === null) {
      logWarn('No gameScreen mesh found for video screen!');
      return;
    }

    if (!this._layer) {
      return;
    }

    this._videoScreenSize = new THREE.Box3().setFromObject(
      this._gameScreen as THREE.Object3D,
    );

    this._videoScreenPosition = new THREE.Vector3();
    this._videoScreenSize.getCenter(this._videoScreenPosition);
    this._videoScreen = new THREE.Mesh(
      new THREE.BoxGeometry(
        this._videoScreenSize.max.x - this._videoScreenSize.min.x,
        this._videoScreenSize.max.y - this._videoScreenSize.min.y,
        this._videoScreenSize.max.z - this._videoScreenSize.min.z,
      ),
      this._streamMaterial,
    );
    this._videoScreen.rotation.set(0, Math.PI, 0);

    const videoUV = this._videoScreen.geometry.getAttribute('uv');
    for (let i = 0; i < videoUV.count; i++) {
      videoUV.setY(i, 1 - videoUV.getY(i));
    }

    videoUV.needsUpdate = true;
    this._videoScreen.renderOrder = -1;
    this._layer.add(this._videoScreen);

    // Dummy is controller object
    this._videoScreenDummy = new THREE.Object3D();
    this._videoScreenDummy.scale.copy(this._videoScreen.scale);
    this._videoScreenDummy.position.copy(this._videoScreen.position);
    this._videoScreenDummy.rotation.copy(this._videoScreen.rotation);

    // Currently gameScreen is not used, only the dynamic videoScreen
    this._gameScreen.visible = false;
    this._videoScreen.visible = false;
  }

  private _updateGameStream() {
    if (!this._layer || !this._videoScreenDummy || !this._videoScreenPosition) {
      return;
    }

    this._layer.clearFlags = ClearFlags.DontClear;

    this._videoScreenDummy.scale.set(1, 1, 1);
    this._videoScreenDummy.rotation.set(0, Math.PI, 0);
    this._videoScreenDummy.position.copy(this._videoScreenPosition);
  }

  private _updateVideoStream() {
    if (
      !this._lookAt ||
      !this._scene ||
      !this._layer ||
      !this._videoScreenDummy ||
      !this._videoScreenPosition ||
      !this._videoScreenSize ||
      !this._videoScreen
    ) {
      return;
    }

    this._layer.clearFlags = ClearFlags.Depth;

    // This decides what the screen distance will be
    this._videoScreenDummy.scale.set(0.8, 0.8, 0.8);

    const camera = this._scene.camera as THREE.PerspectiveCamera;
    if (!camera || !this._lookAt.target) {
      return;
    }
    this._lookAt.object = camera as THREE.Object3D;

    const eyeDirection = camera.position.clone();

    const cameraTarget = this._lookAt.target?.position;

    eyeDirection.sub(cameraTarget);
    eyeDirection.setLength(1000.0);
    const eyePosition = this._videoScreen.position.clone();
    eyePosition.add(eyeDirection);

    this._videoScreenDummy.lookAt(eyePosition);

    const screenWidth = this._renderer.getDrawingBufferSize().width;
    const screenHeight = this._renderer.getDrawingBufferSize().height;

    // If drawing buffer scale is zero our calculations produce NaNs
    // This sets the screen scale to zero and never recovers, so handle it here
    // This happens when swkitching to Channel page
    if (screenWidth === 0 || screenHeight === 0) {
      return;
    }

    const videoWidth = 1920 * 2;
    const videoHeight = 1080 * 2;
    const videoScaleW = Math.min(1, videoWidth / screenWidth);
    const videoScaleH = (screenHeight / videoHeight) * (videoWidth / screenWidth) * 0.7;
    const videoScale = Math.min(videoScaleW, videoScaleH);

    const screenTop = 1;
    const screenLeft = -videoScale;

    const width =
      (this._videoScreenSize.max.x - this._videoScreenSize.min.x) *
      this._videoScreenDummy.scale.x;
    const height =
      (this._videoScreenSize.max.y - this._videoScreenSize.min.y) *
      this._videoScreenDummy.scale.x;

    if (this._cameraDistance === 0) {
      this._cameraDistance =
        (width * 0.5) / Math.tan(0.5 * THREE.MathUtils.DEG2RAD * camera.fov);
    }

    const cameraDirection = camera.position.clone();
    cameraDirection.sub(cameraTarget);
    cameraDirection.setLength(this._cameraDistance);

    this._videoScreenDummy.position.copy(camera.position);
    this._videoScreenDummy.position.sub(cameraDirection);

    // up vector
    const up = new THREE.Vector3(0, 1, 0);
    up.applyQuaternion(camera.quaternion);
    up.x = 0;
    up.normalize();

    // right vector
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    right.normalize();

    this._videoScreenDummy.position.addScaledVector(up, this._cameraYShift);

    const cameraViewMatrix = new THREE.Matrix4();
    camera.updateMatrixWorld(); // needed, used below
    cameraViewMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    const rotMatrix = new THREE.Matrix4();
    rotMatrix.makeRotationAxis(up, this._cameraRotation);
    this._videoScreenDummy.position.sub(camera.position);
    this._videoScreenDummy.position.applyMatrix4(rotMatrix);
    this._videoScreenDummy.position.add(camera.position);

    const leftCorner = this._videoScreenDummy.position.clone();
    leftCorner.addScaledVector(right, -width * 0.5);
    leftCorner.addScaledVector(up, height * 0.5);
    leftCorner.applyMatrix4(cameraViewMatrix);

    const rightCorner = this._videoScreenDummy.position.clone();
    rightCorner.addScaledVector(right, width * 0.5);
    rightCorner.addScaledVector(up, height * 0.5);
    rightCorner.applyMatrix4(cameraViewMatrix);

    // This adjusts the screen to be in the center of the camera view
    // For some reason it is not in the center without this
    this._cameraRotation = THREE.MathUtils.clamp(
      this._cameraRotation + (-leftCorner.x - rightCorner.x) * -0.01,
      -0.1,
      0.1,
    );

    // modify camera distance based on if leftCorner is in view at pos screenLeft
    this._cameraDistance -= (leftCorner.x - screenLeft) * (width * 0.1);
    this._cameraYShift -= (leftCorner.y - screenTop) * (height * 0.1);
  }

  public init(scene: Scene, layer: Layer) {
    if (!layer || !scene) {
      return;
    }

    this._scene = scene;
    this._layer = layer;
  }

  public initArena() {
    this._initVideoScreen();

    // TODO: Dont need this when we do the flip in fullscreen shader
    if (this._streamRenderHandler) {
      this._streamRenderHandler.streamTextureHandler.flipY = false;
    }
  }

  public update(deltaTime: number) {
    if (!this._enabled || !this._videoScreen || !this._gameScreen) {
      return;
    }

    this._lookAt.update();
    this._updateStreamMaterial();
    this._arenaStateTimer += deltaTime;

    const lerpLoops = Math.max(1, Math.round(deltaTime / (1 / 120)));
    let transitionSpeed = (1 / 60) * 3;

    // This is a hack to delay the video position change by 3 secs
    // TODO: proper place and way to do this kind of things?
    const delayTimer = this._previousArenaState === ArenaState.Spotlight ? 3 : 0;

    switch (this._arenaState) {
      case ArenaState.Game:
        this._gameScreen.visible = false;
        this._videoScreen.visible = true;

        if (this._arenaStateTimer < delayTimer) {
          this._updateGameStream();
        } else {
          this._updateVideoStream();
          transitionSpeed *= 3;
        }
        break;
      case ArenaState.Spotlight:
      case ArenaState.Intermission:
        this._gameScreen.visible = true;
        this._videoScreen.visible = false;
        this._updateGameStream();
        break;
    }

    // Tween the video screen to the new position
    if (this._videoScreen && this._videoScreenDummy) {
      const v = new THREE.Vector3();
      const q = new THREE.Quaternion();
      const s = new THREE.Vector3();

      this._videoScreenDummy.updateMatrix();
      this._videoScreenDummy.matrix.decompose(v, q, s);

      const currentQuat = new THREE.Quaternion();
      currentQuat.setFromEuler(this._videoScreen.rotation);

      for (let i = 0; i < lerpLoops; i++) {
        // Interpolate position
        this._videoScreen.position.lerp(v, transitionSpeed);
        currentQuat.slerp(q, transitionSpeed);
        this._videoScreen.rotation.setFromQuaternion(currentQuat);
        this._videoScreen.scale.lerp(s, transitionSpeed);
      }
    }
  }

  public setArenaState(arenaState: ArenaState) {
    if (this._arenaState !== arenaState) {
      this._arenaStateTimer = 0;
    }

    this._previousArenaState = this._arenaState;
    this._arenaState = arenaState;
  }
}
