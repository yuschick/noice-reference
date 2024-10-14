import { Cursor } from '@noice-com/schemas/api/cursor.pb';
import {
  Avatar,
  AvatarComposition,
  AvatarPart,
  AvatarPartCustomization,
  AvatarService as AvatarServicePb,
  GenerateAvatarEventProgress,
  ListAvatarsResponse,
  routeGenerateAvatarEventEventDelegate,
  ValidateAvatarCompositionResponseChange,
} from '@noice-com/schemas/avatar/avatar.pb';

import { SubService } from './types';

export class AvatarService extends SubService {
  public async listAvatars(cursor: Cursor = null, listAll = false): Promise<Avatar[]> {
    const res = await this.listAvatarWithPaging(cursor, listAll);

    return res.avatars ?? [];
  }

  public async listAvatarWithPaging(
    cursor: Cursor = null,
    listAll = false,
  ): Promise<ListAvatarsResponse> {
    return await AvatarServicePb.ListAvatars(
      {
        cursor,
        listAll,
      },
      await this._getInitReq(),
    );
  }

  public async getAvatar(id: string): Promise<Avatar> {
    return await AvatarServicePb.GetAvatar({ avatarId: id }, await this._getInitReq());
  }

  public async getAvatars(ids: string[]): Promise<Avatar[]> {
    const { avatars } = await AvatarServicePb.BatchGetAvatars(
      { ids: ids },
      await this._getInitReq(),
    );

    return avatars;
  }

  public async listAvatarParts(): Promise<AvatarPart[]> {
    const { avatarParts } = await AvatarServicePb.ListAvatarParts(
      {},
      await this._getInitReq(),
    );

    return avatarParts;
  }

  public async getAvatarPart(id: string): Promise<AvatarPart> {
    return await AvatarServicePb.GetAvatarPart(
      { avatarPartId: id },
      await this._getInitReq(),
    );
  }

  public async batchGetAvatarParts(ids: string[]): Promise<AvatarPart[]> {
    const { avatarParts } = await AvatarServicePb.BatchGetAvatarParts(
      { ids: ids },
      await this._getInitReq(),
    );

    return avatarParts;
  }

  public async generateAvatar(
    partIds: string[],
    partCustomizations: AvatarPartCustomization[],
    progress?: (progress: GenerateAvatarEventProgress) => void,
  ): Promise<string> {
    const initReq = await this._getInitReq();

    return new Promise<string>((resolve, reject) => {
      AvatarServicePb.GenerateAvatar(
        {
          composition: {
            partIds: partIds,
            partCustomizations: partCustomizations,
          },
        },
        (ev) => {
          routeGenerateAvatarEventEventDelegate(undefined, ev, {
            onCompleted: (_, completed) => {
              resolve(completed?.avatar?.id);
            },
            onProgress: (_, res) => {
              progress?.(res);
            },
            onError: () => {
              // Client doesnt receive errors currently through
              // the events instead the connection is closed
              // with an error
            },
          });
        },
        initReq,
      ).catch(reject);
    });
  }

  public async regenerateAvatar(
    id: string,
    progress?: (progress: GenerateAvatarEventProgress) => void,
  ): Promise<string> {
    const initReq = await this._getInitReq();

    return new Promise<string>((resolve, reject) => {
      AvatarServicePb.RegenerateAvatar(
        {
          avatarId: id,
        },
        (ev) => {
          routeGenerateAvatarEventEventDelegate(undefined, ev, {
            onCompleted: (_, completed) => {
              resolve(completed?.avatar?.id);
            },
            onProgress: (_, res) => {
              progress?.(res);
            },
            onError: () => {
              // Client doesnt receive errors currently through
              // the events instead the connection is closed
              // with an error
            },
          });
        },
        initReq,
      ).catch(reject);
    });
  }

  public async validateAvatarComposition(
    partIds: string[],
    partCustomizations: AvatarPartCustomization[],
  ): Promise<
    [
      composition: AvatarComposition,
      changes: ValidateAvatarCompositionResponseChange[],
      isDefault: boolean,
    ]
  > {
    // todo: this should be try catched, here or elsewhere
    const { composition, changes, isDefault } =
      await AvatarServicePb.ValidateAvatarComposition(
        {
          composition: {
            partIds: partIds,
            partCustomizations: partCustomizations,
          },
        },
        await this._getInitReq(),
      );

    return [composition, changes, isDefault];
  }

  public async updateAvatar(avatar: Avatar): Promise<void> {
    await AvatarServicePb.UpdateAvatar(
      {
        body: avatar,
      },
      await this._getInitReq(),
    );
  }

  public async setAvatarSelectable(avatarId: string, selectable: boolean): Promise<void> {
    const avatar = await this.getAvatar(avatarId);
    avatar.selectable = selectable;
    await this.updateAvatar(avatar);
  }
}
