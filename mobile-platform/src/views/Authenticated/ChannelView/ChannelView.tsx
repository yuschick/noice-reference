import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { ImageSourcePropType, ImageURISource, StyleSheet } from 'react-native';

import { FollowButton } from '../StreamView/StreamInfo/FollowButton';

import { ButtonIcon } from '@components/ButtonIcon';
import { ButtonLarge } from '@components/ButtonLarge';
import { ChannelViewLinks } from '@components/Channel/ChannelLinks';
import { ChannelLogo } from '@components/ChannelLogo';
import { ErrorView } from '@components/ErrorView';
import { ExpandableTypography } from '@components/ExpandableTypography';
import { Gutter } from '@components/Gutter';
import { HeaderWithImageGutter } from '@components/List/HeaderWithImage';
import { PageLayout } from '@components/PageLayout';
import { PillLabel } from '@components/PillLabel';
import { HStack } from '@components/Stack/HStack';
import { StreamPreviewCard } from '@components/StreamPreviewCard';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  ChannelLiveStatus,
  SubscriptionChannelSubscriptionState,
  useChannelViewQuery,
  useSubscriptionInfoQuery,
} from '@gen/graphql';
import { useChannelLiveStatus } from '@hooks/channel/useChannelLiveStatus.hook';
import { useAskToEnableNotifications } from '@hooks/notifications/useAskToEnableNotifications.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { isNonEmptyString } from '@utils/equality';
import { formatLargeNumber } from '@utils/format';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';
import { pluralize } from '@utils/strings';

gql`
  query ChannelView($channelName: String!) {
    channelByName(name: $channelName) {
      id
      title
      name
      thumbnail
      description
      currentStreamId
      liveStatus
      offlineBanner
      followerCount
      viewerCount
      logo
      following
      streamer {
        userId
      }
      userBanStatus {
        banned
      }
      streamedGames {
        id
        name
      }
      subscription {
        state
      }
      ...ChannelViewLinks
      ...StreamPreviewCard
    }
  }

  query SubscriptionInfo($channelId: ID!) {
    channel(id: $channelId) {
      id
      subscriptionConfig {
        channelId
        subscriptionsEnabled
        tiers {
          level
          name
          description
          prices {
            period
            price
          }
          entitlements {
            amount
            itemId
          }
        }
      }
    }
  }
`;

