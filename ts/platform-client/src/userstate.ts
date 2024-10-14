import { InventoryUpdateEvent } from '@noice-com/schemas/inventory/inventory.pb';
import {
  ProgressionUpdateEvent,
  Level,
} from '@noice-com/schemas/progression/progression.pb';

import { UserState, ProgressionUpdates, ExperiencePointsWithNextLevel } from './types';

const stringMath = (operator: 'add' | 'substract', a?: string, b?: string): string => {
  const numA = parseInt(a ?? '', 10);
  const numB = parseInt(b ?? '', 10);

  switch (operator) {
    case 'add':
      return `${numA + numB}`;
    case 'substract':
      return `${numA - numB}`;
  }
};

export function progressionUpdatesFromEvent(
  userId: string,
  ev: ProgressionUpdateEvent,
): ProgressionUpdates {
  const progressionUpdates: ProgressionUpdates = {
    xp: [],
    level: [],
    reason: ev.reason,
  };

  ev.updates?.forEach((updateEvent) => {
    let newThing: ExperiencePointsWithNextLevel | Level | undefined;
    let oldThing: ExperiencePointsWithNextLevel | Level | undefined;
    let eventType: 'experiencePoints' | 'level' | undefined;
    let progressionType: Exclude<keyof ProgressionUpdates | undefined, 'reason'>;

    if (updateEvent.experiencePoints) {
      newThing = updateEvent.experiencePoints.newPoints;
      oldThing = updateEvent.experiencePoints.oldPoints;
      eventType = 'experiencePoints';
      progressionType = 'xp';
    } else if (updateEvent.level) {
      newThing = updateEvent.level.newLevel;
      oldThing = updateEvent.level.oldLevel;
      eventType = 'level';
      progressionType = 'level';
    }

    if (newThing && oldThing && eventType && progressionType) {
      let updateType: 'channel' | 'fan' | 'season' | undefined;

      if (newThing.channel) {
        updateType = 'channel';
      } else if (newThing.fan) {
        updateType = 'fan';
      } else if (newThing.season) {
        updateType = 'season';
      }

      if (updateType && newThing[updateType].userId === userId) {
        progressionUpdates[progressionType].push({
          old: oldThing,
          new: newThing,
        });
      }
    }
  });

  return progressionUpdates;
}

export function stateFromInventoryUpdate(
  userId: string,
  ev: InventoryUpdateEvent,
  prev: UserState,
): [UserState, InventoryUpdateEvent] {
  const copy = { ...prev };
  const filteredUpdate: InventoryUpdateEvent = {
    events: ev.events?.filter((event) => {
      if (event.userId !== userId) {
        return false;
      }

      if (event.consumption) {
        const item = copy.inventory.find(
          (item) => item.itemId === event.consumption.itemId,
        );

        if (item && item.itemCount && event.consumption.itemCount) {
          item.itemCount = stringMath(
            'substract',
            item.itemCount,
            event.consumption.itemCount,
          );
        }
      } else if (event.entitlement) {
        const item = copy.inventory.find(
          (item) => item.itemId === event.entitlement.itemId,
        );

        if (!item) {
          copy.inventory.push({
            itemId: event.entitlement.itemId,
            itemCount: event.entitlement.itemCount,
          });
        } else {
          item.itemCount = stringMath('add', item.itemCount, event.entitlement.itemCount);
        }
      }

      if (event.reason?.rewardClaimed) {
        copy.unclaimedRewards = copy.unclaimedRewards.filter(
          (reward) => reward.id !== event.reason.rewardClaimed.rewardId,
        );
      }

      return true;
    }),
  };

  return [copy, filteredUpdate];
}
