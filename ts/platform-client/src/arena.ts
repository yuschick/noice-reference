import {
  ClientSideArena,
  ArenaService as ArenaServicePb,
} from '@noice-com/schemas/arena/arena.pb';

import { SubService } from './types';

export class ArenaService extends SubService {
  public async getClientSideArena(id: string): Promise<ClientSideArena> {
    return await ArenaServicePb.GetClientSideArena({ id }, await this._getInitReq());
  }

  public async listClientSideArenas(channelId?: string): Promise<ClientSideArena[]> {
    const { arenas } = await ArenaServicePb.ListClientSideArenas(
      { channelId },
      await this._getInitReq(),
    );

    return arenas;
  }
}
