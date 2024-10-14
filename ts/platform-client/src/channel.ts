import { Account } from '@noice-com/schemas/auth/auth.pb';
import {
  ChannelService as ChannelServicePb,
  Channel,
  ChannelRoles,
  ChannelRole,
  ListChannelsRequest,
  AssetType,
  MonetizationSettings,
} from '@noice-com/schemas/channel/channel.pb';
import {
  ChannelConfigService as ChannelConfigServicePb,
  RestreamingConfig,
  StreamBackendConfig,
} from '@noice-com/schemas/channel/channel_config.pb';
import { LiveStatus, Stream } from '@noice-com/schemas/channel/common.pb';
import {
  StreamIngestConfigService as IngestConfigServicePb,
  ChannelIngestConfigs,
} from '@noice-com/schemas/channel/ingest_config.pb';
import {
  ChannelModerationService as ChannelModerationServicePb,
  Violation,
} from '@noice-com/schemas/channel/moderation.pb';

import {
  IChannelService,
  IChannelConfigService,
  IIngestConfigService,
  SubService,
  ChannelFilter,
  ChannelDetailsParams,
  StreamBackendConfigUpdateParams,
  IChannelModerationService,
  RestreamingConfigUpdateParams,
} from './types';

export class ChannelService extends SubService implements IChannelService {
  private transformChannelFilter(channelFilter?: ChannelFilter): ListChannelsRequest {
    const req: ListChannelsRequest = {};

    if (!channelFilter) {
      return req;
    }

    if (typeof channelFilter.online !== 'undefined') {
      if (channelFilter.online) {
        req.liveStatus = LiveStatus.LIVE_STATUS_LIVE;
      } else {
        req.liveStatus = LiveStatus.LIVE_STATUS_OFFLINE;
      }
    }

    if (typeof channelFilter.gameId !== 'undefined') {
      req.gameId = channelFilter.gameId;
    }

    if (typeof channelFilter.name !== 'undefined') {
      req.name = channelFilter.name;
    }

    return req;
  }

  public async listChannels(channelFilter?: ChannelFilter): Promise<Channel[]> {
    const resp = await ChannelServicePb.ListChannels(
      this.transformChannelFilter(channelFilter),
      await this._getInitReq(),
    );

    if (resp.channels) {
      return resp.channels;
    }

    throw new Error('List channels response is malformed');
  }

  public async getChannel(channelId: string): Promise<Channel> {
    return await ChannelServicePb.GetChannel({ id: channelId }, await this._getInitReq());
  }

  public async createChannel(channelName: string, streamerId: string): Promise<Channel> {
    return await ChannelServicePb.CreateChannel(
      {
        name: channelName,
        streamerId: streamerId,
      },
      await this._getInitReq(),
    );
  }

  public async deleteChannel(channelId: string): Promise<void> {
    await ChannelServicePb.DeleteChannel({ id: channelId }, await this._getInitReq());
  }

  public async updateChannelDetails(details: ChannelDetailsParams): Promise<Channel> {
    return await ChannelServicePb.UpdateChannelDetails(
      {
        body: details,
      },
      await this._getInitReq(),
    );
  }

  public async updateChannelMonetizationSettings(
    settings: MonetizationSettings,
  ): Promise<MonetizationSettings> {
    return await ChannelServicePb.UpdateMonetizationSettings(
      {
        body: settings,
      },
      await this._getInitReq(),
    );
  }

  public async setUserChannelRoles(
    channelId: string,
    userId: string,
    roles: ChannelRole[],
  ): Promise<void> {
    await ChannelServicePb.SetUserChannelRoles(
      {
        channelId: channelId,
        userId: userId,
        roles: roles,
      },
      await this._getInitReq(),
    );
  }

  public async listUserPrivilegedChannels(userId: string): Promise<ChannelRoles[]> {
    const resp = await ChannelServicePb.ListUserPrivilegedChannels(
      {
        userId: userId,
      },
      await this._getInitReq(),
    );

    if (resp.channels) {
      return resp.channels;
    }

    throw new Error('Malformed ListUserPrivilegedChannels response');
  }

  public async followChannel(channelId: string, userId: string): Promise<void> {
    await ChannelServicePb.FollowChannel(
      {
        channelId: channelId,
        userId: userId,
      },
      await this._getInitReq(),
    );
  }

  public async unfollowChannel(channelId: string, userId: string): Promise<void> {
    await ChannelServicePb.UnfollowChannel(
      {
        channelId: channelId,
        userId: userId,
      },
      await this._getInitReq(),
    );
  }

  public async getUserFollowedChannels(userId: string): Promise<string[]> {
    const resp = await ChannelServicePb.GetUserFollowedChannels(
      { userId: userId },
      await this._getInitReq(),
    );

    if (resp.channelIds) {
      return resp.channelIds;
    }

    throw new Error('Malformed GetUserFollowedChannels response');
  }

