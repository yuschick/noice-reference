import { AvatarBuilder, Helpers } from '@noice-com/avatar-builder';
import { getBufferAttributeOrThrowError } from '@noice-com/avatar-builder/src/helpers';
import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { AtlasGenerator } from '../atlas-generator';

import { DefaultOptimizerSettings } from './defaults';
import { MeshNameToInt, OptimizerSettings } from './types';
import { loadUnwrapper } from './unwrapper';

import {
  cleanBufferAttributes,
  createBufferLike,
  trimBuffer,
  trimIndexBuffer,
} from 'helpers';
import { getTextureImageData, sampleImageData } from 'helpers/texture';
import { PackResult } from 'xatlas-three';

const { logWarn } = makeLoggers('AvatarOptimizer');

export function getPartUvScale(
  config: AvatarBuilder.UvScalingSettings,
  key: string,
): number {
  const getPartScale = (key: string): number => {
    const part = key as AvatarBuilder.AvatarPartType;

    return (
      (part && config.parts && part in config.parts ? config.parts[part] : 1.0) || 1.0
    );
  };

  switch (key) {
    case 'body':
      return config?.body || 1.0;
    case 'head':
      return config?.head || 1.0;
    default:
      return getPartScale(key);
  }

  return 1.0;
}

export class Optimizer {
  private _renderer: THREE.WebGLRenderer;
  private _textureCache: AvatarBuilder.TextureCache;

  public constructor(
    renderer: THREE.WebGLRenderer,
    textureCache: AvatarBuilder.TextureCache,
  ) {
    this._renderer = renderer;
    this._textureCache = textureCache;
  }

  private hiddenGeometryRemoval(
    bodySkinnedMesh: THREE.SkinnedMesh,
    clothingSkinnedMeshes: THREE.SkinnedMesh[],
  ) {
    let hiddenVertices: number[] = [];

    if (clothingSkinnedMeshes?.length < 1) {
      return;
    }

    for (const skinnedMesh of clothingSkinnedMeshes) {
      const maskTexture = (skinnedMesh.material as THREE.MeshStandardMaterial)
        ?.emissiveMap;
      if (!maskTexture) {
        continue;
      }

      // Merge without duplicates
      hiddenVertices = [
        ...new Set([
          ...hiddenVertices,
          ...this.getHiddenVertices(bodySkinnedMesh, maskTexture),
        ]),
      ];
    }

    if (hiddenVertices?.length < 3) {
      return;
    }

    const geometry = bodySkinnedMesh.geometry;

    const indexBuffer = geometry.index;
    if (!indexBuffer) {
      throw new Error('Only indexed triangles supported');
    }

    const positions = geometry.getAttribute('position');
    if (!positions || positions.count < 1) {
      throw new Error('Mesh did not have vertices');
    }

    const [buffer, removedVertexIndices] = trimIndexBuffer(
      indexBuffer,
      positions.count,
      hiddenVertices,
    );

    for (const attribute of [
      'position',
      'normal',
      'tangent',
      'uv',
      'uv1',
      'uv2',
      'uv3',
      'skinWeight',
      'skinIndex',
      '_joints',
      '_weights',
    ]) {
      const buffer = geometry.getAttribute(attribute) as THREE.BufferAttribute;
      if (!buffer) {
        continue;
      }

      const newBuffer = trimBuffer(buffer, removedVertexIndices);
      if (!newBuffer) {
        logWarn(`Failed to trim attribute buffer ${attribute}, skipping`);
        continue;
      }

      geometry.setAttribute(attribute, newBuffer);
      newBuffer.needsUpdate = true;
    }

    if (buffer) {
      geometry.setIndex(buffer);
      buffer.needsUpdate = true;
    }
  }

  private getHiddenVertices(
    skinnedMesh: THREE.SkinnedMesh,
    maskTexture: THREE.Texture,
  ): number[] {
    const vertexIndices: number[] = [];

    if (!skinnedMesh || !skinnedMesh.geometry || !skinnedMesh.skeleton) {
      return vertexIndices;
    }

    const positions = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'position');
    const deformationUvs = getBufferAttributeOrThrowError(skinnedMesh.geometry, 'uv2');

    if (positions.count !== deformationUvs.count) {
      throw new Error(
        `Part position count and uv2 count does not match, needed for hidden polygon removal`,
      );
    }

    const textureData = getTextureImageData(maskTexture);

    if (!textureData) {
      return vertexIndices;
    }

    for (let i = 0; i < positions.count; i++) {
      const uv: THREE.Vector2 = new THREE.Vector2().fromBufferAttribute(
        deformationUvs,
        i,
      );

      if (sampleImageData(textureData, uv).z > Number.EPSILON) {
        if (!vertexIndices.includes(i)) {
          vertexIndices.push(i);
        }
      }
    }

