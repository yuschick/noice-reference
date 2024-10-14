import { Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { AvatarViewer } from '@noice-com/web-renderer/src/legacy';
import useAnimationFrame from '@restart/hooks/useAnimationFrame';
import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';

import { CameraSettings, FocusTarget } from '../../CategorySelect/types';
import { Avatar } from '../../types';

interface Props {
  cameraSettings: Nullable<CameraSettings>;
  avatarViewer: Nullable<AvatarViewer>;
  avatar: Avatar;
}

interface HookResult {
  animating: boolean;
}

export function useCameraZoom({
  cameraSettings,
  avatarViewer,
  avatar,
}: Props): HookResult {
  const [animating, setAnimating] = useState(false);
  const animationFrame = useAnimationFrame();

  const animateCamera = useCallback(
    (
      origPos: THREE.Vector3,
      newPos: THREE.Vector3,
      duration: number,
      startTime: number,
    ) => {
      if (!avatarViewer?.orbitControls) {
        return;
      }

      const deltaTime = new Date().getTime() - startTime;
      const animationPos = deltaTime / duration;

      if (animationPos >= 1) {
        avatarViewer.orbitControls.object.position.set(newPos.x, newPos.y, newPos.z);
        setAnimating(false);
        return;
      }

      const pos = origPos.lerp(newPos, animationPos);
      avatarViewer.orbitControls.object.position.set(pos.x, pos.y, pos.z);

      animationFrame.request(() => animateCamera(origPos, newPos, duration, startTime));
    },
    [animationFrame, avatarViewer],
  );

  useEffect(() => {
    if (!avatarViewer || !cameraSettings || !avatar) {
      return;
    }

    // Find the bone to zoom into
    const targetBone = avatar.skeleton.bones.find(
      (bone) => bone.name === cameraSettings.target,
    );

    if (!targetBone) {
      return;
    }

    const centerPos =
      avatar.skeleton.bones
        .find((b) => b.name === FocusTarget.Hips)
        ?.getWorldPosition(new THREE.Vector3()) ?? avatarViewer.cameraZoomOutPos;

    const target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    targetBone?.getWorldPosition(target);

    avatarViewer.cameraZoomOutPos = centerPos;
    avatarViewer.cameraTargetPos = target;
    avatarViewer.orbitControls.minDistance = cameraSettings.minDistance;

    const targetY = avatarViewer.getCameraYForDistance(cameraSettings.distance);

    const newPos = new THREE.Vector3()
      .copy(avatarViewer.orbitControls.object.position)
      .sub(new THREE.Vector3(0, avatarViewer.orbitControls.object.position.y, 0))
      .setLength(cameraSettings.distance)
      .add(new THREE.Vector3(0, targetY, 0));

    avatarViewer.orbitControls.enableZoom = cameraSettings.allowZoom;
    avatarViewer.orbitControls.target.y = targetY;

    setAnimating(true);
    animateCamera(
      avatarViewer.orbitControls.object.position,
      newPos,
      200,
      new Date().getTime(),
    );
  }, [cameraSettings, avatarViewer, avatar, animateCamera]);

  return { animating };
}
