import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
// eslint-disable-next-line no-restricted-imports
import { API } from '@noice-com/web-renderer/src/legacy';

export const crowdModes = [
  { label: 'All', value: CrowdMode.All },
  { label: 'My Team Only', value: CrowdMode.LocalGroupOnly },
  { label: 'Disabled', value: CrowdMode.Disabled },
];

export const frameRates = [
  { label: 'Full', value: API.FrameRate.Full },
  { label: 'Half', value: API.FrameRate.Half },
  { label: 'Quarter', value: API.FrameRate.Quarter },
];

export const crowdAnimationRates = [
  { label: 'Full', value: API.CrowdAnimationRate.Full },
  { label: 'Half', value: API.CrowdAnimationRate.Half },
  { label: 'Quarter', value: API.CrowdAnimationRate.Quarter },
];

export const crowdDetails = [
  { label: 'Highest', value: API.CrowdDetail.Highest },
  { label: 'High', value: API.CrowdDetail.High },
  { label: 'High In My Team', value: API.CrowdDetail.HighOwnGroup },
  { label: 'Medium', value: API.CrowdDetail.Medium },
  { label: 'Low', value: API.CrowdDetail.Low },
];

export const shadowTypes = [
  { label: 'Disabled', value: API.ShadowType.Disabled },
  { label: 'Unfiltered', value: API.ShadowType.Unfiltered },
  { label: 'Percentage Close Filtered', value: API.ShadowType.PercentageCloseFiltered },
  {
    label: 'Soft Percentage Close Filtered',
    value: API.ShadowType.SoftPercentageCloseFiltered,
  },
  { label: 'Variance Prefiltered', value: API.ShadowType.VariancePrefiltered },
];

export const shadowQualities = [
  { label: 'Low', value: API.ShadowQuality.Low },
  { label: 'Medium', value: API.ShadowQuality.Medium },
  { label: 'High', value: API.ShadowQuality.High },
];

export const lightingTypes = [
  { label: 'Full', value: API.LightingType.Full },
  { label: 'High Priority Only', value: API.LightingType.HighPriorityOnly },
  { label: 'Directional Only', value: API.LightingType.DirectionalOnly },
  { label: 'None', value: API.LightingType.None },
];

export const antiAliasingTypes = [
  { label: 'SMAA', value: API.AntiAliasing.SMAA },
  { label: 'FXAA', value: API.AntiAliasing.FXAA },
  { label: 'None', value: API.AntiAliasing.None },
];

export const crowdResolutions = [
  { label: 'Full', value: API.CrowdResolution.Full },
  { label: 'Half', value: API.CrowdResolution.Half },
  { label: 'Quarter', value: API.CrowdResolution.Quarter },
];
