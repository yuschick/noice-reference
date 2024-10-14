import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';

import { LookAt } from './constraints/lookat.js';

import { ArenaState } from 'api/types';
import { CameraMode, CameraDescriptor } from 'scene/types';

export class CameraController {
  private _cameraMap: Map<CameraMode, THREE.PerspectiveCamera>;
  private _animationMap: Map<CameraMode, THREE.AnimationClip>;

  private _camera: Nullable<THREE.PerspectiveCamera>;
  public get camera(): Nullable<THREE.PerspectiveCamera> {
    return this._camera;
  }
  public set camera(value: THREE.PerspectiveCamera) {
    this._camera = value;
  }

  private _cameraMode = CameraMode.Game;
  private _targetCameraMode = CameraMode.Game;

  private _smoothTransitions = false;

  private _animationCamera: Nullable<THREE.PerspectiveCamera> = null;
  private _cameraAnimationClip: Nullable<THREE.AnimationClip> = null;
  private _cameraAnimationMixer: Nullable<THREE.AnimationMixer> = null;

  private _lookAtConstraint: LookAt;
  private _cameraPosition: THREE.Vector3 = new THREE.Vector3();
  private _cameraVelocity: THREE.Vector3 = new THREE.Vector3();
  private _cameraTargetVelocity: THREE.Vector3 = new THREE.Vector3();
  private _tickCounter = 0;

  private _intermissionCameras: CameraDescriptor[];
  private _intermissionCameraOrder: number[];
  private _intermissionCameraIndex: number;

  public get lookAtConstraint(): LookAt {
    return this._lookAtConstraint;
  }

  private _previousCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private _previousCameraRotation: THREE.Euler = new THREE.Euler(0, 0, 0);

  constructor(target: THREE.Object3D) {
    this._cameraMap = new Map<CameraMode, THREE.PerspectiveCamera>();
    this._animationMap = new Map<CameraMode, THREE.AnimationClip>();
    this._camera = null;
    this._intermissionCameras = [];
    this._intermissionCameraOrder = [];
    this._intermissionCameraIndex = 0;

    this._lookAtConstraint = new LookAt(null, target);
  }

  private _setCameraMode(cameraMode: CameraMode) {
    // This is a patch fix for camera transitions from Spotlights back to Game
    // In this case we need to wait for the Camera to settle at the end of the transition
    // before we disable smooth transitions, so add a case for that here.
    const waitForTransitionEnd =
      cameraMode === CameraMode.Game && this._cameraMode !== CameraMode.Intermission;
    if (!waitForTransitionEnd) {
      this._cameraMode = cameraMode;
      this._smoothTransitions =
        this._cameraMode === CameraMode.Spotlight ||
        this._cameraMode === CameraMode.SpotlightTransitionIn ||
        this._cameraMode === CameraMode.SpotlightTransitionOut;
    }

    this._targetCameraMode = cameraMode;

    // Reset current camera animation
    if (this._cameraAnimationMixer !== null) {
      this._cameraAnimationMixer.stopAllAction();
      this._cameraAnimationMixer.setTime(0);
      this._cameraAnimationClip = null;
      this._cameraAnimationMixer = null;
    }

    let camera: THREE.PerspectiveCamera | undefined;
    let animation: THREE.AnimationClip | undefined;
    if (this._cameraMode === CameraMode.Intermission) {
      // Generate a new order of intermission cameras
      this._intermissionCameraOrder = Array.from(
        Array(this._intermissionCameras.length).keys(),
      );
      this._shuffle(this._intermissionCameraOrder);

      // Reset indexes and get first camera
      this._intermissionCameraIndex = 0;
      const cameraIndex = this._intermissionCameraOrder[this._intermissionCameraIndex];
      const intermissionCamera = this._intermissionCameras[cameraIndex];
      camera = intermissionCamera.camera;
      animation = intermissionCamera.clip;
    } else {
      camera = this._cameraMap.get(cameraMode);
      animation = this._animationMap.get(cameraMode);
    }

    if (!camera) {
      return;
    }

    this._animationCamera = camera;
    this._cameraAnimationClip = animation ?? null;

    if (this._cameraAnimationClip) {
      this._cameraAnimationMixer = new THREE.AnimationMixer(camera);
      const action = this._cameraAnimationMixer.clipAction(this._cameraAnimationClip);
      action.reset();
      action.play();
      if (
        cameraMode === CameraMode.SpotlightTransitionIn ||
        cameraMode === CameraMode.SpotlightTransitionOut ||
        cameraMode === CameraMode.Intermission
      ) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
    }
  }

