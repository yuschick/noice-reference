import { Cursor } from '@noice-com/schemas/api/cursor.pb';
import {
  PlatformModerationService as PlatformModerationServicePb,
  BanUserRequest,
  ListPlatformBanAppealsResponse,
  UpdatePlatformBanAppealRequest,
  PlatformBan,
} from '@noice-com/schemas/moderation/platform_moderation.pb';

import { IRequestParamsProvider, SubService } from './types';

export class PlatformModerationService extends SubService {
  constructor(provider: IRequestParamsProvider) {
    super(provider);
  }

  public async banUser(req: BanUserRequest): Promise<void> {
    await PlatformModerationServicePb.BanUser(req, await this._getInitReq());
  }

  public async createBanAppeal(appealText: string): Promise<void> {
    await PlatformModerationServicePb.CreateUserPlatformBanAppeal(
      {
        userId: 'me',
        appealText,
      },
      await this._getInitReq(),
    );
  }

  public async listBanAppeals(cursor?: Cursor): Promise<ListPlatformBanAppealsResponse> {
    return await PlatformModerationServicePb.ListPlatformBanAppeals(
      { cursor },
      await this._getInitReq(),
    );
  }

  public async updateBanAppeal(req: UpdatePlatformBanAppealRequest): Promise<void> {
    await PlatformModerationServicePb.UpdatePlatformBanAppeal(
      req,
      await this._getInitReq(),
    );
  }

  public async unbanUser(userId: string): Promise<void> {
    await PlatformModerationServicePb.UnbanUser({ userId }, await this._getInitReq());
  }

  public async getUserBan(): Promise<PlatformBan> {
    return await PlatformModerationServicePb.GetUserPlatformBan(
      { userId: 'me' },
      await this._getInitReq(),
    );
  }

  public async batchGetBans(banIds: string[]): Promise<PlatformBan[]> {
    const { bans } = await PlatformModerationServicePb.BatchGetPlatformBans(
      { banIds },
      await this._getInitReq(),
    );

    return bans;
  }
}
