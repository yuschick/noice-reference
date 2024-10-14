import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import { Decorator } from '@storybook/react';
import { ComponentProps } from 'react';

import { MiniProfileProvider } from '../context';
import { MiniProfile } from '../MiniProfile';

import { SocialPackageProvider } from '@social-context';
import { BadgeBadgeType, ChannelViolation, MiniProfileDocument } from '@social-gen';

export const mockMiniProfile = (playerId: string) =>
  StoryHelpers.Apollo.createMock(
    MiniProfileDocument,
    { userId: playerId },
    {
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId: playerId,
      },
    },
  );

export type MiniProfileStoryArgs = ComponentProps<typeof MiniProfile> & {
  showModerationButtons?: boolean;
  showBadges?: boolean;
  showAsMuted?: boolean;
  showAsBanned?: boolean;
  showGiftButton?: boolean;
  showRank?: boolean;
  friendStatus?: 'friend' | 'asked' | 'received';
  isSubscriber?: boolean;
  hasNewUsername?: boolean;
};

export const addMiniProfileProviderDecorator =
  ({
    channelId,
  }: {
    channelId?: string;
  } = {}): Decorator<MiniProfileStoryArgs> =>
  (Story, context) => {
    const badges = [];

    if (context.args.showBadges) {
      badges.push({ type: BadgeBadgeType.TypeChannelModerator, level: 0 });
      badges.push({ type: BadgeBadgeType.TypeStreamer, level: 0 });
    }

    if (context.args.isSubscriber) {
      badges.push({ type: BadgeBadgeType.TypeChannelSubscriber, level: 5 });
    }

    return (
      <MiniProfileProvider
        badges={badges}
        channelBan={
          context.args.showAsBanned
            ? {
                banned: true,
                violation: ChannelViolation.ViolationSpam,
                description: 'Spamming',
              }
            : null
        }
        channelId={channelId ?? null}
        chatStatus={
          context.args.showAsMuted
            ? {
                muted: true,
                muteDuration: '120',
              }
            : null
        }
        setShowModal={action('setShowModal')}
        showChatModerationButtons={context.args.showModerationButtons ?? false}
        showModerationButtons={context.args.showModerationButtons ?? false}
        hasReportContext
        onClose={action('onClose')}
      >
        <Story {...context.args} />
      </MiniProfileProvider>
    );
  };

export const addSocialPackageProviderDecorator =
  (): Decorator<MiniProfileStoryArgs> => (Story, context) => {
    return (
      <SocialPackageProvider createProfileRoutePath={() => ''}>
        <Story {...context.args} />
      </SocialPackageProvider>
    );
  };
