import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
// eslint-disable-next-line no-restricted-imports
import { API } from '@noice-com/web-renderer/src/legacy';

import { RenderQualityProfile } from '@stream-types';

export const ROOT_STREAM_SETTINGS_PAGE_ID = 'main';
export const CUSTOM_RENDER_QUALITY_PROFILE_INDEX = -1;
export const RenderQualityProfiles: RenderQualityProfile[] = [
  {
    name: 'High',
    settings: {
      crowdAnimationRate: API.CrowdAnimationRate.Full,
      crowdDetail: API.CrowdDetail.High,
      crowdResolution: API.CrowdResolution.Full,
      crowdMode: CrowdMode.All,
      frameRate: API.FrameRate.Full,
      lightingType: API.LightingType.Full,
      shadowType: API.ShadowType.SoftPercentageCloseFiltered,
      shadowQuality: API.ShadowQuality.High,
      antiAliasing: API.AntiAliasing.SMAA,
    },
  },
  {
    name: 'Medium',
    settings: {
      crowdAnimationRate: API.CrowdAnimationRate.Full,
      crowdDetail: API.CrowdDetail.High,
      crowdResolution: API.CrowdResolution.Full,
      crowdMode: CrowdMode.All,
      frameRate: API.FrameRate.Full,
      lightingType: API.LightingType.HighPriorityOnly,
      shadowType: API.ShadowType.PercentageCloseFiltered,
      shadowQuality: API.ShadowQuality.Medium,
      antiAliasing: API.AntiAliasing.SMAA,
    },
  },
  {
    name: 'Low',
    settings: {
      crowdAnimationRate: API.CrowdAnimationRate.Full,
      crowdDetail: API.CrowdDetail.HighOwnGroup,
      crowdResolution: API.CrowdResolution.Full,
      crowdMode: CrowdMode.All,
      frameRate: API.FrameRate.Half,
      lightingType: API.LightingType.HighPriorityOnly,
      shadowType: API.ShadowType.Disabled,
      shadowQuality: API.ShadowQuality.Low,
      antiAliasing: API.AntiAliasing.FXAA,
    },
  },
  {
    name: 'Minimal',
    settings: {
      crowdAnimationRate: API.CrowdAnimationRate.Full,
      crowdDetail: API.CrowdDetail.High,
      crowdResolution: API.CrowdResolution.Full,
      crowdMode: CrowdMode.LocalGroupOnly,
      frameRate: API.FrameRate.Half,
      lightingType: API.LightingType.HighPriorityOnly,
      shadowType: API.ShadowType.Disabled,
      shadowQuality: API.ShadowQuality.Low,
      antiAliasing: API.AntiAliasing.None,
    },
  },
];
