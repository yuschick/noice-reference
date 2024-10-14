import { IMatchGroup } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';

import type { CGActiveBooster, CGAvailableBooster } from './boosters';
import type { CGActiveCard } from './card';
import type { GameConfig } from './game';
import type { CGGroup } from './group';
import type { CGPlayer } from './player';

export interface StateConfig {
  includeOfflinePlayers: boolean;
}

export interface GameStateProvider {
  getMatchConnection(): IMatchGroup | null;
  getPlayer(playerId: string): CGPlayer | null;
  getPlayers(...playerIds: string[]): CGPlayer[];
  getGroup(groupId: string): CGGroup | undefined;
  getActiveConfig(): GameConfig | null;
  getActiveBooster(cardOwner: string, boosterOwner: string): CGActiveBooster | undefined;
  getPlayerActiveCard(playerId: string): CGActiveCard | undefined;
  getPlayerAvailableBooster(playerId: string): CGAvailableBooster | undefined;
  getServerTime(): Nullable<string>;
  logDebugClient(eventName: string, data: Record<string, unknown>): void;
}
