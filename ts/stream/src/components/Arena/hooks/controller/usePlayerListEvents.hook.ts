import { useEffect, useState } from 'react';

import { ArenaControllerType } from '../../types';

import { StreamProps } from '@stream-types';

interface Props {
  arenaController: ArenaControllerType;
  streamProps: StreamProps;
}

export function usePlayerListEvents({ arenaController, streamProps }: Props) {
  const [_, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!streamProps.avatars.value || !arenaController) {
      return;
    }

    setUserIds((prev) => {
      const addList = streamProps.avatars.value?.avatars?.filter((avatar) => {
        if (!avatar.userId) {
          return false;
        }

        return !prev.includes(avatar.userId);
      });

      const removeList = prev.filter(
        (userId) =>
          streamProps.avatars.value?.avatars?.findIndex(
            (avatar) => avatar.userId && avatar.userId === userId,
          ) === -1,
      );

      addList?.forEach(
        (avatar) =>
          avatar.userId &&
          arenaController.addPlayer({ playerId: avatar.userId, avatarConfig: avatar }),
      );

      removeList.forEach((userId) => arenaController.removePlayer(userId));

      return (
        streamProps.avatars.value?.avatars?.reduce<string[]>((prevValue, current) => {
          current.userId && prevValue.push(current.userId);
          return prevValue;
        }, []) ?? []
      );
    });
  }, [streamProps.avatars, arenaController]);
}
