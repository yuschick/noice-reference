/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FullMatchConfig, getPartialConfig } from '../../__testdata__/match-config';
import { GameConfig } from '../GameConfig';

describe('GameConfig', () => {
  it('should convert string values to numbers', () => {
    const { boosterCooldowns, cardSwitchOutTimerDuration } = FullMatchConfig;

    const config = new GameConfig({
      boosterCooldowns,
      cardSwitchOutTimerDuration,
    });

    expect(config.boosterCooldowns).toEqual(
      boosterCooldowns!.map((cd) => parseInt(cd, 10)),
    );
    expect(config.cardSwitchOutTimerDuration).toEqual(
      parseInt(cardSwitchOutTimerDuration!, 10),
    );
  });

  it('should expose the configs that were missing during initialization', () => {
    const partialConfig = getPartialConfig(
      'boosterCooldowns',
      'cardSwitchOutTimerDuration',
    );
    const config = new GameConfig(partialConfig);

    expect(config.missingConfigs).toHaveLength(2);
    expect(config.missingConfigs).toEqual([
      'boosterCooldowns',
      'cardSwitchOutTimerDuration',
    ]);
  });
});
