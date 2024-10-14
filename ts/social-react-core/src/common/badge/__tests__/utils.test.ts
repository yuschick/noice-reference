import { BadgeBadgeType } from '../../../../gen';
import { getBadgeIcon, getBadgeName } from '../utils';

jest.mock('../assets', () => ({
  /* eslint-disable @typescript-eslint/naming-convention */
  StreamerBadge: 'streamer-badge',
  ModeratorBadge: 'moderator-badge',
  NoiceStaffBadge: 'noice-staff-badge',
  ClosedBetaCreatorBadge: 'closed-beta-creator-badge',
  ChannelSubscriberBadgeMonth1: 'channel-subscriber-badge-month-1',
  ChannelSubscriberBadgeMonth2: 'channel-subscriber-badge-month-2',
  ChannelSubscriberBadgeMonth3: 'channel-subscriber-badge-month-3',
  ChannelSubscriberBadgeMonth4: 'channel-subscriber-badge-month-4',
  ChannelSubscriberBadgeMonth5: 'channel-subscriber-badge-month-5',
  ChannelSubscriberBadgeMonth6: 'channel-subscriber-badge-month-6',
  ChannelSubscriberBadgeMonth7: 'channel-subscriber-badge-month-7',
  ChannelSubscriberBadgeMonth8: 'channel-subscriber-badge-month-8',
  ChannelSubscriberBadgeMonth9: 'channel-subscriber-badge-month-9',
  ChannelSubscriberBadgeMonth10: 'channel-subscriber-badge-month-10',
  ChannelSubscriberBadgeMonth11: 'channel-subscriber-badge-month-11',
  ChannelSubscriberBadgeMonth12: 'channel-subscriber-badge-month-12',
  GifterBadgeLevel1: 'gifter-badge-level-1',
  GifterBadgeLevel5: 'gifter-badge-level-5',
  GifterBadgeLevel10: 'gifter-badge-level-10',
  GifterBadgeLevel25: 'gifter-badge-level-25',
  GifterBadgeLevel50: 'gifter-badge-level-50',
  GifterBadgeLevel100: 'gifter-badge-level-100',
  GifterBadgeLevel250: 'gifter-badge-level-250',
  /* eslint-enable @typescript-eslint/naming-convention */
}));

describe('getBadgeIcon', () => {
  it('gives null when badge type is unspecified', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeUnspecified,
        level: 0,
      }),
    ).toBe(null);
  });

  it('gets creator badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeStreamer,
        level: 0,
      }),
    ).toBe('streamer-badge');
  });

  it('gets channel moderator badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelModerator,
        level: 0,
      }),
    ).toBe('moderator-badge');
  });

  it('gets noice staff badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeNoiceStaff,
        level: 0,
      }),
    ).toBe('noice-staff-badge');
  });

  it('gets closed beta creator badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeClosedBetaCreator,
        level: 0,
      }),
    ).toBe('closed-beta-creator-badge');
  });

  it('gets channel subscriber badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      }),
    ).toBe('channel-subscriber-badge-month-1');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 2,
      }),
    ).toBe('channel-subscriber-badge-month-2');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 3,
      }),
    ).toBe('channel-subscriber-badge-month-3');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 4,
      }),
    ).toBe('channel-subscriber-badge-month-4');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 5,
      }),
    ).toBe('channel-subscriber-badge-month-5');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 6,
      }),
    ).toBe('channel-subscriber-badge-month-6');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 7,
      }),
    ).toBe('channel-subscriber-badge-month-7');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 8,
      }),
    ).toBe('channel-subscriber-badge-month-8');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 9,
      }),
    ).toBe('channel-subscriber-badge-month-9');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 10,
      }),
    ).toBe('channel-subscriber-badge-month-10');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 11,
      }),
    ).toBe('channel-subscriber-badge-month-11');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 12,
      }),
    ).toBe('channel-subscriber-badge-month-12');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 13,
      }),
    ).toBe('channel-subscriber-badge-month-12');
  });

  it('gets subs gifter badge icon', () => {
    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 1,
      }),
    ).toBe('gifter-badge-level-1');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 3,
      }),
    ).toBe('gifter-badge-level-1');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 5,
      }),
    ).toBe('gifter-badge-level-5');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 8,
      }),
    ).toBe('gifter-badge-level-5');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 10,
      }),
    ).toBe('gifter-badge-level-10');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 23,
      }),
    ).toBe('gifter-badge-level-10');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 25,
      }),
    ).toBe('gifter-badge-level-25');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 48,
      }),
    ).toBe('gifter-badge-level-25');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 50,
      }),
    ).toBe('gifter-badge-level-50');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 98,
      }),
    ).toBe('gifter-badge-level-50');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 100,
      }),
    ).toBe('gifter-badge-level-100');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 248,
      }),
    ).toBe('gifter-badge-level-100');

    expect(
      getBadgeIcon({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 250,
      }),
    ).toBe('gifter-badge-level-250');
  });
});

describe('getBadgeName', () => {
  it('gives empty string when badge type is unspecified', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeUnspecified,
        level: 0,
      }),
    ).toBe('');
  });

  it('gets creator badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeStreamer,
        level: 0,
      }),
    ).toBe('Creator');
  });

  it('gets channel moderator badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelModerator,
        level: 0,
      }),
    ).toBe('Moderator');
  });

  it('gets noice staff badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeNoiceStaff,
        level: 0,
      }),
    ).toBe('Noice Staff');
  });

  it('gets closed beta creator badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeClosedBetaCreator,
        level: 0,
      }),
    ).toBe('Closed Beta Creator');
  });

  it('gets channel subscriber badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      }),
    ).toBe('Channel Subscriber (1 month)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 1,
      }),
    ).toBe('Channel Subscriber (1 month)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 2,
      }),
    ).toBe('Channel Subscriber (2 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 3,
      }),
    ).toBe('Channel Subscriber (3 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 4,
      }),
    ).toBe('Channel Subscriber (4 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 5,
      }),
    ).toBe('Channel Subscriber (5 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 6,
      }),
    ).toBe('Channel Subscriber (6 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 7,
      }),
    ).toBe('Channel Subscriber (7 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 8,
      }),
    ).toBe('Channel Subscriber (8 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 9,
      }),
    ).toBe('Channel Subscriber (9 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 10,
      }),
    ).toBe('Channel Subscriber (10 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 11,
      }),
    ).toBe('Channel Subscriber (11 months)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 12,
      }),
    ).toBe('Channel Subscriber (12 months)');
  });

  it('gets subs gifter badge name', () => {
    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 0,
      }),
    ).toBe('Subscription Gift Giver (1+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 3,
      }),
    ).toBe('Subscription Gift Giver (1+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 5,
      }),
    ).toBe('Subscription Gift Giver (5+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 8,
      }),
    ).toBe('Subscription Gift Giver (5+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 10,
      }),
    ).toBe('Subscription Gift Giver (10+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 23,
      }),
    ).toBe('Subscription Gift Giver (10+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 25,
      }),
    ).toBe('Subscription Gift Giver (25+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 48,
      }),
    ).toBe('Subscription Gift Giver (25+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 50,
      }),
    ).toBe('Subscription Gift Giver (50+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 98,
      }),
    ).toBe('Subscription Gift Giver (50+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 100,
      }),
    ).toBe('Subscription Gift Giver (100+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 248,
      }),
    ).toBe('Subscription Gift Giver (100+)');

    expect(
      getBadgeName({
        type: BadgeBadgeType.TypeSubsGifter,
        level: 250,
      }),
    ).toBe('Subscription Gift Giver (250+)');
  });
});
