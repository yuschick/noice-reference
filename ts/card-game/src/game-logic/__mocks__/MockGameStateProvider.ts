import { IMatchGroup } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';

import { CGActiveBooster, CGAvailableBooster } from '../boosters';
import { CGActiveCard } from '../card';
import { GameConfig } from '../game';
import { CGGroup } from '../group';
import { CGPlayer } from '../player';
import { GameStateProvider } from '../types';

export class MockGameStateProvider implements GameStateProvider {
  public logDebugClient: jest.MockedFunction<
    (eventName: string, data: Record<string, unknown>) => void
  > = jest.fn();
  public getMatchConnection: jest.MockedFunction<() => IMatchGroup | null> = jest.fn();
  public getActiveConfig: jest.MockedFunction<() => GameConfig | null> = jest.fn();
  public getGroup: jest.MockedFunction<(_groupId: string) => CGGroup | undefined> =
    jest.fn();
  public getPlayer: jest.MockedFunction<(playerId: string) => CGPlayer | null> =
    jest.fn();
  public getPlayers: jest.MockedFunction<(..._playerIds: string[]) => CGPlayer[]> =
    jest.fn();
  public getPlayerActiveCard: jest.MockedFunction<
    (playerId: string) => CGActiveCard | undefined
  > = jest.fn();
  public getPlayerAvailableBooster: jest.MockedFunction<
    (playerId: string) => CGAvailableBooster | undefined
  > = jest.fn();
  public getActiveBooster: jest.MockedFunction<
    (cardOwner: string, boosterOwner: string) => CGActiveBooster | undefined
  > = jest.fn();
  public getServerTime(): Nullable<string> {
    return '21168';
  }
}
