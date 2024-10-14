import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import { NoiceRenderer, RendererProps } from '../renderer/renderer';
import { RenderQualityObservables } from '../renderquality';
import { ExternalRendererProps } from '../types';

import * as API from '@legacy/api';

const { logError } = makeLoggers('DirectRenderHandler');

export class DirectRenderer extends NoiceRenderer {
  private _renderer: Nullable<THREE.WebGLRenderer> = null;
  private _shadowMapDirty = false;
  private _antiAliasing: API.AntiAliasing;
  private _shadowType: API.ShadowType;
  private _renderVideoFrame = false;
  private _renderQualityObservables: RenderQualityObservables;
  private _externalProps: ExternalRendererProps;

  private _videoScene: Nullable<THREE.Scene> = null;
  private _videoCamera: Nullable<THREE.Camera> = null;
  private _videoMesh: Nullable<THREE.Mesh> = null;
  private _videoMaterial: Nullable<THREE.MeshBasicMaterial> = null;

  constructor(
    {
      canvas,
      renderQualityObservables,
      renderVideoFrame,
      dynamicFrameLimiter,
    }: RendererProps,
    externalProps?: ExternalRendererProps,
  ) {
    super(
      { canvas, renderQualityObservables, renderVideoFrame, dynamicFrameLimiter },
      externalProps?.common,
    );

    this._externalProps = externalProps ?? {};
    this._renderQualityObservables = renderQualityObservables;

    this._antiAliasing = renderQualityObservables.antiAliasing.value;
    this._shadowType = renderQualityObservables.shadowType.value;
    this._renderVideoFrame = renderVideoFrame;

    this._videoScene = new THREE.Scene();
    this._videoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this._videoCamera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);
    this._videoMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(this.getCanvas()),
      depthTest: false,
      depthWrite: false,
    });
    this._videoMaterial.toneMapped = false;
    this._videoMesh = new THREE.Mesh(geometry, this._videoMaterial);
    this._videoScene.add(this._videoMesh);

    this.unregisterCallbacks.push(
      renderQualityObservables.antiAliasing.onValue((antiAliasing) =>
        this.handleAntialiasingChange(antiAliasing),
      ),

      renderQualityObservables.shadowQuality.onValue(() =>
        this.handleShadowQualityChange(),
      ),
    );
  }

  private handleAntialiasingChange(antiAliasing: API.AntiAliasing) {
    this._antiAliasing = antiAliasing;
  }

  // Shadows
  private handleShadowQualityChange() {
    const shadowMap = this.getGLRenderer().shadowMap;

    if (!this.sandbox?.visible) {
      return;
    }

    this.sandbox.removeLights();
    shadowMap.enabled = false;
    shadowMap.needsUpdate = true;
    this._shadowMapDirty = true;
  }

  private updateShadowMap() {
    const shadowMap = this.getGLRenderer().shadowMap;
    const shadowType = this._shadowType;

    shadowMap.enabled = shadowType !== API.ShadowType.Disabled;

    switch (shadowType) {
      case API.ShadowType.Disabled:
        break;

      case API.ShadowType.Unfiltered:
        shadowMap.type = THREE.BasicShadowMap;
        break;

      case API.ShadowType.PercentageCloseFiltered:
        shadowMap.type = THREE.PCFShadowMap;
        break;

      case API.ShadowType.SoftPercentageCloseFiltered:
        shadowMap.type = THREE.PCFSoftShadowMap;
        break;

      case API.ShadowType.VariancePrefiltered:
        shadowMap.type = THREE.VSMShadowMap;
        break;

      default:
        logError(`Unknown API.ShadowType value ${shadowType}`);
    }

    if (!this.sandbox?.visible) {
      return;
    }

    this.sandbox.createLights();
  }

  // NoiceRenderer implementation
  public getGLRenderer(): THREE.WebGLRenderer {
    if (!this._renderer) {
      const renderer = new THREE.WebGLRenderer({
        canvas: this.canvas || undefined,
        alpha: this._renderVideoFrame ? false : true,
        antialias: this._antiAliasing !== API.AntiAliasing.None,
        precision: 'mediump',
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
        depth: true,
        stencil: false,
        logarithmicDepthBuffer: true,
      });

      renderer.autoClear = false;
      renderer.setClearColor(0x000000, 0.0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      renderer.outputColorSpace = THREE.SRGBColorSpace;

      if (!this._externalProps.common?.photoMode) {
        renderer.setAnimationLoop(() => this.render());
      }

      this._renderer = renderer;
    }

    return this._renderer;
  }

  public onActiveCameraChanged() {
    if (!this.sandbox?.visible || !this.sandbox.activeCamera.value) {
      return;
    }
  }

  public onStreamTextureChanged() {
    if (!this.sandbox?.visible) {
      return;
    }

    if (this._videoMaterial && this.streamTexture) {
      this._videoMaterial.map = this.streamTexture;
    }
  }

  public resize(width: number, height: number, renderScale: number): void {
    super.resize(width, height, renderScale);
  }

  public render(): void {
    if (this.renderingPaused) {
      return;
    }

    const renderFrame = this.preRender();

    if (renderFrame) {
      if (!this.sandbox?.visible) {
        return;
      }

      this.sandbox.update?.(this.frameClockHandler.deltaTime);

      const renderer = this.getGLRenderer();
      renderer.clear();

      const texture = this.streamTexture;
      if (texture && this._renderVideoFrame) {
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        const drawingBufferSize = renderer.getDrawingBufferSize(new THREE.Vector2());
        const factor =
          (texture.image.width * drawingBufferSize.height) /
          (drawingBufferSize.width * texture.image.height);

        if (this._videoMaterial && this._videoMesh) {
          this._videoMesh?.scale.set(factor, 1, 1);

          if (this._videoScene && this._videoCamera) {
            renderer.render(this._videoScene, this._videoCamera);
          }
        }
      }

      renderer.outputColorSpace = THREE.SRGBColorSpace;

      renderer.render(this.sandbox, this.sandbox.activeCamera.value);

      if (this._shadowMapDirty) {
        this.updateShadowMap();
        this._shadowMapDirty = false;
      }

      this.postRender();
    }
  }

  public destruct(): void {
    super.destruct();
  }
}
