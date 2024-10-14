import { Observable } from '@noice-com/utils';

import * as API from '@legacy/api';

export class RenderQualityObservables {
  private _frameRate = new Observable<API.FrameRate>(API.FrameRate.Full);
  public get frameRate(): Observable<API.FrameRate> {
    return this._frameRate;
  }

  private _shadowType = new Observable<API.ShadowType>(
    API.ShadowType.SoftPercentageCloseFiltered,
  );
  public get shadowType(): Observable<API.ShadowType> {
    return this._shadowType;
  }

  private _shadowQuality = new Observable<API.ShadowQuality>(API.ShadowQuality.High);
  public get shadowQuality(): Observable<API.ShadowQuality> {
    return this._shadowQuality;
  }

  private _lightingType = new Observable<API.LightingType>(API.LightingType.Full);
  public get lightingType(): Observable<API.LightingType> {
    return this._lightingType;
  }

  private _crowdDetail = new Observable<API.CrowdDetail>(API.CrowdDetail.High);
  public get crowdDetail(): Observable<API.CrowdDetail> {
    return this._crowdDetail;
  }

  private _crowdResolution = new Observable<API.CrowdResolution>(
    API.CrowdResolution.Full,
  );
  public get crowdResolution(): Observable<API.CrowdResolution> {
    return this._crowdResolution;
  }

  private _crowdAnimationRate = new Observable<API.CrowdAnimationRate>(
    API.CrowdAnimationRate.Full,
  );

  public get crowdAnimationRate(): Observable<API.CrowdAnimationRate> {
    return this._crowdAnimationRate;
  }

  private _antiAliasing = new Observable<API.AntiAliasing>(API.AntiAliasing.SMAA);
  public get antiAliasing(): Observable<API.AntiAliasing> {
    return this._antiAliasing;
  }
}
