import { Nullable } from '@noice-com/utils';
import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';

import { FullscreenStreamShader } from '../shaders/fullscreenstreamshader';

import { Renderer } from 'renderer';
import { Scene } from 'scene/scene';

export class FullscreenController {
  private _renderer: Renderer;
  private _scene: Nullable<Scene>;
  private _camera: THREE.OrthographicCamera;
  private _material: THREE.ShaderMaterial;
  private _mesh: FullScreenQuad;

  private _enabled: boolean;
  public get enabled() {
    return this._enabled;
  }
  public set enabled(value: boolean) {
    this._setActive(value);
  }

  constructor(renderer: Renderer) {
    this._renderer = renderer;
    this._scene = null;
    this._camera = this._createCamera();
    this._material = this._createMaterial();
    this._mesh = new FullScreenQuad(this._material);
    this._enabled = false;
  }

  private _setActive(value: boolean) {
    this._enabled = value;

    if (value) {
      this._scene?.setMainCamera(this._camera);
    }
  }

  private _createCamera(): THREE.OrthographicCamera {
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    return camera;
  }

  private _createMaterial(): THREE.ShaderMaterial {
    const shader = FullscreenStreamShader;
    const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    return material;
  }

  public init(scene: Scene) {
    if (!scene) {
      return;
    }

    this._scene = scene;
  }

  public update(_deltaTime: number) {
    if (!this._enabled) {
      return;
    }

    const drawingBufferSize = this._renderer.getDrawingBufferSize();
    const streamRenderHandler = this._renderer.streamRenderHandler;
    if (streamRenderHandler.streamTexture) {
      const texture = streamRenderHandler.streamTexture;
      const uniforms = this._material.uniforms;

      uniforms['tStream'].value = texture;

      uniforms['textureParams'].value = new THREE.Vector4(
        texture.image.width,
        texture.image.height,
        texture.image.width / texture.image.height,
        0,
      );

      uniforms['drawingBufferParams'].value = new THREE.Vector4(
        drawingBufferSize.width,
        drawingBufferSize.height,
        drawingBufferSize.width / drawingBufferSize.height,
        0,
      );

      const glRenderer = this._renderer.getGLRenderer();
      this._mesh?.render(glRenderer);
    }
  }
}
