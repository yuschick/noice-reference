import { EventType } from '@noice-com/schemas/game-stream-events/game_stream_events.pb';

import { GameEventAttribute } from '../types';

export const fortniteEventTypes = [
  EventType.EVENT_TYPE_WIN_MATCH,
  EventType.EVENT_TYPE_STORM_CHANGE,
  EventType.EVENT_TYPE_HEADSHOT,
  EventType.EVENT_TYPE_ELIMINATION,
  EventType.EVENT_TYPE_HARVEST,
  EventType.EVENT_TYPE_OPEN_CHEST,
  EventType.EVENT_TYPE_HEALTH_CHANGE,
  EventType.EVENT_TYPE_TEAMMATE_ELIMINATION,
  EventType.EVENT_TYPE_TEAMMATE_REBOOT,
  EventType.EVENT_TYPE_FISHING,
  EventType.EVENT_TYPE_HUNT_WILDLIFE,
];

export const stringAttributesForEvent: {
  type: EventType;
  attributes: GameEventAttribute[];
}[] = [
  {
    type: EventType.EVENT_TYPE_ELIMINATION,
    attributes: [
      {
        key: 'weaponType',
        value: {
          options: [
            'Pistol',
            'SMG',
            'Shotgun',
            'Rifle',
            'Sniper rifle',
            'Trap',
            'Vehicle',
            'Burn',
            'Explosive',
            'Environment',
            'Storm',
            'Harvesting tool',
            'Bow',
            'Heavy MG',
            'Melee',
            'DMR',
          ],
        },
      },
    ],
  },
  {
    type: EventType.EVENT_TYPE_OPEN_CHEST,
    attributes: [
      {
        key: 'chestType',
        value: {
          options: ['Chest', 'Rare chest', 'Ammo box', 'Supply drop'],
        },
      },
    ],
  },
];

export const intAttributesForEvent: {
  type: EventType;
  attributes: GameEventAttribute[];
}[] = [
  {
    type: EventType.EVENT_TYPE_HARVEST,
    attributes: [
      {
        key: 'woodValue',
      },
      {
        key: 'brickValue',
      },
      {
        key: 'ironValue',
      },
    ],
  },
  {
    type: EventType.EVENT_TYPE_HEALTH_CHANGE,
    attributes: [
      {
        key: 'healthChange',
      },
    ],
  },
];

export const booleanAttributesForEvent: {
  type: EventType;
  attributes: GameEventAttribute[];
}[] = [
  {
    type: EventType.EVENT_TYPE_HEALTH_CHANGE,
    attributes: [
      {
        key: 'takesDamage',
      },
      {
        key: 'stormDamage',
      },
      {
        key: 'isMaxHealth',
      },
      {
        key: 'isMaxShield',
      },
    ],
  },
];
