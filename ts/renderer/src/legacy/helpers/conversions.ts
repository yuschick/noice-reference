import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import { Rotation, Vector3 } from '@noice-com/schemas/rendering/rendering.pb';
import * as THREE from 'three';

export function mapRarityToEnum(rarity: number): Rarity {
  switch (rarity) {
    case 1:
      return Rarity.RARITY_COMMON;
    case 2:
      return Rarity.RARITY_UNCOMMON;
    case 3:
      return Rarity.RARITY_RARE;
    case 4:
      return Rarity.RARITY_EPIC;
    case 5:
      return Rarity.RARITY_LEGENDARY;
    default:
      return Rarity.RARITY_UNSPECIFIED;
  }
}

export function mapRarityToColor(rarity: Rarity): THREE.Color {
  switch (rarity) {
    case Rarity.RARITY_COMMON:
      return new THREE.Color(0xe5e5e7);
    case Rarity.RARITY_UNCOMMON:
      return new THREE.Color(0x2fecbf);
    case Rarity.RARITY_RARE:
      return new THREE.Color(0x5bdbf6);
    case Rarity.RARITY_EPIC:
      return new THREE.Color(0xdb9afb);
    case Rarity.RARITY_LEGENDARY:
      return new THREE.Color(0xf2ca64);
    default:
      return new THREE.Color(0xff00ff);
  }
}

export function convertUnityPositionVectorToTHREE(
  position?: THREE.Vector3 | Vector3,
): THREE.Vector3 {
  // position.x is flipped due to the differences between Unity's and Three.js' coordinate systems.
  return new THREE.Vector3(-(position?.x ?? 0.0), position?.y ?? 0.0, position?.z ?? 0.0);
}

export function convertUnityCameraRotationVectorToTHREE(
  rotation?: THREE.Quaternion | Rotation,
): THREE.Euler {
  const euler = new THREE.Euler();

  euler.setFromQuaternion(
    new THREE.Quaternion(
      rotation?.x ?? 0.0,
      rotation?.y ?? 0.0,
      rotation?.z ?? 0.0,
      rotation?.w ?? 0.0,
    ),
  );

  /* Turns out Three.js' camera is pointing down negative Z, unlike Unity's which points down positive Z. We need to
   * rotate the camera by 180 degrees around the Y axis to make sense of things. */
  euler.set(euler.x, euler.y + THREE.MathUtils.degToRad(180.0), euler.z);

  return euler;
}

export function convertUnityEntityRotationVectorToTHREE(
  rotation: THREE.Quaternion | Rotation,
): THREE.Euler {
  const euler = new THREE.Euler();

  euler.setFromQuaternion(
    new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
  );

  euler.x += THREE.MathUtils.degToRad(180.0);
  euler.z += THREE.MathUtils.degToRad(180.0);

  return euler;
}
