import {
  CreateChannelEmojiRequest,
  UpdateChannelEmojiParams,
  Emoji,
  EmojiService as EmojiServicePb,
  ChannelEmojiService as ChannelEmojiServicePb,
} from '@noice-com/schemas/emoji/emoji.pb';

import { SubService } from './types';

export class EmojiService extends SubService {
  public async getEmoji(id: string): Promise<Emoji> {
    return await EmojiServicePb.GetEmoji({ id }, await this._getInitReq());
  }

  public async createEmojiUploadToken(id: string): Promise<string> {
    const res = await EmojiServicePb.CreateEmojiUploadToken(
      { itemId: id },
      await this._getInitReq(),
    );

    return res.token;
  }

  public async createChannelEmoji(req: CreateChannelEmojiRequest): Promise<Emoji> {
    return await ChannelEmojiServicePb.CreateChannelEmoji(req, await this._getInitReq());
  }

  public async updateChannelEmoji(emoji: UpdateChannelEmojiParams): Promise<Emoji> {
    return await ChannelEmojiServicePb.UpdateChannelEmoji(
      { body: emoji },
      await this._getInitReq(),
    );
  }
}
