import { ProfileProfile } from '@chat-gen';
export type ChannelEventModel = {
    channelId: string;
    content: ChannelEventSubscriptionContent | ChannelEventBundleContent | ChannelEventCreatorCardPurchase;
    id: string;
    time: Date;
    type: 'channel-event';
};
type ChannelEventSubscriptionContent = {
    id: string;
    type: 'subscription';
    user: Partial<ProfileProfile>;
};
type ChannelEventBundleContent = {
    bundleName: string;
    creatorCardNames?: string[];
    id: string;
    type: 'bundle';
    user: Partial<ProfileProfile>;
};
type ChannelEventCreatorCardPurchase = {
    creatorCardName: string;
    id: string;
    type: 'creator-card';
    user: Partial<ProfileProfile>;
};
export {};