  public async getAssetUploadToken(
    channelId: string,
    assetType: AssetType,
  ): Promise<string> {
    const resp = await ChannelServicePb.CreateChannelAssetUploadToken(
      { channelId, assetType },
      await this._getInitReq(),
    );

    return resp.token;
  }

  public async deleteChannelAsset(
    channelId: string,
    assetType: AssetType,
  ): Promise<void> {
    await ChannelServicePb.DeleteChannelAsset(
      { channelId, assetType },
      await this._getInitReq(),
    );
  }
}

export class ChannelConfigService extends SubService implements IChannelConfigService {
  public async createStreamBackendConfig(
    channelId: string,
    gameId: string,
  ): Promise<StreamBackendConfig> {
    return await ChannelConfigServicePb.CreateStreamBackendConfig(
      {
        channelId,
        gameId,
      },
      await this._getInitReq(),
    );
  }
  public async deleteStreamBackendConfig(channelId: string, id: string): Promise<void> {
    await ChannelConfigServicePb.DeleteStreamBackendConfig(
      {
        id,
        channelId,
      },
      await this._getInitReq(),
    );
  }
  public async getStreamBackendConfig(
    channelId: string,
    id: string,
  ): Promise<StreamBackendConfig> {
    return await ChannelConfigServicePb.GetStreamBackendConfig(
      {
        channelId,
        id,
      },
      await this._getInitReq(),
    );
  }
  public async getSelectedStreamBackendConfig(
    channelId: string,
  ): Promise<StreamBackendConfig> {
    return await ChannelConfigServicePb.GetSelectedStreamBackendConfig(
      {
        channelId: channelId,
      },
      await this._getInitReq(),
    );
  }
  public async listStreamBackendConfigs(
    channelId: string,
  ): Promise<StreamBackendConfig[]> {
    const resp = await ChannelConfigServicePb.ListStreamBackendConfigs(
      {
        channelId,
      },
      await this._getInitReq(),
    );

    if (resp.configs) {
      return resp.configs;
    }

    throw new Error('List stream backend configs response is malformed');
  }
  public async updateStreamBackendConfig(
    params: StreamBackendConfigUpdateParams,
  ): Promise<StreamBackendConfig> {
    return await ChannelConfigServicePb.UpdateStreamBackendConfig(
      {
        body: params,
      },
      await this._getInitReq(),
    );
  }
  public async selectStreamBackendConfig(
    channelId: string,
    configId: string,
  ): Promise<void> {
    await ChannelConfigServicePb.SelectStreamBackendConfig(
      {
        channelId,
        configId,
      },
      await this._getInitReq(),
    );
  }
  public async createStream(channelId: string): Promise<Stream> {
    return await ChannelConfigServicePb.CreateStream(
      {
        channelId,
      },
      await this._getInitReq(),
    );
  }
  public async endStream(streamId: string): Promise<void> {
    await ChannelConfigServicePb.EndStream(
      {
        streamId,
      },
      await this._getInitReq(),
    );
  }
  public async getRestreamingConfig(channelId: string): Promise<RestreamingConfig> {
    return await ChannelConfigServicePb.GetRestreamingConfig(
      { channelId: channelId },
      await this._getInitReq(),
    );
  }
  public async updateRestreamingConfig(
    params: RestreamingConfigUpdateParams,
  ): Promise<RestreamingConfig> {
    return await ChannelConfigServicePb.UpdateRestreamingConfig(
      {
        body: params,
      },
      await this._getInitReq(),
    );
  }

  public async getRestreamingAccount(channelId: string): Promise<Account> {
    return await ChannelConfigServicePb.GetRestreamingAccount(
      { channelId },
      await this._getInitReq(),
    );
  }
}

export class IngestConfigService extends SubService implements IIngestConfigService {
  public async refreshIngestConfigs(channelId: string): Promise<ChannelIngestConfigs> {
    return await IngestConfigServicePb.RefreshIngestConfigs(
      {
        channelId,
      },
      await this._getInitReq(),
    );
  }

  public async listIngestConfigs(channelId: string): Promise<ChannelIngestConfigs> {
    return await IngestConfigServicePb.ListIngestConfigs(
      {
        channelId,
      },
      await this._getInitReq(),
    );
  }
}

export class ChannelModerationService
  extends SubService
  implements IChannelModerationService
{
  public async banUser(
    channelId: string,
    userId: string,
    violation: Violation,
    description?: string,
  ): Promise<void> {
    await ChannelModerationServicePb.BanUser(
      {
        channelId,
        userId,
        violation,
        description,
      },
      await this._getInitReq(),
    );
  }

  public async unbanUser(channelId: string, userId: string): Promise<void> {
    await ChannelModerationServicePb.UnbanUser(
      {
        channelId,
        userId,
      },
      await this._getInitReq(),
    );
  }
}