export const ChannelView = ({
  navigation,
  route: {
    name,
    params: { channelName },
  },
}: AuthenticatedScreenProps<'channel'>) => {
  const { data, loading, error } = useChannelViewQuery({
    ...variablesOrSkip({ channelName }),
  });
  const channel = data?.channelByName;
  const channelId = channel?.id;

  const { data: subscriptionsInfo, refetch } = useSubscriptionInfoQuery({
    ...variablesOrSkip({ channelId }),
  });

  useFocusEffect(
    useCallback(() => {
      if (channelId) {
        refetch();
      }
    }, [channelId, refetch]),
  );

  useAskToEnableNotifications(channelId);
  useChannelLiveStatus(channelId);

  const isOnline = channel?.liveStatus === ChannelLiveStatus.LiveStatusLive;
  const offlineBannerSource: ImageSourcePropType = isNonEmptyString(
    channel?.offlineBanner,
  )
    ? { uri: channel?.offlineBanner }
    : (ImageAssets.bannerFallback as ImageURISource);

  const title = isNonEmptyString(channel?.name) ? channel?.name : channel?.title;
  const formattedFollowerCount = channel?.followerCount
    ? formatLargeNumber(channel.followerCount)
    : '0';

  useEffect(() => {
    // redirect user if banned
    if (channel?.userBanStatus.banned && channelId) {
      navigation.replace('channelUserBan', { channelId });
    }
  }, [channel?.userBanStatus.banned, channelId, navigation]);

  const navigateToStream = () => {
    if (!channel) {
      return;
    }
    // @todo we will prob need to eventually move this to some
    // external API so we can have PiP; OR we can see if we can
    // use native API's (which I'm pretty sure there is some?)
    navigation.navigate('stream', {
      streamId: channel.currentStreamId,
      channelId: channel.id,
      liveStatus: channel.liveStatus ?? ChannelLiveStatus.LiveStatusLive,
    });
  };

  const navigateToSubscriptionModal = () => {
    if (channelId) {
      navigation.navigate('subscribeToChannel', {
        channelId: channelId,
      });
    }
  };

  const navigateToManageSubscriptionModal = () => {
    if (channelId) {
      navigation.navigate('manageSubscription', {
        channelId: channelId,
      });
    }
  };

  if ((!channel || error) && !loading) {
    return (
      <PageLayout>
        <ErrorView />
      </PageLayout>
    );
  }

  const openChannelOptions = () => {
    if (channel && channelId) {
      navigation.navigate('channelOptionsModal', {
        channelId: channelId,
        streamId: channel.currentStreamId,
        userId: channel.streamer.userId,
      });
    }
  };

  const subscriptionsEnabled =
    subscriptionsInfo?.channel?.subscriptionConfig?.subscriptionsEnabled;
  const following = !!channel?.following;
  const subscribed =
    channel?.subscription?.state === SubscriptionChannelSubscriptionState.StateActive;

  return (
    <PageLayout
      coverPhoto={offlineBannerSource}
      headerBottomRowElement={
        <ChannelLogo
          logo={channel?.logo}
          name={title ?? ''}
          size="large"
          style={s.border}
        />
      }
      headerLeft={
        <ButtonIcon
          backgroundColor="whiteMain"
          onPress={navigation.goBack}
        >
          <IconAssets.ChevronLeft
            color={colors.textDark}
            height={20}
            width={20}
          />
        </ButtonIcon>
      }
      headerRight={
        <ButtonIcon
          backgroundColor="whiteMain"
          onPress={openChannelOptions}
        >
          <IconAssets.Menu
            color={colors.textDark}
            height={20}
            width={20}
          />
        </ButtonIcon>
      }
      title={title}
    >
      <HeaderWithImageGutter />
      <Typography
        fontSize="xl"
        fontWeight="bold"
        italic
      >
        {title}
      </Typography>
      <Gutter height={8} />
      <HStack
        alignItems="center"
        spacing={8}
      >
        {isOnline ? (
          <PillLabel
            color={['violetMain', 'magentaMain']}
            label="live"
            uppercase
          />
        ) : (
          <PillLabel
            color="gray800"
            label="offline"
            uppercase
          />
        )}
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="regular"
          italic
        >
          <Typography
            fontSize="lg"
            fontWeight="medium"
          >
            {formattedFollowerCount}
          </Typography>{' '}
          {pluralize(channel?.followerCount ?? 0, 'Follower', 'Followers')}
        </Typography>
      </HStack>

      <Gutter height={16} />

      <ExpandableTypography
        fontSize="md"
        lineHeight="xl"
        numberOfLines={2}
      >
        {channel?.description}
      </ExpandableTypography>

      <Gutter height={16} />
      <ChannelViewLinks links={channel?.links ?? []} />

      <Gutter height={24} />
      <HStack
        alignItems="center"
        justifyContent="space-between"
        spacing={8}
      >
        <FollowButton
          channelId={channelId}
          pathname={name}
        />

        {subscriptionsEnabled &&
          (subscribed ? (
            <ButtonLarge
              flex={1}
              iconElement={
                subscribed ? (
                  <IconAssets.Menu
                    color="white"
                    height={24}
                    width={24}
                  />
                ) : undefined
              }
              iconOnRight
              onPress={navigateToManageSubscriptionModal}
            >
              Subscribed
            </ButtonLarge>
          ) : (
            <ButtonLarge
              // If user is not following the channel the call to action should be on Follow first
              analyticsActionName="OPEN_SUBSCRIBE_MODAL"
              backgroundColor={following ? 'whiteMain' : undefined}
              flex={1}
              textColor={following ? 'darkMain' : undefined}
              onPress={navigateToSubscriptionModal}
            >
              Subscribe
            </ButtonLarge>
          ))}
      </HStack>

      <Gutter height={24} />
      {!!isOnline && (
        <StreamPreviewCard
          channel={channel}
          onPress={navigateToStream}
        />
      )}
    </PageLayout>
  );
};

const s = StyleSheet.create({
  border: {
    borderColor: colors.blueMain,
    borderWidth: 2,
  },
});