    return vertexIndices;
  }

  private combineSkinnedMeshes(
    mainSkinnedMesh: THREE.SkinnedMesh,
    skinnedMeshes: THREE.SkinnedMesh[],
  ): Nullable<THREE.SkinnedMesh> {
    if (!mainSkinnedMesh || skinnedMeshes?.length < 2) {
      return null;
    }

    const skeleton = mainSkinnedMesh.skeleton;
    const bindMatrix = mainSkinnedMesh.bindMatrix;
    const material = mainSkinnedMesh.material;

    const geometries: THREE.BufferGeometry[] = [];

    for (const mesh of skinnedMeshes) {
      if (mesh.visible) {
        geometries.push(mesh.geometry);
      }
    }

    const result = mergeGeometries(geometries);

    const mesh = new THREE.SkinnedMesh(result, material);

    if (!Array.isArray(material)) {
      material.name = 'Combined';
    }

    mesh.bind(skeleton, bindMatrix);

    return mesh;
  }

  private createBodyPartBufferAttribute(skinnedMesh: THREE.SkinnedMesh) {
    const vertices = Helpers.getBufferAttributeOrThrowError(
      skinnedMesh.geometry,
      'position',
    );

    const vertexCount = vertices.count;
    const bufferAttribute = new THREE.BufferAttribute(new Uint8Array(vertexCount), 1);

    for (let i = 0; i < vertexCount; i++) {
      const id = MeshNameToInt.get(skinnedMesh.name);
      if (!id) {
        continue;
      }

      bufferAttribute.setX(i, id);
    }

    skinnedMesh.geometry.setAttribute('bodyPartMask', bufferAttribute);
  }

  private applyAtlasUvs(skinnedMeshes: THREE.SkinnedMesh[]): void {
    for (const skinnedMesh of skinnedMeshes) {
      const uv3 = Helpers.getBufferAttributeOrThrowError(skinnedMesh.geometry, 'uv3');
      skinnedMesh.geometry.setAttribute('uv', uv3);
      skinnedMesh.geometry.setAttribute('uv1', uv3);
      skinnedMesh.geometry.deleteAttribute('uv3');
    }
  }

  private fixSkinnedMeshesAfterAtlasing(
    skinnedMeshes: THREE.SkinnedMesh[],
    packResults: PackResult[],
  ): void {
    for (const packResult of packResults) {
      const skinnedMesh = Helpers.findSkinnedMeshByGeometryName(
        skinnedMeshes,
        packResult.uuid,
      );

      if (!skinnedMesh) {
        continue;
      }

      const newVertexCount = packResult.newVertexCount;

      const oldPositions = Helpers.getBufferAttributeOrThrowError(
        skinnedMesh.geometry,
        'position',
      );
      const oldUvs = Helpers.getBufferAttributeOrThrowError(skinnedMesh.geometry, 'uv');
      const oldUv1s = skinnedMesh.geometry.getAttribute('uv1') as THREE.BufferAttribute; // allowed to be null
      const oldUv2s = skinnedMesh.geometry.getAttribute('uv2') as THREE.BufferAttribute; // allowed to be null
      const oldSkinIndices = Helpers.getBufferAttributeOrThrowError(
        skinnedMesh.geometry,
        'skinIndex',
      );
      const oldSkinWeights = Helpers.getBufferAttributeOrThrowError(
        skinnedMesh.geometry,
        'skinWeight',
      );
      const oldNormals = Helpers.getBufferAttributeOrThrowError(
        skinnedMesh.geometry,
        'normal',
      );
      const oldTangents = Helpers.getBufferAttributeOrThrowError(
        skinnedMesh.geometry,
        'tangent',
      );
      const oldSimpleSkinIndices = skinnedMesh.geometry.getAttribute(
        '_joints',
      ) as THREE.BufferAttribute; // allowed to be null
      const oldSimpleSkinWeights = skinnedMesh.geometry.getAttribute(
        '_weights',
      ) as THREE.BufferAttribute; // allowed to be null

      const newIndices = new THREE.BufferAttribute(packResult.newIndices, 1, false);
      const atlasedUvs = new THREE.BufferAttribute(packResult.newUvs, 2, false);

      const newPositions = createBufferLike(oldPositions, newVertexCount);
      const newUvs = createBufferLike(oldUvs, newVertexCount);

      let newUv1s: Nullable<THREE.BufferAttribute> = null;

      if (oldUv1s) {
        newUv1s = createBufferLike(oldUv1s, newVertexCount);
      }

      let newUv2s: Nullable<THREE.BufferAttribute> = null;

      if (oldUv2s) {
        newUv2s = createBufferLike(oldUv2s, newVertexCount);
      }

      const newSkinIndices = createBufferLike(oldSkinIndices, newVertexCount);
      const newSkinWeights = createBufferLike(oldSkinWeights, newVertexCount);
      const newNormals = createBufferLike(oldNormals, newVertexCount);
      const newTangents = createBufferLike(oldTangents, newVertexCount);

      let newSimpleSkinIndices: Nullable<THREE.BufferAttribute> = null;

      if (oldSimpleSkinIndices) {
        newSimpleSkinIndices = createBufferLike(oldSimpleSkinIndices, newVertexCount);
      }

      let newSimpleSkinWeights: Nullable<THREE.BufferAttribute> = null;

      if (oldSimpleSkinWeights) {
        newSimpleSkinWeights = createBufferLike(oldSimpleSkinWeights, newVertexCount);
      }

      for (let i = 0; i < newVertexCount; i++) {
        const oldIndex = packResult.oldIndices[i];

        newPositions.setXYZ(
          i,
          oldPositions.getX(oldIndex),
          oldPositions.getY(oldIndex),
          oldPositions.getZ(oldIndex),
        );

        newUvs.setXY(i, oldUvs.getX(oldIndex), oldUvs.getY(oldIndex));
        newUv1s?.setXY(i, oldUv1s.getX(oldIndex), oldUv1s.getY(oldIndex));
        newUv2s?.setXY(i, oldUv2s.getX(oldIndex), oldUv2s.getY(oldIndex));

        newSkinIndices.setXYZW(
          i,
          oldSkinIndices.getX(oldIndex),
          oldSkinIndices.getY(oldIndex),
          oldSkinIndices.getZ(oldIndex),
          oldSkinIndices.getW(oldIndex),
        );

        newSkinWeights.setXYZW(
          i,
          oldSkinWeights.getX(oldIndex),
          oldSkinWeights.getY(oldIndex),
          oldSkinWeights.getZ(oldIndex),
          oldSkinWeights.getW(oldIndex),
        );

        newSimpleSkinIndices?.setXYZW(
          i,
          oldSimpleSkinIndices.getX(oldIndex),
          oldSimpleSkinIndices.getY(oldIndex),
          oldSimpleSkinIndices.getZ(oldIndex),
          oldSimpleSkinIndices.getW(oldIndex),
        );

        newSimpleSkinWeights?.setXYZW(
          i,
          oldSimpleSkinWeights.getX(oldIndex),
          oldSimpleSkinWeights.getY(oldIndex),
          oldSimpleSkinWeights.getZ(oldIndex),
          oldSimpleSkinWeights.getW(oldIndex),
        );

        newNormals.setXYZ(
          i,
          oldNormals.getX(oldIndex),
          oldNormals.getY(oldIndex),
          oldNormals.getZ(oldIndex),
        );

        newTangents.setXYZW(
          i,
          oldTangents.getX(oldIndex),
          oldTangents.getY(oldIndex),
          oldTangents.getZ(oldIndex),
          oldTangents.getW(oldIndex),
        );
      }

      skinnedMesh.geometry.setIndex(newIndices);
      skinnedMesh.geometry.setAttribute('position', newPositions);
      skinnedMesh.geometry.setAttribute('uv', newUvs);

      if (newUv1s) {
        skinnedMesh.geometry.setAttribute('uv1', newUv1s);
      }

      if (newUv2s) {
        skinnedMesh.geometry.setAttribute('uv2', newUv2s);
      }

      skinnedMesh.geometry.setAttribute('uv3', atlasedUvs);

      skinnedMesh.geometry.setAttribute('skinIndex', newSkinIndices);
      skinnedMesh.geometry.setAttribute('skinWeight', newSkinWeights);

      if (newSimpleSkinIndices) {
        skinnedMesh.geometry.setAttribute('_joints', newSimpleSkinIndices);
      }

      if (newSimpleSkinWeights) {
        skinnedMesh.geometry.setAttribute('_weights', newSimpleSkinWeights);
      }

      skinnedMesh.geometry.setAttribute('normal', newNormals);
      skinnedMesh.geometry.setAttribute('tangent', newTangents);
    }
  }

  public async optimize(
    obj: THREE.Object3D,
    progressCallback?: (progress: number) => void,
    settings: OptimizerSettings = DefaultOptimizerSettings,
  ): Promise<void> {
    // Remove teeth if needed
    if (settings.removeTeeth) {
      const teeth = obj.getObjectByName('teeth');
      if (teeth) {
        teeth.removeFromParent();
        Helpers.disposeObject(teeth);
      }
    }

    const skinnedMeshes: THREE.SkinnedMesh[] = Helpers.getSkinnedMeshes(obj);

    const bodySkinnedMesh = obj.getObjectByName(
      settings.bodySkinnedMeshName,
    ) as THREE.SkinnedMesh;

    if (!bodySkinnedMesh) {
      return;
    }

    progressCallback?.(0);

    // Hidden geometry removal
    if (settings.removeHiddenGeometry) {
      this.hiddenGeometryRemoval(
        bodySkinnedMesh,
        skinnedMeshes.filter((n) => n.name !== 'body' && n.name !== 'head'),
      );
    }

    // Remove unwanted geometry attributes
    if (settings.removeUnwantedAttributes && settings.wantedAttributes) {
      for (const skinnedMesh of skinnedMeshes) {
        cleanBufferAttributes(skinnedMesh, settings.wantedAttributes);
      }
    }

    progressCallback?.(0.1);

    // Render and use texture atlases
    if (settings.applyTextureAtlasing) {
      if (
        !settings.atlasedMapTypes ||
        settings.atlasedMapTypes.length < 1 ||
        !settings.atlasChartOptions ||
        !settings.atlasPackOptions
      ) {
        throw new Error(`Invalid atlasing settings`);
      }

      // Override pack resolution, use real atlas resolution
      // settings.atlasPackOptions.resolution = settings.textureResolution;

      const unwrapper = await loadUnwrapper(
        settings.atlasChartOptions,
        settings.atlasPackOptions,
        (packingProgress: number) => {
          progressCallback?.(0.1 + packingProgress * 0.4);
        },
      );

      const geometries: THREE.BufferGeometry[] = [];

      // Get geometry for atlasing
      for (const skinnedMesh of skinnedMeshes) {
        if (settings.uvScalingSettings) {
          const scale = getPartUvScale(settings.uvScalingSettings, skinnedMesh.name);
          scale > 1.0 && Helpers.scaleMeshGeometry(skinnedMesh, scale);
        }

        geometries.push(skinnedMesh.geometry);
      }

      const packResults = await unwrapper.packAtlas(geometries);

      for (const skinnedMesh of skinnedMeshes) {
        if (settings.uvScalingSettings) {
          const scale = getPartUvScale(settings.uvScalingSettings, skinnedMesh.name);
          scale > 1.0 && Helpers.scaleMeshGeometry(skinnedMesh, 1.0 / scale);
        }
      }

      progressCallback?.(0.6);

      this.fixSkinnedMeshesAfterAtlasing(skinnedMeshes, packResults);

      progressCallback?.(0.7);

      // Note: Packing resolution is defined in settings.atlasPackOptions.resolution
      // For best results use the same for settings.textureResolution
      const atlasTextureResolution = settings.textureResolution || 1024;

      const atlasGenerator = new AtlasGenerator(
        atlasTextureResolution,
        atlasTextureResolution,
      );

      for (const skinnedMesh of skinnedMeshes) {
        const material = skinnedMesh.material as THREE.MeshStandardMaterial;
        material.userData = {};
      }

      // Create and assign texture atlas for selected map types
      for (const mapType of settings.atlasedMapTypes) {
        const atlasTexture = await atlasGenerator.renderAtlas(
          this._renderer,
          skinnedMeshes,
          mapType,
          this._textureCache,
        );

        const texture = settings.dilateTextureAtlas
          ? atlasGenerator.dilate(this._renderer, atlasTexture)
          : atlasTexture;

        texture.name = Helpers.MapType[mapType];

        // Set atlas texture
        for (const skinnedMesh of skinnedMeshes) {
          const material = skinnedMesh.material as THREE.MeshStandardMaterial;

          const oldTexture = Helpers.getTexture(material, mapType);
          if (oldTexture) {
            oldTexture.dispose();
          }

          Helpers.setTexture(material, mapType, texture);
        }
      }

      this.applyAtlasUvs(skinnedMeshes);

      atlasGenerator.dispose();
    }

    progressCallback?.(0.8);

    // Use ao map (ORM) for metalness and roughness
    if (settings.useAoMapForMetalnessAndRoughness) {
      for (const skinnedMesh of skinnedMeshes) {
        const srcMaterial = skinnedMesh.material as THREE.MeshStandardMaterial;
        srcMaterial.roughnessMap = srcMaterial.aoMap;
        srcMaterial.metalnessMap = srcMaterial.aoMap;
      }
    }

    // Create body part mask buffer attribute
    if (settings.addBodyPartMaskAttribute) {
      for (const skinnedMesh of skinnedMeshes) {
        this.createBodyPartBufferAttribute(skinnedMesh);
      }
    }

    // Merge skinned meshes
    if (settings.applyTextureAtlasing && settings.mergeSkinnedMeshes) {
      const newSkinnedMesh = this.combineSkinnedMeshes(bodySkinnedMesh, skinnedMeshes);
      if (newSkinnedMesh) {
        newSkinnedMesh.name = 'SkinnedMesh';

        for (const skinnedMesh of skinnedMeshes) {
          obj.remove(skinnedMesh);
          Helpers.disposeSkinnedMesh(skinnedMesh);
        }

        obj.add(newSkinnedMesh);
      }
    }

    progressCallback?.(1.0);
  }
}
