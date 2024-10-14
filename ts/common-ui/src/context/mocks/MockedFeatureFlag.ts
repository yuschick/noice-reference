import { IFeatureFlags } from '@noice-com/platform-client';
import { FeatureFlagState } from '@noice-com/schemas/flag/flag.pb';

export class MockedFeatureFlags implements IFeatureFlags {
  private _values: { [key: string]: string } = {};
  constructor(states: FeatureFlagState[]) {
    states.forEach((state) => {
      if (state.name && state.value) {
        this._values[state.name] = state.value;
      }
    });
  }

  public get(name: string, defaultValue = ''): string {
    return this._values[name] || defaultValue;
  }

  public has(name: string): boolean {
    return this._values.hasOwnProperty(name);
  }

  public values(): { [key: string]: string } {
    return { ...this._values };
  }
}
