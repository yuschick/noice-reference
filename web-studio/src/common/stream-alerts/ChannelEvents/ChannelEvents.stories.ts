import { ChannelEvents } from './ChannelEvents';

import { AlertsList } from '@common/alerts';

export default {
  component: ChannelEvents,
  argTypes: {},
  title: 'Stream Alerts/ChannelEvents',
};

const baseAlert = {
  duration: 4940,
  id: 'test-alert-1',
  maxAmount: 100,
  keepLast: true,
  priority: 1,
  header: {
    text: 'TestText',
    subtext: 'TestSubText',
  },
};

const baseAlertData = {
  timestamp: new Date().getTime().toString(),
  id: 'test-alert-1',
};

const baseUserData = {
  userId: 'test-user-id-1',
  userTag: 'Teppo Testaaja',
  avatars: {
    avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
    avatarFullbody:
      'https://media-cdn.gcp.stg.noice.com/avatar/image_body_img/c5cec837-1e2a-5b5d-af8c-55f6d85e85f6/b035c77d-b61f-4440-9731-6be3be2c56c6.png',
  },
};

const baseContent = {
  userId: 'test-user-id-1',
  user: baseUserData,
};

const followed: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerChannelFollowed',
        userId: 'test-user-id-1',
        follower: baseUserData,
      },
    },
  },
];

const subscribed: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        ...baseContent,
        __typename: 'StreamerChannelSubscribed',
      },
    },
  },
];

const subgift: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerSubscriptionGifted',
        recipientUserIds: ['receiver-1'],
        tier: 1,
        ...baseContent,
      },
    },
  },
];

const multiGift: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerSubscriptionGifted',
        recipientUserIds: [
          'receiver-1',
          'receiver-2',
          'receiver-3',
          'receiver-4',
          'receiver-5',
        ],
        tier: 1,
        ...baseContent,
      },
    },
  },
];

const resubscribed: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerSubscriptionRenewed',
        ...baseContent,
      },
    },
  },
];

const creatorCardPurchase: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerStreamerCardPurchased',
        ...baseContent,
      },
    },
  },
];

const bundlePurchase: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerBundlePurchased',
        ...baseContent,
      },
    },
  },
];

const anonymousUser: AlertsList = [
  {
    ...baseAlert,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerSubscriptionGifted',
        recipientUserIds: ['receiver-1'],
        tier: 1,
        ...baseContent,
        user: undefined,
      },
    },
  },
];

export const Followed = {
  args: {
    alerts: followed,
  },
};

export const Subscribed = {
  args: {
    alerts: subscribed,
  },
};

export const ReSubscribed = {
  args: {
    alerts: resubscribed,
  },
};

export const SubGifted = {
  args: {
    alerts: subgift,
  },
};

export const MultiGiftedSubs = {
  args: {
    alerts: multiGift,
  },
};

export const AnonymousUserGiftedSub = {
  args: {
    alerts: anonymousUser,
  },
};

export const CreatorCardPurchased = {
  args: {
    alerts: creatorCardPurchase,
  },
};

export const BundlePurchased = {
  args: {
    alerts: bundlePurchase,
  },
};
