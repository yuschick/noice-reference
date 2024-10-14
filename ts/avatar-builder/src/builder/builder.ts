import { makeLoggers, Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { Avatar } from '@noice-com/web-renderer/src/legacy';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
  getFirstChildBone,
  getFirstSkinnedMesh,
  getSkinnedMeshes,
  getBufferAttributeOrThrowError,
  disposeSkinnedMesh,
  injectTintShader,
  injectSkinColorLUTShader,
  injectMaskedTintShader,
  ShaderInjectionTarget,
  updateSkinColorLUTShader,
  updateTintShader,
  updateMaskedTintShader,
  sampleExr,
  disposeObject,
  getBoneNameToIndexMapping,
  getBoneIndexToNameMapping,
  weldSkinningData,
  removeBlendShapes,
  offsetVertices,
  weldTangentsAndNormals,
  weldPositions,
  getDefaultMapURL,
  MapType,
  getExtendedShader,
  addShaderExtension,
} from '../helpers';

import { AVERAGE_MESH_HIP_Y_POSITION, DefaultBuilderSettings } from './defaults';
import { TextureCache } from './texture';
import {
  AvatarConfig,
  BodyComposition,
  BuilderSettings,
  AvatarPartType,
  SourceAsset,
  SkinProps,
  ColorProps,
} from './types';

export const COLOR_PROPS_KEY = 'colorProps';

const { logWarn, logInfoVerbose } = makeLoggers('AvatarBuilder');

export class Builder {
  private _loader: GLTFLoader;
  private _exrLoader: EXRLoader;
  private _avatarConfig: Nullable<AvatarConfig>;
  private _bodyComposition: Nullable<BodyComposition>;

  private _textureLoader: THREE.TextureLoader;
  private _textureCache: TextureCache;

  private _isConstructing: boolean;

  public constructor(
    loader: GLTFLoader,
    exrLoader: EXRLoader,
    textureCache?: TextureCache,
  ) {
    this._loader = loader;
    this._exrLoader = exrLoader;
    this._avatarConfig = null;
    this._bodyComposition = null;
    this._textureLoader = new THREE.TextureLoader();
    this._textureCache = textureCache
      ? textureCache
      : new TextureCache(this._textureLoader);
    this._isConstructing = false;
  }