  private _nextIntermissionCamera() {
    // Reset current camera animation
    if (this._cameraAnimationMixer !== null) {
      this._cameraAnimationMixer.stopAllAction();
      this._cameraAnimationMixer.setTime(0);
      this._cameraAnimationClip = null;
      this._cameraAnimationMixer = null;
    }

    // Next camera
    this._intermissionCameraIndex++;
    if (this._intermissionCameraIndex >= this._intermissionCameraOrder.length) {
      this._intermissionCameraIndex = 0;
    }

    const cameraIndex = this._intermissionCameraOrder[this._intermissionCameraIndex];
    const intermissionCamera = this._intermissionCameras[cameraIndex];

    this._animationCamera = intermissionCamera.camera;
    this._cameraAnimationClip = intermissionCamera.clip;

    if (this._cameraAnimationClip && this._animationCamera) {
      this._cameraAnimationMixer = new THREE.AnimationMixer(this._animationCamera);
      const action = this._cameraAnimationMixer.clipAction(this._cameraAnimationClip);
      action.reset();
      action.play();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
  }

  // Durstenfeld shuffle algorithm
  private _shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  private _vectorApproximate(a: THREE.Vector3, b: THREE.Vector3): boolean {
    const epsilon = 0.0001; // Cant use actual Epsilon as OrbitControls never settles properly

    return (
      Math.abs(a.x - b.x) < epsilon &&
      Math.abs(a.y - b.y) < epsilon &&
      Math.abs(a.z - b.z) < epsilon
    );
  }

  private _eulerApproximate(a: THREE.Euler, b: THREE.Euler): boolean {
    const epsilon = 0.0001; // Cant use actual Epsilon as OrbitControls never settles properly

    return (
      Math.abs(a.x - b.x) < epsilon &&
      Math.abs(a.y - b.y) < epsilon &&
      Math.abs(a.z - b.z) < epsilon
    );
  }

  public update(deltaTime: number) {
    if (!this._camera || !this._lookAtConstraint) {
      return;
    }

    deltaTime = Math.min(deltaTime, 1.0);

    const cameraPos = this._camera.position.clone();
    const targetPos = this._lookAtConstraint.target?.position.clone();

    let targetFov = this._camera.fov;

    if (this._animationCamera !== null) {
      // Animation for the camera is optional
      if (this._cameraAnimationMixer !== null) {
        this._cameraAnimationMixer.update(deltaTime);
      }

      cameraPos.copy(this._animationCamera.position);
      if (targetPos) {
        targetPos.set(0, 0, -1);
        targetPos.applyQuaternion(this._animationCamera.quaternion);
        targetPos.setLength(5.0);
        targetPos.add(cameraPos);
      }

      targetFov = this._animationCamera.fov;

      // Automatically signal to switch to next camera mode
      if (this._cameraAnimationMixer !== null) {
        if (
          !this._cameraAnimationMixer
            .clipAction(this._cameraAnimationClip as THREE.AnimationClip)
            .isRunning()
        ) {
          if (this._cameraMode === CameraMode.SpotlightTransitionOut) {
            this._setCameraMode(CameraMode.Game);
          } else if (this._cameraMode === CameraMode.SpotlightTransitionIn) {
            this._setCameraMode(CameraMode.Spotlight);
          } else if (this._cameraMode === CameraMode.Intermission) {
            this._nextIntermissionCamera();
          }
        }
      }
    }

    if (this._smoothTransitions) {
      const LerpSpeed = 0.02;

      const tmpVelocity = cameraPos.clone();
      tmpVelocity.sub(this._camera.position);
      this._cameraVelocity.lerp(tmpVelocity, LerpSpeed);
      this._camera.position.addScaledVector(this._cameraVelocity, LerpSpeed);
      if (targetPos && this._lookAtConstraint.target) {
        tmpVelocity.copy(targetPos);
        tmpVelocity.sub(this._lookAtConstraint.target.position);
        this._cameraTargetVelocity.lerp(tmpVelocity, LerpSpeed);
        this._lookAtConstraint.target?.position.addScaledVector(
          this._cameraTargetVelocity,
          LerpSpeed,
        );
        this._camera.fov = this._camera.fov + LerpSpeed * (targetFov - this._camera.fov);
      }
    } else {
      if (targetPos && this._lookAtConstraint.target) {
        this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        this._lookAtConstraint.target?.position.set(
          targetPos.x,
          targetPos.y,
          targetPos.z,
        );
        this._camera.fov = targetFov;
      }
    }

    this._lookAtConstraint.update();
    this._camera.updateProjectionMatrix();
    this._camera.updateMatrix();

    if (
      this._vectorApproximate(this._camera.position, this._previousCameraPosition) &&
      this._eulerApproximate(this._camera.rotation, this._previousCameraRotation)
    ) {
      // Transition wait ended
      // Update cameraMode to match target and update smoothTransitions
      if (this._cameraMode !== this._targetCameraMode) {
        this._cameraMode = this._targetCameraMode;
        this._smoothTransitions =
          this._cameraMode === CameraMode.Spotlight ||
          this._cameraMode === CameraMode.SpotlightTransitionIn ||
          this._cameraMode === CameraMode.SpotlightTransitionOut;
      }
    }

    this._previousCameraPosition = this._camera.position.clone();
    this._previousCameraRotation = this._camera.rotation.clone();
  }

  public setArenaState(arenaMode: ArenaState) {
    if (arenaMode === ArenaState.Game) {
      if (
        this._cameraMode === CameraMode.Spotlight ||
        this._cameraMode === CameraMode.SpotlightTransitionIn ||
        this._cameraMode === CameraMode.SpotlightTransitionOut
      ) {
        this._setCameraMode(CameraMode.SpotlightTransitionOut);
      } else {
        this._setCameraMode(CameraMode.Game);
      }
    } else if (arenaMode === ArenaState.Spotlight) {
      if (this._cameraMode === CameraMode.Game) {
        this._setCameraMode(CameraMode.SpotlightTransitionIn);
      } else {
        this._setCameraMode(CameraMode.Spotlight);
      }
    } else if (arenaMode === ArenaState.Intermission) {
      this._setCameraMode(CameraMode.Intermission);
    }
  }

  public setMainCamera(camera: THREE.PerspectiveCamera) {
    this._camera = camera;
    this._lookAtConstraint.object = camera;
    this._animationCamera = camera;

    this._cameraPosition.copy(camera.position);
    this._cameraVelocity.set(0, 0, 0);
    this._cameraTargetVelocity.set(0, 0, 0);
    this._lookAtConstraint.object = this.camera as THREE.Object3D;

    const position = camera.position;
    if (this._lookAtConstraint.target) {
      this._lookAtConstraint.target.position.set(position.x, position.y, position.z + 5);
    }
  }

  public addCamera(descriptor: CameraDescriptor) {
    const { camera, cameraMode, clip } = descriptor;

    // Intermission cameras are randomly cycled
    // Must be handled separately
    if (cameraMode === CameraMode.Intermission) {
      this._intermissionCameras.push(descriptor);
      return;
    }

    this._animationMap.set(cameraMode, clip);
    this._cameraMap.set(cameraMode, camera);
  }
}
