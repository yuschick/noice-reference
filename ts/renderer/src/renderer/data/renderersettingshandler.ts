import { Observable } from '@noice-com/utils';

import * as RenderSettings from '../../api/rendersettings';

export class RendererSettingsHandler {
  private _frameRate = new Observable<RenderSettings.FrameRate>(
    RenderSettings.FrameRate.Full,
  );
  public get frameRate(): Observable<RenderSettings.FrameRate> {
    return this._frameRate;
  }

  private _shadowType = new Observable<RenderSettings.ShadowType>(
    RenderSettings.ShadowType.SoftPercentageCloseFiltered,
  );
  public get shadowType(): Observable<RenderSettings.ShadowType> {
    return this._shadowType;
  }

  private _shadowQuality = new Observable<RenderSettings.ShadowQuality>(
    RenderSettings.ShadowQuality.High,
  );
  public get shadowQuality(): Observable<RenderSettings.ShadowQuality> {
    return this._shadowQuality;
  }

  private _lightingType = new Observable<RenderSettings.LightingType>(
    RenderSettings.LightingType.Full,
  );
  public get lightingType(): Observable<RenderSettings.LightingType> {
    return this._lightingType;
  }

  private _crowdDetail = new Observable<RenderSettings.CrowdDetail>(
    RenderSettings.CrowdDetail.High,
  );
  public get crowdDetail(): Observable<RenderSettings.CrowdDetail> {
    return this._crowdDetail;
  }

  private _crowdMode = new Observable<RenderSettings.CrowdMode>(
    RenderSettings.CrowdMode.All,
  );
  public get crowdMode(): Observable<RenderSettings.CrowdMode> {
    return this._crowdMode;
  }

  private _crowdResolution = new Observable<RenderSettings.CrowdResolution>(
    RenderSettings.CrowdResolution.Full,
  );
  public get crowdResolution(): Observable<RenderSettings.CrowdResolution> {
    return this._crowdResolution;
  }

  private _crowdAnimationRate = new Observable<RenderSettings.CrowdAnimationRate>(
    RenderSettings.CrowdAnimationRate.Full,
  );
  public get crowdAnimationRate(): Observable<RenderSettings.CrowdAnimationRate> {
    return this._crowdAnimationRate;
  }

  private _antiAliasing = new Observable<RenderSettings.AntiAliasing>(
    RenderSettings.AntiAliasing.SMAA,
  );
  public get antiAliasing(): Observable<RenderSettings.AntiAliasing> {
    return this._antiAliasing;
  }
}
