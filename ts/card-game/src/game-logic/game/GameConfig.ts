import { MatchConfiguration } from '@noice-com/schemas/game-logic/game_logic.pb';
import { makeLoggers } from '@noice-com/utils';

const { logWarn } = makeLoggers('CardGameConfig');

export class GameConfig {
  public readonly aonPointMultipliers: number[];
  public readonly boosterCooldowns: number[]; // in ms
  public readonly cardSwitchOutTimerDuration: number; // in ms
  public readonly gameId: string;
  public readonly handSize: number;
  public readonly pointsGainTime: number; // in ms
  public readonly reshuffleBaseCost: number;
  public readonly reshuffleCostMultiplier: number;
  public readonly seasonId: string;
  public readonly missingConfigs: (keyof MatchConfiguration)[];

  constructor(config: MatchConfiguration = {}) {
    this.aonPointMultipliers = config.aonPointMultipliers ?? [1];
    this.boosterCooldowns = (config.boosterCooldowns ?? ['60000']).map((cooldown) =>
      parseInt(cooldown, 10),
    );
    this.cardSwitchOutTimerDuration = parseInt(
      config.cardSwitchOutTimerDuration ?? '30000',
      10,
    );
    this.gameId = config.gameId ?? 'unspecified';
    this.handSize = config.handSize ?? 5;
    this.pointsGainTime = config.pointsGainTime ?? 5000;
    this.reshuffleBaseCost = config.reshuffleBaseCost ?? 1;
    this.reshuffleCostMultiplier = config.reshuffleCostMultiplier ?? 1;
    this.seasonId = config.seasonId ?? 'Unknown season';
    this.missingConfigs = this._findMissingConfigs(config);

    if (this.missingConfigs.length > 0) {
      logWarn(
        `Match Config was missing the following keys, so defaults were used:`,
        this.missingConfigs,
      );
    }
  }

  private _findMissingConfigs(config: MatchConfiguration): (keyof MatchConfiguration)[] {
    const possibleKeys: (keyof MatchConfiguration)[] = [
      'aonPointMultipliers',
      'boosterCooldowns',
      'cardSwitchOutTimerDuration',
      'gameId',
      'handSize',
      'pointsGainTime',
      'reshuffleBaseCost',
      'reshuffleCostMultiplier',
      'seasonId',
    ];

    return possibleKeys.filter((configKey) => typeof config[configKey] === 'undefined');
  }
}
