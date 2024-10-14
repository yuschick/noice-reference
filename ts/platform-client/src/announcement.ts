import {
  AnnouncementService as AnnouncementServicePb,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  ListUserAnnouncementsResponse,
  ListAnnouncementsResponse,
  Announcement,
  AnnouncementTarget,
} from '@noice-com/schemas/announcement/announcement.pb';
import { Cursor } from '@noice-com/schemas/api/cursor.pb';

import { IRequestParamsProvider, SubService } from './types';

export class AnnouncementService extends SubService {
  constructor(provider: IRequestParamsProvider) {
    super(provider);
  }

  public async createAnnouncement(req: CreateAnnouncementRequest): Promise<Announcement> {
    return await AnnouncementServicePb.CreateAnnouncement(req, await this._getInitReq());
  }

  public async updateAnnouncement(req: UpdateAnnouncementRequest): Promise<Announcement> {
    return await AnnouncementServicePb.UpdateAnnouncement(req, await this._getInitReq());
  }

  public async deleteAnnouncement(id: string): Promise<void> {
    await AnnouncementServicePb.DeleteAnnouncement({ id: id }, await this._getInitReq());
  }

  public async listUserAnnouncements(
    userId: string,
    target: AnnouncementTarget,
    cursor?: Cursor,
  ): Promise<ListUserAnnouncementsResponse> {
    return await AnnouncementServicePb.ListUserAnnouncements(
      { userId, target, cursor },
      await this._getInitReq(),
    );
  }

  public async listAnnouncements(cursor?: Cursor): Promise<ListAnnouncementsResponse> {
    return await AnnouncementServicePb.ListAnnouncements(
      { cursor },
      await this._getInitReq(),
    );
  }
}
