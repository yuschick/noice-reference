// eslint-disable-next-line no-restricted-imports
import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
// eslint-disable-next-line no-restricted-imports
import { API } from '@noice-com/web-renderer/src/legacy';

export interface RenderQualityProfileSettings {
  crowdAnimationRate: API.CrowdAnimationRate;
  crowdDetail: API.CrowdDetail;
  crowdResolution: API.CrowdResolution;
  crowdMode: CrowdMode;
  frameRate: API.FrameRate;
  shadowType: API.ShadowType;
  shadowQuality: API.ShadowQuality;
  lightingType: API.LightingType;
  antiAliasing: API.AntiAliasing;
}

export interface RenderQualityProfile {
  name: string;
  settings: RenderQualityProfileSettings;
}
