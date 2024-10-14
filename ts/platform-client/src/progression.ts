import {
  GetDailyParticipationLimitResponse,
  GetDailyXPBoostLimitResponse,
  GetDailyXPEarningsLimitResponse,
  LevelConfig,
  ListLevelConfigsRequest,
  ProgressionService as ProgressionServicePb,
  ProgressionAdminService,
  SeasonProgression,
} from '@noice-com/schemas/progression/progression.pb';

import {
  IProgressionService,
  SubService,
  IClient,
  IRequestParamsProvider,
} from './types';

interface IExtClient extends IClient, IRequestParamsProvider {}

export class ProgressionService extends SubService implements IProgressionService {
  private _levelConfigs: Map<string, LevelConfig[]> = new Map();

  constructor(cli: IExtClient) {
    super(cli);
  }

  private async listLevelConfigs(req: ListLevelConfigsRequest): Promise<LevelConfig[]> {
    if (!this._levelConfigs.get(req.seasonId)) {
      const res = await ProgressionServicePb.ListLevelConfigs(
        req,
        await this._getInitReq(),
      );

      this._levelConfigs.set(req.seasonId, res.levelConfigs);
    }

    return this._levelConfigs.get(req.seasonId);
  }

  public async getLevelThresholds(req: ListLevelConfigsRequest): Promise<number[]> {
    const levelConfigs = await this.listLevelConfigs(req);

    return levelConfigs.map((level) => parseInt(level.threshold ?? '0', 10));
  }

  public async getSeasonProgression(
    userID: string,
    seasonID: string,
  ): Promise<SeasonProgression> {
    const res = await ProgressionServicePb.GetSeasonProgression(
      {
        userId: userID,
        seasonId: seasonID,
      },
      await this._getInitReq(),
    );

    return res;
  }

  public async getDailyXPBoostLimit(): Promise<GetDailyXPBoostLimitResponse> {
    const res = await ProgressionServicePb.GetDailyXPBoostLimit(
      {},
      await this._getInitReq(),
    );

    return res;
  }

  public async getDailyParticipationLimit(): Promise<GetDailyParticipationLimitResponse> {
    const res = await ProgressionServicePb.GetDailyParticipationLimit(
      {},
      await this._getInitReq(),
    );

    return res;
  }

  public async getDailyXPEarningsLimit(): Promise<GetDailyXPEarningsLimitResponse> {
    const res = await ProgressionServicePb.GetDailyXPEarningsLimit(
      {},
      await this._getInitReq(),
    );

    return res;
  }

  public async resetProgression(userID: string): Promise<void> {
    await ProgressionAdminService.ResetUserProgression(
      {
        userId: userID,
      },
      await this._getInitReq(),
    );
  }

  public async addExperiencePoints(
    userID: string,
    seasonID: string,
    xpAmount: number,
    reason: string,
  ): Promise<number> {
    const res = await ProgressionAdminService.AddExperiencePoints(
      {
        userId: userID,
        seasonId: seasonID,
        xpAmount: xpAmount.toString(),
        reason,
      },
      await this._getInitReq(),
    );

    return parseInt(res.totalXp || '0', 10);
  }

  public async resetSeasonProgression(userID: string, seasonID: string): Promise<void> {
    await ProgressionAdminService.ResetUserSeasonProgression(
      {
        userId: userID,
        seasonId: seasonID,
      },
      await this._getInitReq(),
    );
  }
}
