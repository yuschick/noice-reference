import {
  Profile,
  ProfileService as ProfileServicePb,
  ProfileAdminService as ProfileAdminServicePb,
} from '@noice-com/schemas/profile/profile.pb';

import { IProfileAdminService, IProfileService, SubService } from './types';

export class ProfileService extends SubService implements IProfileService {
  public async getProfile(userId: string): Promise<Profile> {
    return await ProfileServicePb.GetProfile(
      { userId: userId },
      await this._getInitReq(),
    );
  }

  public async getProfiles(userIds: string[]): Promise<Profile[]> {
    const { profiles } = await ProfileServicePb.BatchGetProfiles(
      { userIds },
      await this._getInitReq(),
    );

    return profiles;
  }

  public async updateProfile(req: Profile): Promise<Profile> {
    return await ProfileServicePb.UpdateProfile({ body: req }, await this._getInitReq());
  }

  public async updateAvatar(userId: string, modelId: string): Promise<void> {
    await ProfileServicePb.UpdateProfileAvatar(
      { userId, modelId },
      await this._getInitReq(),
    );
  }

  public async resolveUserTags(userTags: string[]): Promise<Map<string, string>> {
    const resp = await ProfileServicePb.ResolveUserTags(
      { userTags },
      await this._getInitReq(),
    );

    return new Map(Object.entries(resp.userIds));
  }
}

export class ProfileAdminService extends SubService implements IProfileAdminService {
  public async resolveEmails(emails: string[]): Promise<{ [key: string]: string }> {
    const { userIds } = await ProfileAdminServicePb.ResolveEmails(
      { emails },
      await this._getInitReq(),
    );

    return userIds;
  }
}
