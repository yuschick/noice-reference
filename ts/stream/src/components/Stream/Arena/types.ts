import { Nullable } from '@noice-com/utils';
import * as Comlink from 'comlink';

import { ArenaBridge } from './classes/ArenaBridge';

export type ArenaHandlerType = Nullable<Comlink.Remote<ArenaBridge> | ArenaBridge>;

export enum BatteryStatus {
  Unavailable,
  Discharging,
  Charging,
}
export type ScreenParamsCallback = (params: {
  x: number;
  y: number;
  w: number;
  h: number;
}) => void;
