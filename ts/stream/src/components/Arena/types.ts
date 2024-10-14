import { Nullable } from '@noice-com/utils';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { ArenaController } from './classes/ArenaController';
export { Stats };

export type ArenaControllerType = Nullable<ArenaController>;

export enum BatteryStatus {
  Unavailable,
  Discharging,
  Charging,
}
