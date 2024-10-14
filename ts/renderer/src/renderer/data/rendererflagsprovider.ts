import { RendererFlags } from './types';

export class RendererFlagsProvider {
  private static _featureFlags: { [feature: string]: string } = {};

  private static _getFeatureFlag(name: string, defaultValue: string): string {
    return this._featureFlags[name] || defaultValue;
  }

  public static BuildRendererFlags(featureFlags?: {
    [featureName: string]: string;
  }): RendererFlags {
    this._featureFlags = featureFlags || {};

    const useVideoFrame = this._getFeatureFlag('useVideoFame', 'none') === 'true';
    const useDynamicFrameLimiter =
      this._getFeatureFlag('useDynamicFramerateLimiter', 'none') === 'true';
    const showUsernames =
      this._getFeatureFlag('rendering_showUsernames', 'none') === 'true';

    return {
      useVideoFrame,
      useDynamicFrameLimiter,
      showUsernames,
    };
  }
}
