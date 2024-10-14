import { useConditionalOnce } from '@noice-com/common-react-core';
import { useAvatarAnimations } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { AnimationPoolV2 } from '@noice-com/web-renderer/src/legacy';
import { useEffect, useRef } from 'react';

import { AnimatedEditorAvatar } from '../AvatarPreview/AnimatedEditorAvatar';
import { Avatar } from '../types';

interface Props {
  avatar: Avatar;
}

interface HookResult {
  animatedAvatar: Nullable<AnimatedEditorAvatar>;
}

export function useAnimatedAvatar({ avatar }: Props): HookResult {
  const { animations, loading: isLoadingAnimations } = useAvatarAnimations();
  const animatedAvatarRef = useRef<Nullable<AnimatedEditorAvatar>>(null);

  useConditionalOnce(() => {
    const pool = new AnimationPoolV2(animations || []);
    animatedAvatarRef.current = new AnimatedEditorAvatar(pool);
  }, !!animations && !isLoadingAnimations);

  useEffect(() => {
    if (isLoadingAnimations || !animatedAvatarRef.current) {
      return;
    }

    animatedAvatarRef.current.avatarComposition = avatar;
  }, [avatar, isLoadingAnimations]);

  return { animatedAvatar: animatedAvatarRef.current };
}
