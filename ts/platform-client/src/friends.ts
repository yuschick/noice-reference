import {
  FriendsService as FriendsServicePb,
  User,
} from '@noice-com/schemas/friends/friends.pb';

import { IFriendsService, SubService } from './types';

export class FriendsService extends SubService implements IFriendsService {
  public async inviteFriend(userId: string, friendId: string): Promise<void> {
    await FriendsServicePb.SendFriendRequest(
      { userId, friendId },
      await this._getInitReq(),
    );
  }

  public async acceptInvitation(userId: string, friendId: string): Promise<void> {
    await FriendsServicePb.AcceptFriendRequest(
      { userId, friendId },
      await this._getInitReq(),
    );
  }

  public async declineInvitation(userId: string, friendId: string): Promise<void> {
    await FriendsServicePb.DeleteFriendRequest(
      { userId, friendId },
      await this._getInitReq(),
    );
  }

  public async cancelInvitation(userId: string, friendId: string): Promise<void> {
    await FriendsServicePb.DeleteFriendRequest(
      { userId: friendId, friendId: userId },
      await this._getInitReq(),
    );
  }

  public async removeFriend(userId: string, friendId: string): Promise<void> {
    await FriendsServicePb.DeleteFriend({ userId, friendId }, await this._getInitReq());
  }

  public async blockUser(userId: string, blockedUserId: string): Promise<void> {
    await FriendsServicePb.BlockUser({ userId, blockedUserId }, await this._getInitReq());
  }

  public async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    await FriendsServicePb.UnblockUser(
      { userId, blockedUserId },
      await this._getInitReq(),
    );
  }

  public async listFriends(userId: string): Promise<User[]> {
    const { users } = await FriendsServicePb.ListFriends(
      { userId },
      await this._getInitReq(),
    );

    return users ?? [];
  }

  public async listSentFriendRequests(userId: string): Promise<User[]> {
    const { users } = await FriendsServicePb.ListSentFriendRequests(
      { userId },
      await this._getInitReq(),
    );

    return users ?? [];
  }

  public async listReceivedFriendRequests(userId: string): Promise<User[]> {
    const { users } = await FriendsServicePb.ListReceivedFriendRequests(
      { userId },
      await this._getInitReq(),
    );

    return users ?? [];
  }

  public async listBlockedUsers(userId: string): Promise<User[]> {
    const { users } = await FriendsServicePb.ListBlockedUsers(
      { userId },
      await this._getInitReq(),
    );

    return users ?? [];
  }
}
