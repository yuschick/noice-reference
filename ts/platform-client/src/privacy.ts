import {
  DeleteUserDataRequest,
  PrivacyService as PrivacyServicePb,
} from '@noice-com/schemas/privacy/privacy.pb';

import { IPrivacyService, SubService } from './types';

export class PrivacyService extends SubService implements IPrivacyService {
  public async exportUserData(): Promise<void> {
    await PrivacyServicePb.ExportUserData({}, await this._getInitReq());
  }

  public async deleteUserData(userId?: string, gracePeriod?: string): Promise<void> {
    const req: DeleteUserDataRequest = {};

    if (userId) {
      req.userId = userId;
    }

    if (gracePeriod) {
      req.gracePeriod = gracePeriod;
    }

    await PrivacyServicePb.DeleteUserData(req, await this._getInitReq());
  }
}
