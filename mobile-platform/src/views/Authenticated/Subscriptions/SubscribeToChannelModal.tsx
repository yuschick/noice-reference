import { gql, useApolloClient } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Image } from 'expo-image';
import { DeepPartial } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { SubscribeButton } from './SubscribeButton';

import { ChannelLogo } from '@components/ChannelLogo';
import { Divider } from '@components/Divider';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import { LoadingView } from '@components/LoadingView';
import { VStack } from '@components/Stack/VStack';
import { useToasts } from '@components/Toast/hooks/useToasts.hook';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { links } from '@constants/links';
import { borderRadius, colors } from '@constants/styles';
import {
  BadgeBadgeType,
  ChannelChannel,
  SubscriptionChannelSubscriptionState,
  useSubscriptionInfoQuery,
  useSubscriptionModalQuery,
} from '@gen/graphql';
import { usePurchaseSubscription } from '@hooks/purchases/usePurchaseSubscription.hook';
import { useSubscriptionById } from '@hooks/purchases/useSubscriptionById.hook';
import { Analytics } from '@lib/Analytics';
import { MarketingTracking } from '@lib/MarketingTracking';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { getChannelEmojis } from '@utils/emoji';
import { IconAssets } from '@utils/icons';
import { openURL } from '@utils/open-url';
import { pluralize } from '@utils/strings';

gql`
  query SubscriptionModal($channelId: ID!) {
    channel(id: $channelId) {
      name
      logo
      ...SubscriptionGetChannelEmojisChannel
    }
  }
`;

