import {
  BoosterRequestedEvent,
  BoosterUsedEvent,
  CardSetActiveEvent,
} from '@noice-com/schemas/rendering/events.pb';
import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

import { StreamEventEmitter } from '@stream-classes';

interface Props {
  arenaController: ArenaControllerType;
  eventEmitter: StreamEventEmitter;
}

export function useGamePlayEvents({ arenaController, eventEmitter }: Props) {
  useEffect(() => {
    if (!arenaController || !eventEmitter) {
      return;
    }

    const onBoosterRequestedEvent = ({
      userId,
      targetUserId,
      boosterId,
    }: BoosterRequestedEvent) => {
      if (!userId || !targetUserId || !boosterId) {
        return;
      }

      arenaController.triggerRequestBooster({ targetPlayerId: targetUserId, boosterId });
    };

    const onBoosterUsedEvent = ({
      userId,
      targetUserId,
      boosterId,
    }: BoosterUsedEvent) => {
      if (!userId || !targetUserId || !boosterId) {
        return;
      }

      arenaController.triggerBooster({
        playerId: userId,
        targetPlayerId: targetUserId,
        boosterId,
      });
    };

    const onCardSetActiveEvent = ({ userId, cardRarity }: CardSetActiveEvent) => {
      if (!userId) {
        return;
      }

      arenaController.triggerSelectCard({ playerId: userId, cardRarity });
    };

    eventEmitter.addListener('onBoosterRequestedEvent', onBoosterRequestedEvent);
    eventEmitter.addListener('onBoosterUsedEvent', onBoosterUsedEvent);
    eventEmitter.addListener('onCardSetActiveEvent', onCardSetActiveEvent);

    return () => {
      eventEmitter.removeListener('onBoosterRequestedEvent', onBoosterRequestedEvent);
      eventEmitter.removeListener('onBoosterUsedEvent', onBoosterUsedEvent);
      eventEmitter.removeListener('onCardSetActiveEvent', onCardSetActiveEvent);
    };
  }, [arenaController, eventEmitter]);
}
