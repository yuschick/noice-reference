export interface SendGiftButtonModel {
  shouldButtonBeRendered(params: GiftParams): Promise<boolean>;
  onClick(params: GiftParams): void;
}

export interface ChannelGiftParams<T extends GiftTarget> {
  target: T;
  channelId: string;
}

export type GiftToCommunityParams = ChannelGiftParams<GiftTarget.Community>;

export interface GiftToUserParams extends ChannelGiftParams<GiftTarget.User> {
  userId: string;
}

export type GiftParams = GiftToCommunityParams | GiftToUserParams;

export enum GiftTarget {
  User = 'user',
  Community = 'community',
}
