export interface RenderQualitySettings {
  crowdAnimationRate: CrowdAnimationRate;
  crowdDetail: CrowdDetail;
  crowdMode: CrowdMode;
  frameRate: FrameRate;
  shadowType: ShadowType;
  shadowQuality: ShadowQuality;
  lightingType: LightingType;
  antiAliasing: AntiAliasing;
}

export enum CrowdAnimationRate {
  Full = 1,
  Half = 2,
  Quarter = 4,
}

export enum FrameRate {
  Full = 1,
  Half = 2,
  Quarter = 4,
}

export enum CrowdMode {
  Disabled = 'disabled',
  All = 'all',
  LocalGroupOnly = 'localGroupOnly',
}

export enum CrowdDetail {
  Highest = 'highest',
  High = 'high',
  HighOwnGroup = 'highOwnGroup',
  Medium = 'medium',
  Low = 'low',
}

export enum CrowdResolution {
  Full = 1.0,
  Half = 0.5,
  Quarter = 0.25,
}

export enum ShadowType {
  Disabled = 'disabled',
  Unfiltered = 'unfiltered',
  PercentageCloseFiltered = 'percentageCloseFiltered',
  SoftPercentageCloseFiltered = 'softPercenrageCloseFiltered',
  VariancePrefiltered = 'variancePrefiltered',
}

export enum ShadowQuality {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum LightingType {
  Full = 'full',
  HighPriorityOnly = 'highPriorityOnly',
  DirectionalOnly = 'directionalOnly',
  None = 'none',
}

export enum AntiAliasing {
  FXAA = 'fxaa',
  SMAA = 'smaa',
  None = 'none',
}
