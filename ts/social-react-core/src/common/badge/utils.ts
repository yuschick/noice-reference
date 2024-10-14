import { FC } from 'react';

import { BadgeBadgeType, UserBadgeFragment } from '../../../gen';

import {
  ClosedBetaCreatorBadge,
  ModeratorBadge,
  StreamerBadge,
  NoiceStaffBadge,
  ChannelSubscriberBadgeMonth1,
  ChannelSubscriberBadgeMonth2,
  ChannelSubscriberBadgeMonth3,
  ChannelSubscriberBadgeMonth4,
  ChannelSubscriberBadgeMonth5,
  ChannelSubscriberBadgeMonth6,
  ChannelSubscriberBadgeMonth7,
  ChannelSubscriberBadgeMonth8,
  ChannelSubscriberBadgeMonth9,
  ChannelSubscriberBadgeMonth10,
  ChannelSubscriberBadgeMonth11,
  ChannelSubscriberBadgeMonth12,
  GifterBadgeLevel1,
  GifterBadgeLevel5,
  GifterBadgeLevel10,
  GifterBadgeLevel25,
  GifterBadgeLevel50,
  GifterBadgeLevel100,
  GifterBadgeLevel250,
} from './assets';

export const sortBadges = (badges: UserBadgeFragment[]) => {
  return [...badges].sort((a, b) => {
    if (a.type === BadgeBadgeType.TypeStreamer) {
      return -1;
    }

    if (b.type === BadgeBadgeType.TypeStreamer) {
      return 1;
    }

    if (a.type === BadgeBadgeType.TypeClosedBetaCreator) {
      return -1;
    }

    if (b.type === BadgeBadgeType.TypeClosedBetaCreator) {
      return 1;
    }

    if (a.type === BadgeBadgeType.TypeNoiceStaff) {
      return -1;
    }

    if (b.type === BadgeBadgeType.TypeNoiceStaff) {
      return 1;
    }

    if (a.type === BadgeBadgeType.TypeChannelModerator) {
      return -1;
    }

    if (b.type === BadgeBadgeType.TypeChannelModerator) {
      return 1;
    }

    if (a.type === BadgeBadgeType.TypeSubsGifter) {
      return -1;
    }

    if (b.type === BadgeBadgeType.TypeSubsGifter) {
      return 1;
    }

    return 0;
  });
};

const badgeMap: Record<BadgeBadgeType, (FC | null)[]> = {
  [BadgeBadgeType.TypeUnspecified]: [null],
  [BadgeBadgeType.TypeStreamer]: [StreamerBadge],
  [BadgeBadgeType.TypeChannelModerator]: [ModeratorBadge],
  [BadgeBadgeType.TypeNoiceStaff]: [NoiceStaffBadge],
  [BadgeBadgeType.TypeClosedBetaCreator]: [ClosedBetaCreatorBadge],
  [BadgeBadgeType.TypeChannelSubscriber]: [
    ChannelSubscriberBadgeMonth1,
    ChannelSubscriberBadgeMonth2,
    ChannelSubscriberBadgeMonth3,
    ChannelSubscriberBadgeMonth4,
    ChannelSubscriberBadgeMonth5,
    ChannelSubscriberBadgeMonth6,
    ChannelSubscriberBadgeMonth7,
    ChannelSubscriberBadgeMonth8,
    ChannelSubscriberBadgeMonth9,
    ChannelSubscriberBadgeMonth10,
    ChannelSubscriberBadgeMonth11,
    ChannelSubscriberBadgeMonth12,
  ],
  [BadgeBadgeType.TypeSubsGifter]: [
    GifterBadgeLevel1,
    GifterBadgeLevel5,
    GifterBadgeLevel10,
    GifterBadgeLevel25,
    GifterBadgeLevel50,
    GifterBadgeLevel100,
    GifterBadgeLevel250,
  ],
};

/**
 * Level 0 means there is one gift given, so 5 gifts are given when level is 4 etc.
 */
const getGifterBadgeIndex = (level: number) => {
  if (level < 5) {
    return 0;
  }

  if (level < 10) {
    return 1;
  }

  if (level < 25) {
    return 2;
  }

  if (level < 50) {
    return 3;
  }

  if (level < 100) {
    return 4;
  }

  if (level < 250) {
    return 5;
  }

  return 6;
};

export const getBadgeIcon = (badge: UserBadgeFragment) => {
  const badges = badgeMap[badge.type];
  const maxLevel = badges.length - 1;
  let index = Math.max(Math.min(badge.level - 1, maxLevel), 0);

  if (badge.type === BadgeBadgeType.TypeSubsGifter) {
    index = getGifterBadgeIndex(badge.level);
  }

  const icon = badges[index];

  return icon;
};

const badgeNameMap: Record<BadgeBadgeType, string> = {
  [BadgeBadgeType.TypeStreamer]: 'Creator',
  [BadgeBadgeType.TypeChannelModerator]: 'Moderator',
  [BadgeBadgeType.TypeNoiceStaff]: 'Noice Staff',
  [BadgeBadgeType.TypeClosedBetaCreator]: 'Closed Beta Creator',
  [BadgeBadgeType.TypeChannelSubscriber]: 'Channel Subscriber',
  [BadgeBadgeType.TypeSubsGifter]: 'Subscription Gift Giver',
  [BadgeBadgeType.TypeUnspecified]: '',
};

const getGifterBadgeName = (level: number) => {
  const index = getGifterBadgeIndex(level);

  if (index === 0) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (1+)`;
  }

  if (index === 1) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (5+)`;
  }

  if (index === 2) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (10+)`;
  }

  if (index === 3) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (25+)`;
  }

  if (index === 4) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (50+)`;
  }

  if (index === 5) {
    return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (100+)`;
  }

  return `${badgeNameMap[BadgeBadgeType.TypeSubsGifter]} (250+)`;
};

export const getBadgeName = (badge: UserBadgeFragment) => {
  const { type, level } = badge;

  if (type === BadgeBadgeType.TypeChannelSubscriber) {
    return `${badgeNameMap[type]} (${Math.max(level, 1)} month${level > 1 ? 's' : ''})`;
  }

  if (type === BadgeBadgeType.TypeSubsGifter) {
    return getGifterBadgeName(level);
  }

  return badgeNameMap[type];
};
