import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import * as THREE from 'three';

import * as API from '@legacy/api';
import { AnimationPool } from '@legacy/entities/controllers/animationsv2';
import { PriorityQueue } from '@legacy/utilities';

const { logInfoVerbose } = makeLoggers('Avatar');

export interface Avatar extends THREE.Object3D {
  readonly isMemberOfLocalGroup: boolean;

  readonly minimumLODLevel: number;
  readonly maximumLODLevel: number;

  lod: number;
  slot?: API.Slot;

  modelLoadQueue: Nullable<PriorityQueue>;

  load(
    progressHandler?: (event: ProgressEvent<EventTarget>) => void,
    completionHandler?: (avatar: Avatar) => void,
  ): Promise<Avatar>;

  destruct(): void;

  useAnimations(pool: AnimationPool): Promise<void>;

  triggerAnimationById(animationID: string, mirrored?: boolean): Promise<void>;
  triggerAnimationByCategory(category: AnimationCategory, mirrored?: boolean): void;

  triggerEmoji(name: string, url: string, version?: number): Promise<void>;

  selectCard(rarity: Rarity): void;

  requestBooster(targetPlayer: Avatar, _boosterId: number): void;
  receiveBooster(sourcePlayer: Avatar, _boosterId: number): void;
  useBooster(targetPlayer: Avatar, boosterId: number): void;

  update(deltaTime: number): void;
  animate(deltaTime: number): void;
}

export abstract class Avatar implements Avatar {
  public static ConfigureMaterialProperties(entity: THREE.Object3D): void {
    entity.traverse((object) => {
      if (object instanceof THREE.Mesh === false) {
        return;
      }

      const mesh = object as THREE.Mesh;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const geometry = mesh.geometry;
      geometry.setAttribute('uv1', geometry.attributes.uv);

      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.side = THREE.FrontSide;

      material.envMapIntensity = 1.0;
      material.emissiveIntensity = 0.0;

      if (material?.alphaMap !== null) {
        material.alphaMap.generateMipmaps = true;
        material.alphaMap.anisotropy = 4;
        material.alphaMap.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.aoMap !== null) {
        material.aoMap.generateMipmaps = true;
        material.aoMap.anisotropy = 4;
        material.aoMap.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.bumpMap !== null) {
        material.bumpMap.generateMipmaps = true;
        material.bumpMap.anisotropy = 4;
        material.bumpMap.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.displacementMap !== null) {
        material.displacementMap.generateMipmaps = true;
        material.displacementMap.anisotropy = 4;
        material.displacementMap.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.emissiveMap !== null) {
        material.emissiveMap.generateMipmaps = true;
        material.emissiveMap.anisotropy = 4;
        material.emissiveMap.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.map !== null) {
        material.map.generateMipmaps = true;
        material.map.anisotropy = 4;
        material.map.minFilter = THREE.LinearMipmapLinearFilter;
      }

      if (material?.metalnessMap !== null) {
        material.metalnessMap.generateMipmaps = true;
        material.metalnessMap.anisotropy = 4;
      }

      if (material?.normalMap !== null) {
        material.normalMap.generateMipmaps = true;
        material.normalMap.anisotropy = 4;
        material.normalMap.minFilter = THREE.LinearMipmapLinearFilter;

        material.normalMapType = THREE.TangentSpaceNormalMap;
        material.normalScale.set(1.0, 1.0);
      }

      if (material?.roughnessMap !== null) {
        material.roughnessMap.generateMipmaps = true;
        material.roughnessMap.anisotropy = 4;
        material.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
      }
    });
  }

  public static ApplyShoeOffset(avatar: THREE.Object3D): void {
    const skeletonRoot = avatar?.getObjectByName('Root');

    if (!skeletonRoot || !skeletonRoot.userData || !skeletonRoot.userData['shoeOffset']) {
      return;
    }

    const shoeOffset = skeletonRoot.userData['shoeOffset'];

    logInfoVerbose(`Apply shoe offset ${shoeOffset}`);

    skeletonRoot.position.set(
      skeletonRoot.position.x,
      shoeOffset,
      skeletonRoot.position.z,
    );

    skeletonRoot.updateMatrix();
  }
}