  private async loadAsset(
    assetUri: string,
    skinnedMeshName?: string,
  ): Promise<SourceAsset> {
    const gltf = await this._loader.loadAsync(assetUri);

    const skinnedMesh = getFirstSkinnedMesh(gltf.scene);

    if (!skinnedMesh) {
      throw new Error(`Asset ${assetUri} did not contain a skin`);
    }

    if (Array.isArray(skinnedMesh.material)) {
      throw new Error(`Asset ${assetUri} uses multi material`);
    }

    if (skinnedMeshName) {
      skinnedMesh.name = skinnedMeshName;
    }

    removeBlendShapes(skinnedMesh);

    if (!skinnedMesh.skeleton) {
      throw new Error(`Asset ${assetUri} did not contain a skeleton`);
    }

    const rootBone = getFirstChildBone(gltf.scene);

    if (!rootBone) {
      throw new Error(`Asset ${assetUri} did not contain any bones`);
    }

    // Validate
    const positions = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'position');
    const normals = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'normal');
    const tangents = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'tangent');

    if (!(positions.count === normals.count && normals.count === tangents.count)) {
      throw new Error(
        `Asset ${assetUri} position count (${positions.count}), normal count (${normals.count}), and tangent count (${tangents.count}) does not match`,
      );
    }

    if (!(normals.itemSize === 3 && tangents.itemSize === 4)) {
      throw new Error(
        `Asset ${assetUri} normal item size (${normals.itemSize}), and tangent item size (${tangents.itemSize}) invalid`,
      );
    }

    // Houdini exports deformation uvs to uv1, use uv2 instead
    // and keep uv1 for the aoMap
    if (skinnedMesh.geometry.hasAttribute('uv1')) {
      skinnedMesh.geometry.setAttribute('uv2', skinnedMesh.geometry.attributes.uv1);
    }

    skinnedMesh.geometry.setAttribute('uv1', skinnedMesh.geometry.attributes.uv);

    return { gltf, skinnedMesh: skinnedMesh, rootBone };
  }

  private onLutDownloadCompleted(texture: THREE.Texture) {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
  }

  private async downloadTextures(avatarConfig: AvatarConfig) {
    // Download skin luts
    const lutUrl = avatarConfig?.skinColor?.lutUrl;
    if (lutUrl && !this._textureCache.has(lutUrl)) {
      await this._textureCache.download(lutUrl, this.onLutDownloadCompleted);
    }

    // Download luts for parts (not really used atm, we use tint color instead)
    for (const key in avatarConfig.partColors) {
      const lutUrl = avatarConfig.partColors[key as AvatarPartType]?.lutUrl;
      if (!lutUrl || this._textureCache.has(lutUrl)) {
        continue;
      }

      await this._textureCache.download(lutUrl, this.onLutDownloadCompleted);
    }

    // Download part skins
    for (const key in avatarConfig.partSkins) {
      const skin = avatarConfig.partSkins[key as AvatarPartType];

      if (!skin) {
        continue;
      }

      const urls = [
        skin.baseMapUrl,
        skin.emissionMapUrl,
        skin.normalMapUrl,
        skin.ormMapUrl,
      ];

      for (const url of urls) {
        if (!url || this._textureCache.has(url)) {
          continue;
        }

        const texture = await this._textureCache.download(url);

        if (!texture) {
          continue;
        }

        if (url === skin.baseMapUrl) {
          texture.colorSpace = THREE.SRGBColorSpace;
        }

        texture.generateMipmaps = false;
        texture.flipY = false;
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
      }
    }
  }

  private fixHeadItemSkinning(
    skinnedMesh: THREE.SkinnedMesh,
    newIndexMapping: Map<string, number>,
  ) {
    const skinIndexAttribute = getBufferAttributeOrThrowError(
      skinnedMesh.geometry,
      'skinIndex',
    );
    const oldIndexMapping = getBoneIndexToNameMapping(skinnedMesh.skeleton);

    this.remapSkinningIndices(skinIndexAttribute, oldIndexMapping, newIndexMapping);

    const simpleSkinIndexAttribute = skinnedMesh.geometry.getAttribute(
      '_joints',
    ) as THREE.BufferAttribute;

    if (!simpleSkinIndexAttribute) {
      return;
    }

    this.remapSkinningIndices(simpleSkinIndexAttribute, oldIndexMapping, newIndexMapping);
  }

  private remapSkinningIndices(
    skinIndexAttribute: THREE.BufferAttribute,
    oldMapping: Map<number, string>,
    newMapping: Map<string, number>,
  ) {
    // Re-index head skinned mesh bone indexes to point to the head bones in the new skeleton
    for (let i = 0; i < skinIndexAttribute.count; i++) {
      const boneIndex1 = skinIndexAttribute.getX(i);
      const boneIndex2 = skinIndexAttribute.getY(i);
      const boneIndex3 = skinIndexAttribute.getZ(i);
      const boneIndex4 = skinIndexAttribute.getW(i);

      if (boneIndex1 >= 0) {
        const boneName1 = oldMapping.get(boneIndex1);
        if (boneName1) {
          const newBoneIndex1 = newMapping.get(boneName1);
          if (newBoneIndex1 && newBoneIndex1 >= 0) {
            skinIndexAttribute.setX(i, newBoneIndex1);
          }
        }
      }

      if (boneIndex2 >= 0) {
        const boneName2 = oldMapping.get(boneIndex2);
        if (boneName2) {
          const newBoneIndex2 = newMapping.get(boneName2);
          if (newBoneIndex2 && newBoneIndex2 >= 0) {
            skinIndexAttribute.setY(i, newBoneIndex2);
          }
        }
      }

      if (boneIndex3 >= 0) {
        const boneName3 = oldMapping.get(boneIndex3);
        if (boneName3) {
          const newBoneIndex3 = newMapping.get(boneName3);
          if (newBoneIndex3 && newBoneIndex3 >= 0) {
            skinIndexAttribute.setZ(i, newBoneIndex3);
          }
        }
      }

      if (boneIndex4 >= 0) {
        const boneName4 = oldMapping.get(boneIndex4);
        if (boneName4) {
          const newBoneIndex4 = newMapping.get(boneName4);
          if (newBoneIndex4 && newBoneIndex4 >= 0) {
            skinIndexAttribute.setW(i, newBoneIndex4);
          }
        }
      }
    }

    skinIndexAttribute.needsUpdate = true;
  }

  private stichHeadToBody(
    bodySkinnedMesh: THREE.SkinnedMesh,
    headSkinnedMesh: THREE.SkinnedMesh,
    averageNeckVertexPositions = true,
    processNeckVertexNormals = true,
    averageNeckVertexNormalsAndTangents = true,
    useIntelligentSeamSkinning = true,
  ) {
    const bodySeamAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      '_seam',
    );
    const headSeamAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      '_seam',
    );

    const bodySeamIndices: number[] = [];
    for (let i = 0; i < bodySeamAttribute.count; i++) {
      const isSeamVertex = bodySeamAttribute.getX(i) === 1;
      if (isSeamVertex) {
        bodySeamIndices.push(i);
      }
    }

    const headSeamIndices: number[] = [];
    for (let i = 0; i < headSeamAttribute.count; i++) {
      const isSeamVertex = headSeamAttribute.getX(i) === 1;
      if (isSeamVertex) {
        headSeamIndices.push(i);
      }
    }

    logInfoVerbose(`Body seam index count: ${bodySeamIndices.length}`);
    logInfoVerbose(`Head seam index count: ${headSeamIndices.length}`);

    if (bodySeamIndices.length !== headSeamIndices.length) {
      throw new Error(`Head and body seam vertex count does not match`);
    }

    const bodyPositionAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      'position',
    );

    const bodyNormalAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      'normal',
    );

    const bodyTangentAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      'tangent',
    );

    const bodySkinWeightAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      'skinWeight',
    );

    const bodySkinIndexAttribute = getBufferAttributeOrThrowError(
      bodySkinnedMesh.geometry,
      'skinIndex',
    );

    const bodySimpleSkinIndexAttribute = bodySkinnedMesh.geometry.getAttribute(
      '_joints',
    ) as THREE.BufferAttribute; // allowed to be null

    const bodySimpleSkinWeightAttribute = bodySkinnedMesh.geometry.getAttribute(
      '_weights',
    ) as THREE.BufferAttribute; // allowed to be null

    const headPositionAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      'position',
    );

    const headNormalAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      'normal',
    );

    const headTangentAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      'tangent',
    );

    const headSkinWeightAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      'skinWeight',
    );

    const headSkinIndexAttribute = getBufferAttributeOrThrowError(
      headSkinnedMesh.geometry,
      'skinIndex',
    );

    const headSimpleSkinIndexAttribute = headSkinnedMesh.geometry.getAttribute(
      '_joints',
    ) as THREE.BufferAttribute; // allowed to be null

    const headSimpleSkinWeightAttribute = headSkinnedMesh.geometry.getAttribute(
      '_weights',
    ) as THREE.BufferAttribute; // allowed to be null

    for (const bodySeamVertexIndex of bodySeamIndices) {
      const bodyVertexPosition = new THREE.Vector3().fromBufferAttribute(
        bodyPositionAttribute,
        bodySeamVertexIndex,
      );

      let bestDistance = Number.MAX_SAFE_INTEGER;
      let bestVertexMatchIndex = -1;

      for (const headSeamVertexIndex of headSeamIndices) {
        const headVertexPosition = new THREE.Vector3().fromBufferAttribute(
          headPositionAttribute,
          headSeamVertexIndex,
        );

        const distance = bodyVertexPosition.distanceToSquared(headVertexPosition);

        if (distance < bestDistance) {
          bestVertexMatchIndex = headSeamVertexIndex;
          bestDistance = distance;
        }
      }

      // Weld vertices in body and head seam
      if (bestVertexMatchIndex >= 0) {
        const headSeamVertexIndex = bestVertexMatchIndex;

        weldPositions(
          bodyPositionAttribute,
          headPositionAttribute,
          bodySeamVertexIndex,
          headSeamVertexIndex,
          bodyVertexPosition,
          averageNeckVertexPositions,
        );

        bodyPositionAttribute.needsUpdate = true;
        headPositionAttribute.needsUpdate = true;

        if (processNeckVertexNormals) {
          weldTangentsAndNormals(
            bodyNormalAttribute,
            bodyTangentAttribute,
            headNormalAttribute,
            headTangentAttribute,
            bodySeamVertexIndex,
            headSeamVertexIndex,
            averageNeckVertexNormalsAndTangents,
          );

          bodyNormalAttribute.needsUpdate = true;
          bodyTangentAttribute.needsUpdate = true;
          headNormalAttribute.needsUpdate = true;
          headTangentAttribute.needsUpdate = true;
        }

        weldSkinningData(
          bodySkinIndexAttribute,
          bodySkinWeightAttribute,
          headSkinIndexAttribute,
          headSkinWeightAttribute,
          bodySeamVertexIndex,
          headSeamVertexIndex,
          useIntelligentSeamSkinning,
        );

        bodySkinWeightAttribute.needsUpdate = true;
        bodySkinIndexAttribute.needsUpdate = true;
        headSkinWeightAttribute.needsUpdate = true;
        headSkinIndexAttribute.needsUpdate = true;

        if (
          bodySimpleSkinIndexAttribute &&
          bodySimpleSkinWeightAttribute &&
          headSimpleSkinIndexAttribute &&
          headSimpleSkinWeightAttribute
        ) {
          weldSkinningData(
            bodySimpleSkinIndexAttribute,
            bodySimpleSkinWeightAttribute,
            headSimpleSkinIndexAttribute,
            headSimpleSkinWeightAttribute,
            bodySeamVertexIndex,
            headSeamVertexIndex,
            useIntelligentSeamSkinning,
          );

          bodySimpleSkinIndexAttribute.needsUpdate = true;
          bodySimpleSkinWeightAttribute.needsUpdate = true;
          headSimpleSkinIndexAttribute.needsUpdate = true;
          headSimpleSkinWeightAttribute.needsUpdate = true;
        }

        headSeamIndices.splice(headSeamIndices.indexOf(headSeamVertexIndex, 0), 1);
      } else {
        throw new Error('No matching body-neck vertices found. Should never happen.');
      }
    }
  }

  private calculateShoeOffset(hips: THREE.Object3D): number {
    if (!this._bodyComposition?.avatarRoot?.position || !hips) {
      return 0;
    }

    const avatarPosition = this._bodyComposition.avatarRoot.position;
    let offset = avatarPosition.y;

    this._bodyComposition.avatarRoot.traverse((obj) => {
      if (obj instanceof THREE.Mesh === false) {
        return;
      }

      const mesh = obj as THREE.Mesh;
      mesh.geometry.computeBoundingBox();

      const min = mesh.geometry.boundingBox?.min;
      const minWorld = obj.localToWorld(min || new THREE.Vector3());
      if (minWorld.y < offset) {
        offset = minWorld.y;
      }
    });

    offset += AVERAGE_MESH_HIP_Y_POSITION - hips.position.y;

    return avatarPosition.y - offset;
  }

  private applyCustomShaderProps(
    colorProps: ColorProps,
    ...skinnedMeshes: THREE.SkinnedMesh[]
  ) {
    for (const skinnedMesh of skinnedMeshes) {
      logInfoVerbose(
        `Set shader props ${JSON.stringify(colorProps)} for ${skinnedMesh.name}`,
      );

      skinnedMesh.userData[COLOR_PROPS_KEY] = colorProps;
    }
  }

  private applyDefaultSkin(skinnedMesh: THREE.SkinnedMesh) {
    this.applyCustomSkin(
      {
        baseMapUrl: getDefaultMapURL(skinnedMesh, MapType.BaseMap),
        normalMapUrl: getDefaultMapURL(skinnedMesh, MapType.NormalMap),
        ormMapUrl: getDefaultMapURL(skinnedMesh, MapType.AoMap),
        emissionMapUrl: getDefaultMapURL(skinnedMesh, MapType.EmissiveMap),
      },
      skinnedMesh,
    );
  }

  private applyCustomSkin(
    skinProps: SkinProps,
    skinnedMesh: THREE.SkinnedMesh,
    useEmission = false,
  ) {
    logInfoVerbose(`Set skin ${JSON.stringify(skinProps)} for ${skinnedMesh.name}`);

    const material = skinnedMesh.material as THREE.MeshStandardMaterial;
    const baseMap = this._textureCache.get(skinProps.baseMapUrl);
    const normalMap = this._textureCache.get(skinProps.normalMapUrl);
    const ormMap = this._textureCache.get(skinProps.ormMapUrl);

    if (!(baseMap && normalMap && ormMap)) {
      return;
    }

    let needsUpdate = false;

    if (baseMap && baseMap !== material.map) {
      const url = getDefaultMapURL(skinnedMesh, MapType.BaseMap);
      if (!this._textureCache.has(url) && material.map) {
        this._textureCache.set(url, material.map);
      }

      material.map = baseMap;
      needsUpdate = true;
    }

    if (normalMap && normalMap !== material.normalMap) {
      const url = getDefaultMapURL(skinnedMesh, MapType.NormalMap);
      if (!this._textureCache.has(url) && material.normalMap) {
        this._textureCache.set(url, material.normalMap);
      }

      material.normalMap = normalMap;
      needsUpdate = true;
    }

    if (ormMap) {
      if (ormMap !== material.aoMap) {
        const url = getDefaultMapURL(skinnedMesh, MapType.AoMap);
        if (!this._textureCache.has(url) && material.aoMap) {
          this._textureCache.set(url, material.aoMap);
        }

        material.aoMap = ormMap;
        needsUpdate = true;
      }

      if (ormMap !== material.roughnessMap) {
        material.roughnessMap = ormMap;
        needsUpdate = true;
      }

      if (ormMap !== material.metalnessMap) {
        material.metalnessMap = ormMap;
        needsUpdate = true;
      }
    }

    if (useEmission && skinProps.emissionMapUrl) {
      const emissionMap = this._textureCache.get(skinProps.emissionMapUrl);

      if (emissionMap && emissionMap !== material.emissiveMap) {
        const url = getDefaultMapURL(skinnedMesh, MapType.EmissiveMap);
        if (!this._textureCache.has(url) && material.emissiveMap) {
          this._textureCache.set(url, material.emissiveMap);
        }

        material.emissiveMap = emissionMap;
        needsUpdate = true;
      }
    }

    material.needsUpdate = needsUpdate;
  }

  private applyCustomShaders(...skinnedMeshes: THREE.SkinnedMesh[]) {
    for (const skinnedMesh of skinnedMeshes) {
      const colorProps = skinnedMesh?.userData[COLOR_PROPS_KEY];

      if (!colorProps) {
        continue;
      }

      const lutUrl = colorProps['lutUrl'] as string;
      const color = colorProps['color'] as string;
      const maskedColors = colorProps['maskedColors'] as string[];

      const useLut = lutUrl?.length > 0;
      const useTint = color?.length > 0;
      const useMaskedTint = maskedColors?.length > 0;

      if (!useLut && !useTint && !useMaskedTint) {
        continue;
      }

      const material = skinnedMesh.material as THREE.MeshStandardMaterial;
      const emissiveMap = material.emissiveMap;

      // todo: remove emissive map before final Avatar is generated (not really emissive map, we use it for the masks)

      const extendedShader = getExtendedShader(material);
      if (!extendedShader) {
        logInfoVerbose(
          `Inject custom shaders for ${skinnedMesh.name}, props: ${JSON.stringify(
            colorProps,
          )}`,
        );

        if (useLut) {
          const lut = this._textureCache.get(lutUrl);
          if (lut) {
            addShaderExtension(material, 'lut', {
              injector: (shader) => {
                injectSkinColorLUTShader(shader, ShaderInjectionTarget.ThreeShader, lut);
              },
            });
          }
        } else if (useTint) {
          addShaderExtension(material, 'tint', {
            injector: (shader) => {
              injectTintShader(
                shader,
                ShaderInjectionTarget.ThreeShader,
                new THREE.Color(color),
              );
            },
          });
        } else if (useMaskedTint) {
          material.defines = {
            ...material.defines,
            ...{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              USE_UV: true,
            },
          };

          addShaderExtension(material, 'masked-tint', {
            injector: (shader) => {
              injectMaskedTintShader(
                shader,
                ShaderInjectionTarget.ThreeShader,
                [new THREE.Color(maskedColors[0]), new THREE.Color(maskedColors[1])],
                emissiveMap,
              );
            },
          });
        }
      } else {
        logInfoVerbose(
          `Update shader properties for ${skinnedMesh.name}, props: ${JSON.stringify(
            colorProps,
          )}`,
        );

        if (useLut) {
          const lut = this._textureCache.get(lutUrl);
          if (lut) {
            updateSkinColorLUTShader(extendedShader, lut);
          }
        } else if (useTint) {
          updateTintShader(extendedShader, new THREE.Color(color));
        } else if (useMaskedTint) {
          updateMaskedTintShader(
            extendedShader,
            [new THREE.Color(maskedColors[0]), new THREE.Color(maskedColors[1])],
            emissiveMap,
          );
        }
      }

      material.needsUpdate = true;
    }
  }

  private async constructBodyWithHead(
    avatarConfig: AvatarConfig,
    builderSettings: BuilderSettings,
  ): Promise<BodyComposition> {
    const bodyAssetUri = avatarConfig.bodyUrl;
    const bodyPosDeformationTexUri = bodyAssetUri.replace('.glb', '.exr');

    const headAssetUri = avatarConfig.headUrl;
    const headPosDeformationTexUri = headAssetUri.replace('.glb', '.exr');
    const headPosSmoothDeformationTexUri = headAssetUri.replace('.glb', '-low.exr');

    const avatarRoot = new THREE.Group();
    avatarRoot.name = builderSettings.outputName;

    // Load body and head
    const bodyAsset = await this.loadAsset(bodyAssetUri, 'body');
    const bodySkeleton = bodyAsset.skinnedMesh.skeleton;

    const headAsset = await this.loadAsset(headAssetUri, 'head');
    const headSkeleton = headAsset.skinnedMesh.skeleton;

    const skeletonRoot = bodyAsset.gltf.scene.getObjectByName(
      builderSettings.rootBoneName,
    );

    if (!skeletonRoot) {
      throw new Error(
        `Body asset ${bodyAssetUri} did not contain skeleton root bone ${builderSettings.rootBoneName}`,
      );
    }

    const neckBone = bodyAsset.gltf.scene.getObjectByName(builderSettings.neckBoneName);

    if (!neckBone) {
      throw new Error(
        `Body asset ${bodyAssetUri} did not contain the neck bone ${builderSettings.neckBoneName}`,
      );
    }

    // Load body and head deformation textures
    const bodyPosDeformationTex = await this._exrLoader.loadAsync(
      bodyPosDeformationTexUri,
    );
    if (!bodyPosDeformationTex) {
      throw new Error(
        `Body deformation (position) texture ${bodyPosDeformationTexUri} was invalid`,
      );
    }

    const headPosDeformationTex = await this._exrLoader.loadAsync(
      headPosDeformationTexUri,
    );
    if (!headPosDeformationTex) {
      throw new Error(
        `Head deformation (position) texture ${headPosDeformationTexUri} was invalid`,
      );
    }

    let bodyNATDeformationTex: THREE.DataTexture | undefined;
    let headNATDeformationTex: THREE.DataTexture | undefined;

    if (builderSettings.deformNormalsAndTangents) {
      const bodyNATDeformationUri = bodyAssetUri.replace('.glb', '-tangent.exr');
      const headNATDeformationUri = headAssetUri.replace('.glb', '-tangent.exr');

      try {
        bodyNATDeformationTex = await this._exrLoader.loadAsync(bodyNATDeformationUri);
      } catch {
        logWarn(
          `Body deformation (normal/tangent) texture ${bodyNATDeformationUri} was invalid. Skipping deformation.`,
        );
      }

      try {
        headNATDeformationTex = await this._exrLoader.loadAsync(headNATDeformationUri);
      } catch {
        logWarn(
          `Head deformation (normal/tangent) texture ${headNATDeformationUri} was invalid. Skipping deformation.`,
        );
      }
    }

    let headPosSmoothDeformationTex: THREE.DataTexture | undefined;

    if (builderSettings.smoothFaceItemDeformations) {
      try {
        headPosSmoothDeformationTex = await this._exrLoader.loadAsync(
          headPosSmoothDeformationTexUri,
        );
      } catch {
        logWarn(
          `Head deformation (pos, smooth) texture ${headPosSmoothDeformationTexUri} was invalid. Using default.`,
        );
      }
    }

    // Merge upper and lower body bones
    const headPos = new THREE.Vector3();
    const neckPos = new THREE.Vector3();

    headAsset.rootBone.getWorldPosition(headPos);
    neckBone.getWorldPosition(neckPos);

    const neckOffset = headPos.sub(neckPos);
    // neckBone.add(headRootBone); // messes up rotation, don't use
    neckBone.attach(headAsset.rootBone);
    headAsset.rootBone.position.set(0, 0, 0);

    avatarRoot.add(bodyAsset.rootBone);
    avatarRoot.updateWorldMatrix(true, true);

    // Merge skeletons
    const newBones = bodySkeleton.bones.concat(headSkeleton.bones);
    // const newBoneInverses = bodySkeleton.boneInverses.concat(headSkeleton.boneInverses);
    const bodyBoneCount = bodySkeleton.bones.length;

    const skeleton = new THREE.Skeleton(newBones);

    skeleton.calculateInverses();

    // Offset vertices so that head is in correct place
    offsetVertices(headAsset.skinnedMesh, neckOffset);

    // Re-index head skinned mesh bone indexes to point the head in the new skeleton
    this.fixHeadItemSkinning(headAsset.skinnedMesh, getBoneNameToIndexMapping(skeleton));

    // Match head seam vertex positions
    if (builderSettings.stitchHeadToBody) {
      this.stichHeadToBody(
        bodyAsset.skinnedMesh,
        headAsset.skinnedMesh,
        builderSettings.averageNeckVertexPositions,
        builderSettings.processNeckVertexNormalsAndTangents,
        builderSettings.averageNeckVertexNormalsAndTangents,
        builderSettings.intelligentHeadBodySeamSkinning,
      );
    }

    // Add body and head skin
    const body = bodyAsset.skinnedMesh;
    const head = headAsset.skinnedMesh;

    avatarRoot.add(body);
    avatarRoot.add(head);

    return {
      avatarRoot,
      skeletonRoot,
      skeleton,
      bodyBoneCount,
      neckOffset,
      bodySkinnedMesh: body,
      headSkinnedMesh: head,
      parts: {},
      bodyPosDeformationTex,
      bodyNATDeformationTex: bodyNATDeformationTex || undefined,
      headPosDeformationTex,
      headPosSmoothDeformationTex: headPosSmoothDeformationTex || undefined,
      headNATDeformationTex: headNATDeformationTex || undefined,
    };
  }

  private isBodyOrHeadChanged(avatarConfig: AvatarConfig): boolean {
    if (
      this._avatarConfig === null ||
      this._avatarConfig.bodyUrl !== avatarConfig.bodyUrl ||
      this._avatarConfig.headUrl !== avatarConfig.headUrl
    ) {
      return true;
    }

    return false;
  }

  private deformPart(
    asset: SourceAsset,
    posDeformationTex: THREE.DataTexture,
    natDeformationTex?: THREE.DataTexture,
  ) {
    const positions = getBufferAttributeOrThrowError(
      asset.skinnedMesh.geometry,
      'position',
    );
    const tangents = getBufferAttributeOrThrowError(
      asset.skinnedMesh.geometry,
      'tangent',
    );
    const normals = getBufferAttributeOrThrowError(asset.skinnedMesh.geometry, 'normal');
    const deformationUvs = getBufferAttributeOrThrowError(
      asset.skinnedMesh.geometry,
      'uv2',
    );

    if (positions.count !== deformationUvs.count) {
      throw new Error(
        `Part position count and uv2 count does not match, needed for cloth wrap`,
      );
    }

    for (let i = 0; i < positions.count; i++) {
      const uv: THREE.Vector2 = new THREE.Vector2();
      uv.x = deformationUvs.getX(i);
      uv.y = 1 - deformationUvs.getY(i);

      const offset = sampleExr(posDeformationTex, uv);
      positions.setX(i, positions.getX(i) + offset.x);
      positions.setY(i, positions.getY(i) + offset.y);
      positions.setZ(i, positions.getZ(i) + offset.z);

      if (natDeformationTex) {
        const tmp = sampleExr(natDeformationTex, uv);
        const rotation = new THREE.Quaternion(tmp.x, tmp.y, tmp.z, tmp.w);

        const normal = new THREE.Vector3().fromBufferAttribute(normals, i);

        normal.applyQuaternion(rotation);
        normals.setXYZ(i, normal.x, normal.y, normal.z);

        const tangent = new THREE.Vector3().fromBufferAttribute(tangents, i);

        tangent.applyQuaternion(rotation);
        tangents.setXYZ(i, tangent.x, tangent.y, tangent.z);
      }
    }

    positions.needsUpdate = true;

    if (natDeformationTex) {
      normals.needsUpdate = true;
      tangents.needsUpdate = true;
    }
  }

  private getPartChanges(
    avatarConfig: AvatarConfig,
  ): [AvatarPartType[], AvatarPartType[]] {
    const partsToAdd: AvatarPartType[] = [];

    if (!this._avatarConfig || this.isBodyOrHeadChanged(avatarConfig)) {
      for (const key in avatarConfig.partUrls) {
        partsToAdd.push(key as AvatarPartType);
      }
      return [[], partsToAdd];
    }

    const partsToRemove: AvatarPartType[] = [];

    for (const key in this._avatarConfig.partUrls) {
      const type = key as AvatarPartType;

      if (avatarConfig.partUrls && type in avatarConfig.partUrls) {
        if (this._avatarConfig.partUrls[type] !== avatarConfig.partUrls[type]) {
          partsToRemove.push(type);
          partsToAdd.push(type);
        }
      } else {
        partsToRemove.push(type);
      }
    }

    for (const key in avatarConfig?.partUrls) {
      const type = key as AvatarPartType;

      if (!(this._avatarConfig.partUrls && type in this._avatarConfig.partUrls)) {
        partsToAdd.push(type);
      }
    }

    return [partsToRemove, partsToAdd];
  }

  private disposeBodyComposition() {
    if (!this._bodyComposition) {
      return;
    }

    disposeObject(this._bodyComposition.avatarRoot);

    this._bodyComposition.headPosDeformationTex?.dispose();
    this._bodyComposition.headPosSmoothDeformationTex?.dispose();
    this._bodyComposition.headNATDeformationTex?.dispose();

    this._bodyComposition.bodyPosDeformationTex?.dispose();
    this._bodyComposition.bodyNATDeformationTex?.dispose();

    this._bodyComposition = null;
  }

  private async internalConstruct(
    avatarConfig: AvatarConfig,
    progressCallback?: (progress: number) => void,
    builderSettings: BuilderSettings = DefaultBuilderSettings,
  ): Promise<BodyComposition> {
    await this.downloadTextures(avatarConfig);

    const bodyOrHeadChanged = this.isBodyOrHeadChanged(avatarConfig);

    let bodyComposition = this._bodyComposition;

    if (bodyOrHeadChanged) {
      logInfoVerbose('New Avatar root created');

      this.disposeBodyComposition();

      bodyComposition = await this.constructBodyWithHead(avatarConfig, builderSettings);
    }

    // Apply skin color
    if (
      avatarConfig.skinColor &&
      bodyComposition?.headSkinnedMesh &&
      bodyComposition?.bodySkinnedMesh
    ) {
      this.applyCustomShaderProps(
        avatarConfig.skinColor,
        bodyComposition.headSkinnedMesh,
        bodyComposition.bodySkinnedMesh,
      );
    }

    progressCallback?.(0.2);

    logInfoVerbose(
      `Avatar child count before changes: ${bodyComposition?.avatarRoot.children.length}`,
    );

    if (!bodyComposition) {
      throw new Error(`Creating body composition failed`);
    }

    const hips = bodyComposition.avatarRoot.getObjectByName('Hips');
    if (!hips) {
      throw new Error(`Hips does not exist`);
    }

    const [partsToRemove, partsToAdd] = this.getPartChanges(avatarConfig);

    const skinnedMeshesToRemove: THREE.SkinnedMesh[] = [];

    // Remove items that should no longer exist
    for (const key of partsToRemove) {
      logInfoVerbose(`Remove Avatar part: ${key as AvatarPartType}`);

      const skinnedMesh = this._bodyComposition?.parts[key];

      skinnedMesh && skinnedMeshesToRemove.push(skinnedMesh);

      delete bodyComposition.parts[key];
    }

    const skinnedMeshesToAdd: THREE.SkinnedMesh[] = [];

    progressCallback?.(0.3);

    const numDownloads = partsToAdd.length;
    let downloadsDone = 0;

    const skeleton = bodyComposition.skeleton;
    const skeletonBoneMapping = getBoneNameToIndexMapping(skeleton);

    // Add parts
    for (const key of partsToAdd) {
      logInfoVerbose(`Add Avatar part: ${key as AvatarPartType}`);

      const partUrl = avatarConfig.partUrls[key];

      if (!partUrl) {
        continue;
      }

      const partAsset = await this.loadAsset(partUrl, key);
      let posDeformationTex: THREE.DataTexture | undefined;
      let natDeformationTex: THREE.DataTexture | undefined;

      const isHeadItem =
        partAsset.skinnedMesh.skeleton.bones.length !== bodyComposition.bodyBoneCount;

      if (isHeadItem) {
        offsetVertices(partAsset.skinnedMesh, bodyComposition.neckOffset);
        this.fixHeadItemSkinning(partAsset.skinnedMesh, skeletonBoneMapping);

        if (
          key === AvatarPartType.FaceItem &&
          bodyComposition.headPosSmoothDeformationTex
        ) {
          posDeformationTex = bodyComposition.headPosSmoothDeformationTex;
        } else {
          posDeformationTex = bodyComposition.headPosDeformationTex;
          natDeformationTex = bodyComposition.headNATDeformationTex;
        }
      } else {
        posDeformationTex = bodyComposition.bodyPosDeformationTex;
        natDeformationTex = bodyComposition.bodyNATDeformationTex;
      }

      this.deformPart(partAsset, posDeformationTex, natDeformationTex);

      bodyComposition.parts[key] = partAsset.skinnedMesh;

      skinnedMeshesToAdd.push(partAsset.skinnedMesh);

      downloadsDone++;

      const downloadProgress = downloadsDone / numDownloads;
      progressCallback?.(0.3 + 0.6 * downloadProgress);
    }

    progressCallback?.(0.9);

    // Add new skins
    for (const skinnedMesh of skinnedMeshesToAdd) {
      bodyComposition.avatarRoot.add(skinnedMesh);
    }

    // Remove old skins
    for (const skinnedMesh of skinnedMeshesToRemove) {
      skinnedMesh.removeFromParent();
      disposeSkinnedMesh(skinnedMesh);
    }

    // Apply part colors and skins
    for (const key in bodyComposition.parts) {
      const part = key as AvatarPartType;
      const skinnedMesh = bodyComposition.parts[part];

      if (!skinnedMesh) {
        continue;
      }

      if (avatarConfig.partSkins && part in avatarConfig.partSkins) {
        const skinProps = avatarConfig.partSkins[part];
        if (skinProps) {
          this.applyCustomSkin(skinProps, skinnedMesh);
        }
      } else {
        this.applyDefaultSkin(skinnedMesh);
      }

      if (avatarConfig.partColors && part in avatarConfig.partColors) {
        const shaderProps = avatarConfig.partColors[part];
        if (shaderProps) {
          this.applyCustomShaderProps(shaderProps, skinnedMesh);
        }
      }
    }

    // Repose before binding because if we are already animating the root things would get bound wrong.
    bodyComposition.skeleton.pose();

    // Bind skins to the new skeleton
    const skinnedMeshesToUpdate: THREE.SkinnedMesh[] = bodyOrHeadChanged
      ? getSkinnedMeshes(bodyComposition.avatarRoot)
      : skinnedMeshesToAdd;

    for (const skinnedMesh of skinnedMeshesToUpdate) {
      skinnedMesh.bind(bodyComposition.skeleton);

      if (builderSettings.removeDeformationUvs) {
        skinnedMesh.geometry?.deleteAttribute('uv2');
      }
    }

    // Apply custom shaders and material properties
    const allSkinnedMeshes = getSkinnedMeshes(bodyComposition.avatarRoot);
    this.applyCustomShaders(...allSkinnedMeshes);
    Avatar.ConfigureMaterialProperties(bodyComposition.avatarRoot);

    this._avatarConfig = avatarConfig;
    this._bodyComposition = bodyComposition;

    logInfoVerbose(
      `Avatar child count after changes: ${bodyComposition.avatarRoot.children.length}`,
    );

    progressCallback?.(1.0);

    if (builderSettings.serializeShoeOffset || builderSettings.applyShoeOffset) {
      const offset = this.calculateShoeOffset(hips);

      logInfoVerbose(`Shoe offset ${offset}`);

      if (builderSettings.serializeShoeOffset) {
        this._bodyComposition.skeletonRoot.userData['shoeOffset'] = offset;
      }

      if (builderSettings.applyShoeOffset) {
        const pos = this._bodyComposition.skeletonRoot.position;
        this._bodyComposition.skeletonRoot.position.set(pos.x, offset, pos.y);
      }
    }

    return bodyComposition;
  }

  public async construct(
    avatarConfig: AvatarConfig,
    builderSettings: BuilderSettings = DefaultBuilderSettings,
    progressCallback?: (progress: number) => void,
  ): Promise<BodyComposition> {
    if (this._isConstructing) {
      throw new Error('Construction already running');
    }

    this._isConstructing = true;

    logInfoVerbose(`Avatar config: ${JSON.stringify(avatarConfig)}`);

    try {
      return await this.internalConstruct(
        avatarConfig,
        progressCallback,
        builderSettings,
      );
    } finally {
      this._isConstructing = false;
    }
  }

  public get isConstructing(): boolean {
    return this._isConstructing;
  }

  public dispose(): void {
    this.disposeBodyComposition();
    this._avatarConfig = null;
  }

  public getTextureCache(): TextureCache {
    return this._textureCache;
  }
}