function formatCurrency(value: number, currencyCode: string, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

export const SubscribeToChannelModal = ({
  navigation,
  route: {
    params: { channelId },
  },
}: AuthenticatedScreenProps<'subscribeToChannel'>) => {
  const { addToast } = useToasts();
  const { refetch } = useSubscriptionInfoQuery({
    ...variablesOrSkip({ channelId }),
  });
  const { data } = useSubscriptionModalQuery({
    ...variablesOrSkip({ channelId }),
  });
  const client = useApolloClient();

  const { product, isLoading, customer } = useSubscriptionById(channelId);
  const { purchaseSubscription, isPurchaseLoading } = usePurchaseSubscription({
    customer,
    productId: product?.id,
  });

  const subscriptionSuccessCallback = () => {
    // on successful subscription update the subscription info and navigate back
    refetch();

    // Optimistically update the cache
    client.cache.updateFragment<DeepPartial<ChannelChannel>>(
      {
        id: client.cache.identify({
          __typename: 'ChannelChannel',
          id: channelId,
        }),
        fragment: gql`
          fragment UpdateStreamSubscription on ChannelChannel {
            __typename
            id
            subscription {
              __typename
              state
            }
          }
        `,
      },
      (existingData) => ({
        __typename: 'ChannelChannel',
        ...existingData,
        subscription: {
          __typename: 'SubscriptionChannelSubscription',
          state: SubscriptionChannelSubscriptionState.StateActive,
        },
      }),
    );

    addToast({
      title: 'Subscribed!',
      icon: (
        <IconAssets.CheckCircle
          color={colors.blackMain}
          height={24}
          width={24}
        />
      ),
    });
    navigation.goBack();
  };

  const subscribe = () => {
    purchaseSubscription(subscriptionSuccessCallback);

    Analytics.trackEvent({
      clientButtonClick: {
        action: 'SUBSCRIBE',
        section: 'subscribe-to-channel-modal',
      },
    });

    if (product) {
      MarketingTracking.trackPurchase('purchased_a_subscription', {
        price: product.price.toString(),
        priceValue: product.price,
        id: product.id,
        currencyCode: product.currencyCode,
        title: product.title,
      });
    }
  };

  const openTermsOfSales = () => {
    openURL(links.termsOfService);
  };

  const openPrivacyPolicy = () => {
    openURL(links.privacyPolicy);
  };

  const emojis = getChannelEmojis(data?.channel ?? {});
  const channelName = data?.channel?.name ?? '';

  return (
    <FormSheetModalLayout
      style={s.modal}
      isScrollable
    >
      <ScrollView contentContainerStyle={s.scrollView}>
        <View style={s.topRow}>
          <ChannelLogo
            logo={data?.channel?.logo}
            name={data?.channel?.name ?? ''}
            size="medium"
          />
          <VStack>
            <Typography
              fontSize="lg"
              fontWeight="extraBold"
            >
              Subscribe to {channelName}
            </Typography>
            <Typography
              color="textLightSecondary"
              fontSize="md"
            >
              Renews every month
            </Typography>
          </VStack>
        </View>
        <Gutter height={16} />
        <Typography
          color="textLightSecondary"
          fontSize="sm"
        >
          By subscribing you’ll support {channelName} and also unlock special channel
          perks. The subscription will renew automatically on a monthly basis unless
          cancelled.
        </Typography>
        <Gutter height={24} />

        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          {isLoading ? (
            <LoadingView style={s.buttonLoader} />
          ) : (
            <SubscribeButton
              isLoading={isPurchaseLoading}
              price={formatCurrency(product?.price ?? 0, product?.currencyCode ?? 'USD')}
              text="Subscribe"
              onPress={subscribe}
            />
          )}
        </Animated.View>
        <Gutter height={8} />
        <Typography
          color="textLightSecondary"
          fontSize="xs"
          lineHeight="sm"
          textAlign="center"
        >
          By subscribing, you agree to Noice’s{' '}
          <Typography
            color="textLight"
            fontSize="xs"
            style={s.underlined}
            onPress={openTermsOfSales}
          >
            Terms of Sales
          </Typography>{' '}
          and knowledge our{' '}
          <Typography
            color="textLight"
            fontSize="xs"
            style={s.underlined}
            onPress={openPrivacyPolicy}
          >
            Privacy policy
          </Typography>
        </Typography>

        <Gutter height={24} />
        <Typography
          color="textLight"
          fontSize="md"
        >
          As a thank you from {channelName} you will get access to:
        </Typography>

        <View style={s.contentsContainer}>
          {emojis.length > 0 && (
            <>
              <Typography
                fontSize="lg"
                fontWeight="semiBold"
              >
                {pluralize(
                  emojis.length,
                  'Custom channel emote',
                  'Custom channel emotes',
                )}
                :
              </Typography>
              <Gutter height={16} />
              <View style={s.collectionContainer}>
                {emojis.map((emoji) => (
                  <Image
                    key={emoji.id}
                    source={{ uri: emoji.image }}
                    style={s.emojiIcon}
                  />
                ))}
              </View>
              <Gutter height={16} />
              <Divider />
              <Gutter height={16} />
            </>
          )}
          <Typography
            fontSize="lg"
            fontWeight="semiBold"
          >
            Subscriber badges:
          </Typography>
          <Gutter height={8} />
          <Typography
            color="textLightSecondary"
            fontSize="sm"
          >
            You will earn a new subscriber badge every month that you stay subscribed to
            show your support for the streamer in the chat and in your profile.
          </Typography>
          <Gutter height={16} />
          <View style={s.collectionContainer}>
            {Array(12)
              .fill(null)
              .map((_, i) => (
                <UserBadge
                  badge={{ type: BadgeBadgeType.TypeChannelSubscriber, level: i + 1 }}
                  key={i}
                  size={32}
                />
              ))}
          </View>
        </View>
        <Gutter height={124} />
      </ScrollView>
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  modal: {
    paddingHorizontal: 0,
  },
  scrollView: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  emojiIcon: {
    width: 24,
    height: 24,
  },
  buttonLoader: {
    height: 52, // height of the button
    width: '100%',
    borderRadius: 40,
  },
  contentsContainer: {
    marginTop: 16,
    backgroundColor: colors.gray800,
    padding: 16,
    borderRadius: borderRadius.radiusSm,
  },
  collectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  underlined: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});
