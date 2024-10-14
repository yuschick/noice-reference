import {
  Animation,
  AvatarAnimationService as AvatarAnimationServicePb,
} from '@noice-com/schemas/avatar/animation.pb';

import { SubService } from './types';

export class AvatarAnimationService extends SubService {
  public async listAnimations(): Promise<Animation[]> {
    const { animations } = await AvatarAnimationServicePb.ListAnimations(
      {},
      await this._getInitReq(),
    );

    return animations;
  }

  public async getAnimation(id: string): Promise<Animation> {
    return await AvatarAnimationServicePb.GetAnimation({ id }, await this._getInitReq());
  }
}
