import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { DateAndTimeUtils } from '@noice-com/utils';
import { Image } from 'expo-image';
import { Alert, ImageSourcePropType, ImageURISource, StyleSheet } from 'react-native';

import { ButtonIcon } from '@components/ButtonIcon';
import { ChannelLogo } from '@components/ChannelLogo';
import { Divider } from '@components/Divider';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { links } from '@constants/links';
import { colors } from '@constants/styles';
import {
  BadgeBadgeType,
  SubscriptionChannelSubscriptionProvider,
  SubscriptionChannelSubscriptionState,
  SubscriptionSettingItemSubscriptionFragment,
  useSubscriptionItemBadgeQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { isNonEmptyString } from '@utils/equality';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';
import { openURL } from '@utils/open-url';
import { pluralize } from '@utils/strings';

type Props = {
  subscription: SubscriptionSettingItemSubscriptionFragment;
};

gql`
  query SubscriptionItemBadge($channelId: ID!, $userId: ID!) {
    profile(userId: $userId) {
      userId
      badges(channel_id: $channelId) {
        level
        ...UserBadge
      }
    }
  }
`;

export const SubscriptionSettingItem = ({ subscription }: Props) => {
  const { userId } = useAuth();
  const thumbnailUrl: ImageSourcePropType = isNonEmptyString(
    subscription.channel.offlineBanner,
  )
    ? { uri: subscription.channel.offlineBanner }
    : (ImageAssets.bannerFallback as ImageURISource);

  const { data } = useSubscriptionItemBadgeQuery({
    ...variablesOrSkip({ userId, channelId: subscription.channel.id }),
  });

  const { activatedAt, expiresAt, state, channel } = subscription;

  const badge = data?.profile?.badges.find(
    (b) => b.type === BadgeBadgeType.TypeChannelSubscriber,
  );

  const isApple =
    channel.subscription?.provider ===
    SubscriptionChannelSubscriptionProvider.ProviderApple;

  const cancelSubscription = () => {
    if (isApple) {
      openURL(links.manageSubscriptions);
    } else {
      Alert.alert(
        'Cancel subscription',
        'To cancel this subscription, navigate to your user settings on the web browser to manage your subscriptions.',
        [{ text: 'OK' }],
      );
    }
  };

  return (
    <VStack style={s.card}>
      <Image
        source={thumbnailUrl}
        style={s.banner}
      />
      <VStack style={s.innerContainer}>
        <HStack
          alignItems="center"
          spacing={12}
        >
          <ChannelLogo
            logo={subscription.channel.logo}
            name={subscription.channel.name}
            size="medium"
          />
          <Typography
            fontSize="lg"
            fontWeight="semiBold"
          >
            {subscription.channel.name}
          </Typography>
        </HStack>
        <Gutter height={12} />
        <HStack justifyContent="space-between">
          {badge && (
            <HStack spacing={8}>
              <UserBadge
                badge={badge}
                size={24}
              />

              <VStack>
                <Typography
                  color="textLightSecondary"
                  fontSize="sm"
                  fontWeight="regular"
                >
                  Months subscribed
                </Typography>
                <Typography
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {pluralize(badge.level, '1 month', `${badge.level} months`)}
                </Typography>
              </VStack>
            </HStack>
          )}

          <ButtonIcon onPress={cancelSubscription}>
            <IconAssets.Menu
              color="white"
              height={20}
              width={20}
            />
          </ButtonIcon>
        </HStack>

        <Gutter height={12} />

        <Divider
          color="violet700"
          height={1}
        />
        <Gutter height={16} />
        <HStack justifyContent="space-between">
          {!!activatedAt && (
            <VStack>
              <Typography
                color="textLightSecondary"
                fontSize="sm"
                fontWeight="regular"
              >
                Subscription started
              </Typography>
              <Typography
                fontSize="sm"
                fontWeight="medium"
              >
                {DateAndTimeUtils.getShortDate(activatedAt)}
              </Typography>
            </VStack>
          )}
          {state === SubscriptionChannelSubscriptionState.StateActive && !!expiresAt && (
            <VStack>
              <Typography
                color="textLightSecondary"
                fontSize="sm"
                fontWeight="medium"
                textAlign="right"
              >
                Next renewal
              </Typography>
              <Typography
                fontSize="sm"
                fontWeight="medium"
                textAlign="right"
              >
                {DateAndTimeUtils.getShortDate(expiresAt)}
              </Typography>
            </VStack>
          )}
          {state === SubscriptionChannelSubscriptionState.StateCancelled &&
            !!expiresAt && (
              <VStack>
                <Typography
                  color="textLightSecondary"
                  fontSize="sm"
                  fontWeight="regular"
                  textAlign="right"
                >
                  Subscription ends
                </Typography>
                <Typography
                  fontSize="sm"
                  fontWeight="medium"
                  textAlign="right"
                >
                  {DateAndTimeUtils.getShortDate(expiresAt)}
                </Typography>
              </VStack>
            )}
        </HStack>
        <Gutter height={16} />
        <Divider
          color="violet700"
          height={1}
        />
        <Gutter height={16} />

        <Typography
          color="textLightSecondary"
          fontSize="md"
          fontWeight="regular"
          textAlign="center"
        >
          {isApple ? 'Subscribed via iOS Device' : 'Subscribed via noice.com'}
        </Typography>
      </VStack>
    </VStack>
  );
};

const s = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.violet600,
  },
  banner: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: 128,
  },
  innerContainer: {
    padding: 16,
    flex: 1,
  },
});

SubscriptionSettingItem.fragments = {
  entry: gql`
    fragment SubscriptionSettingItemSubscription on SubscriptionChannelSubscription {
      id
      activatedAt
      expiresAt
      cancelledAt
      state
      paymentFailedAt
      externalReference
      channel {
        subscription {
          tier
          provider
        }
        id
        name
        offlineBanner
        logo
      }
    }
  `,
};
