import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
import {
  AnalyticsCrowdDetailType,
  AnalyticsShadowType,
  AnalyticsLightingType,
  AnalyticsCrowdMode,
  AnalyticsAntiAliasingType,
  AnalyticsShadowQuality,
} from '@noice-com/schemas/analytics/analytics.pb';
// eslint-disable-next-line no-restricted-imports
import { API } from '@noice-com/web-renderer/src/legacy';

import { RenderQualityProfileSettings } from './stream-settings';

export function convertPerformanceProfileForAnalytics(
  profile: RenderQualityProfileSettings,
) {
  let crowdDetailEnum = AnalyticsCrowdDetailType.ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED;

  switch (profile.crowdDetail) {
    case API.CrowdDetail.High:
      crowdDetailEnum = AnalyticsCrowdDetailType.ANALYTICS_CROWD_DETAIL_TYPE_HIGH;
      break;
    case API.CrowdDetail.HighOwnGroup:
      crowdDetailEnum =
        AnalyticsCrowdDetailType.ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP;
      break;
    case API.CrowdDetail.Low:
      crowdDetailEnum = AnalyticsCrowdDetailType.ANALYTICS_CROWD_DETAIL_TYPE_LOW;
  }

  let shadowTypeEnum = AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_UNSPECIFIED;

  switch (profile.shadowType) {
    case API.ShadowType.Disabled:
      shadowTypeEnum = AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_DISABLED;
      break;
    case API.ShadowType.Unfiltered:
      shadowTypeEnum = AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_UNFILTERED;
      break;
    case API.ShadowType.PercentageCloseFiltered:
      shadowTypeEnum =
        AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED;
      break;
    case API.ShadowType.SoftPercentageCloseFiltered:
      shadowTypeEnum =
        AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED;
      break;
    case API.ShadowType.VariancePrefiltered:
      shadowTypeEnum = AnalyticsShadowType.ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED;
      break;
  }

  let shadowQuality = AnalyticsShadowQuality.ANALYTICS_SHADOW_QUALITY_UNSPECIFIED;

  switch (profile.shadowQuality) {
    case API.ShadowQuality.Low:
      shadowQuality = AnalyticsShadowQuality.ANALYTICS_SHADOW_QUALITY_LOW;
      break;
    case API.ShadowQuality.Medium:
      shadowQuality = AnalyticsShadowQuality.ANALYTICS_SHADOW_QUALITY_MEDIUM;
      break;
    case API.ShadowQuality.High:
      shadowQuality = AnalyticsShadowQuality.ANALYTICS_SHADOW_QUALITY_HIGH;
  }

  let lightingTypeEnum = AnalyticsLightingType.ANALYTICS_LIGHTING_TYPE_UNSPECIFIED;

  switch (profile.lightingType) {
    case API.LightingType.DirectionalOnly:
      lightingTypeEnum = AnalyticsLightingType.ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY;
      break;
    case API.LightingType.Full:
      lightingTypeEnum = AnalyticsLightingType.ANALYTICS_LIGHTING_TYPE_FULL;
      break;
    case API.LightingType.HighPriorityOnly:
      lightingTypeEnum = AnalyticsLightingType.ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY;
      break;
    case API.LightingType.None:
      lightingTypeEnum = AnalyticsLightingType.ANALYTICS_LIGHTING_TYPE_NONE;
      break;
  }

  let crowdModeEnum = AnalyticsCrowdMode.ANALYTICS_CROWD_MODE_UNSPECIFIED;

  switch (profile.crowdMode) {
    case CrowdMode.Disabled:
      crowdModeEnum = AnalyticsCrowdMode.ANALYTICS_CROWD_MODE_NONE;
      break;
    case CrowdMode.LocalGroupOnly:
      crowdModeEnum = AnalyticsCrowdMode.ANALYTICS_CROWD_MODE_LOCAL_GROUP;
      break;
    case CrowdMode.All:
      crowdModeEnum = AnalyticsCrowdMode.ANALYTICS_CROWD_MODE_ALL;
      break;
  }

  let antiAliasingTypeEnum =
    AnalyticsAntiAliasingType.ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED;

  switch (profile.antiAliasing) {
    case API.AntiAliasing.SMAA:
      antiAliasingTypeEnum = AnalyticsAntiAliasingType.ANALYTICS_ANTI_ALIASING_TYPE_SMAA;
      break;
    case API.AntiAliasing.FXAA:
      antiAliasingTypeEnum = AnalyticsAntiAliasingType.ANALYTICS_ANTI_ALIASING_TYPE_FXAA;
      break;
    case API.AntiAliasing.None:
      antiAliasingTypeEnum = AnalyticsAntiAliasingType.ANALYTICS_ANTI_ALIASING_TYPE_NONE;
      break;
  }

  return {
    crowdAnimationRate: profile.crowdAnimationRate,
    crowdDetail: crowdDetailEnum,
    crowdResolution: profile.crowdResolution,
    crowdMode: crowdModeEnum,
    frameRate: profile.frameRate,
    shadowType: shadowTypeEnum,
    lightingType: lightingTypeEnum,
    antiAliasing: antiAliasingTypeEnum,
    shadowQuality: shadowQuality,
  };
}
