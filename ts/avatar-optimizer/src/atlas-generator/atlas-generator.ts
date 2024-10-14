import { AvatarBuilder, Helpers } from '@noice-com/avatar-builder';
import { addShaderExtension } from '@noice-com/avatar-builder/src/helpers';
import * as THREE from 'three';

import { createAtlasMaterial, createDilationMaterial } from './materials';

interface RendererState {
  renderTarget: THREE.WebGLRenderTarget | null;
  autoClear: boolean;
  clearAlpha: number;
  clearColor: THREE.Color;
}

export class AtlasGenerator {
  private _width: number;
  private _height: number;
  private _renderTarget: THREE.WebGLRenderTarget;
  private _camera: THREE.OrthographicCamera;
  private _oldRendererState: RendererState | null = null;

  public constructor(width: number, height: number) {
    this._renderTarget = new THREE.WebGLRenderTarget(width, height);
    this._renderTarget.texture.generateMipmaps = false;

    this._camera = new THREE.OrthographicCamera();

    this._width = width;
    this._height = height;
  }

  private _pushRendererState(
    renderer: THREE.WebGLRenderer,
    clearColor: THREE.ColorRepresentation,
    clearAlpha: number,
  ) {
    const oldClearColor: THREE.Color = new THREE.Color();

    renderer.getClearColor(oldClearColor);

    this._oldRendererState = {
      renderTarget: renderer.getRenderTarget(),
      autoClear: renderer.autoClear,
      clearColor: oldClearColor,
      clearAlpha: renderer.getClearAlpha(),
    };

    renderer.setRenderTarget(this._renderTarget);
    renderer.autoClear = false;
    renderer.setClearColor(clearColor, clearAlpha);
  }

  private _popRendererState(renderer: THREE.WebGLRenderer) {
    if (this._oldRendererState === null) {
      return;
    }

    renderer.setRenderTarget(this._oldRendererState.renderTarget);
    renderer.autoClear = this._oldRendererState.autoClear;
    renderer.setClearColor(
      this._oldRendererState.clearColor,
      this._oldRendererState.clearAlpha,
    );
  }

  public async renderAtlas(
    renderer: THREE.WebGLRenderer,
    skinnedMeshes: THREE.SkinnedMesh[],
    mapType: Helpers.MapType,
    textureCache: AvatarBuilder.TextureCache,
  ): Promise<THREE.DataTexture> {
    const scene = new THREE.Scene();
    scene.background = null;

    this._pushRendererState(renderer, 0x000000, 0);

    // Render empty scene before rendering the atlases
    // Fixes empty base color map issue with Direct rendering
    renderer.render(scene, this._camera);

    for (const skinnedMesh of skinnedMeshes) {
      const srcMaterial = skinnedMesh.material as THREE.MeshStandardMaterial;
      const srcTexture = Helpers.getTexture(srcMaterial, mapType);

      if (!srcTexture) {
        continue;
      }

      srcTexture.colorSpace = THREE.LinearSRGBColorSpace;
      srcTexture.anisotropy = 1;
      srcTexture.minFilter = THREE.LinearFilter;
      srcTexture.magFilter = THREE.LinearFilter;
      srcTexture.generateMipmaps = false;
      srcTexture.premultiplyAlpha = false;
      srcTexture.needsUpdate = true;

      const material = createAtlasMaterial(srcTexture);
      const emissiveMap = srcMaterial.emissiveMap;

      if (mapType === Helpers.MapType.BaseMap) {
        const colorProps = skinnedMesh.userData[AvatarBuilder.COLOR_PROPS_KEY];

        if (colorProps !== undefined) {
          const lutUrl = colorProps['lutUrl'] as string;
          const color = colorProps['color'] as string;
          const maskedColors = colorProps['maskedColors'] as string[];

          const useLut = lutUrl?.length > 0;
          const useTint = color?.length > 0;
          const useMaskedTint = maskedColors?.length > 0;

          if (useLut) {
            const lut = await textureCache.get(lutUrl);

            if (lut) {
              addShaderExtension(material, 'lut', {
                injector: (shader) => {
                  Helpers.injectSkinColorLUTShader(
                    shader,
                    Helpers.ShaderInjectionTarget.RawShader,
                    lut,
                  );
                },
              });
            }
          } else if (useTint) {
            addShaderExtension(material, 'tint', {
              injector: (shader) => {
                Helpers.injectTintShader(
                  shader,
                  Helpers.ShaderInjectionTarget.RawShader,
                  new THREE.Color(color),
                );
              },
            });
          } else if (useMaskedTint) {
            addShaderExtension(material, 'masked-tint', {
              injector: (shader) => {
                Helpers.injectMaskedTintShader(
                  shader,
                  Helpers.ShaderInjectionTarget.RawShader,
                  [new THREE.Color(maskedColors[0]), new THREE.Color(maskedColors[1])],
                  emissiveMap,
                );
              },
            });
          }
        }
      }

      const mesh = new THREE.Mesh(skinnedMesh.geometry, material);
      mesh.frustumCulled = false;

      scene.add(mesh);
    }

    renderer.clear();
    renderer.render(scene, this._camera);

    // Can't use render texture directly on the mesh because that type of texture cannot be exported
    const renderTargetData = new Uint8Array(4 * this._width * this._height);
    renderer.readRenderTargetPixels(
      this._renderTarget,
      0,
      0,
      this._width,
      this._height,
      renderTargetData,
    );

    const atlasTexture = new THREE.DataTexture(
      renderTargetData,
      this._width,
      this._height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.Texture.DEFAULT_MAPPING,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter,
      1,
      THREE.LinearSRGBColorSpace,
    );

    atlasTexture.generateMipmaps = false;
    atlasTexture.premultiplyAlpha = false;
    atlasTexture.needsUpdate = true;

    this._popRendererState(renderer);

    scene.traverse((obj) => {
      if (Helpers.isMesh(obj)) {
        Helpers.disposeMesh(obj);
      }
    });

    return atlasTexture;
  }

  public dilate(
    renderer: THREE.WebGLRenderer,
    atlasTexture: THREE.DataTexture,
  ): THREE.DataTexture {
    const scene = new THREE.Scene();
    scene.background = null;

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 1, 1),
      createDilationMaterial(
        atlasTexture,
        new THREE.Vector2(1.0 / this._width, 1.0 / this._height),
      ),
    );

    scene.add(quad);

    this._pushRendererState(renderer, 0x000000, 0);

    renderer.clear();
    renderer.render(scene, this._camera);

    const renderTargetData = new Uint8Array(4 * this._width * this._height);
    renderer.readRenderTargetPixels(
      this._renderTarget,
      0,
      0,
      this._width,
      this._height,
      renderTargetData,
    );

    const dilatedAtlasTexture = new THREE.DataTexture(
      renderTargetData,
      this._width,
      this._height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.Texture.DEFAULT_MAPPING,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter,
      1,
      THREE.LinearSRGBColorSpace,
    );

    dilatedAtlasTexture.generateMipmaps = false;
    dilatedAtlasTexture.premultiplyAlpha = false;
    dilatedAtlasTexture.needsUpdate = true;

    this._popRendererState(renderer);

    scene.traverse((obj) => {
      if (Helpers.isMesh(obj)) {
        Helpers.disposeMesh(obj);
      }
    });

    return dilatedAtlasTexture;
  }

  public dispose() {
    this._renderTarget?.dispose();
  }
}
