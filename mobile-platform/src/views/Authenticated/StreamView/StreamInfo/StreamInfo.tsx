import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FollowButton } from './FollowButton';

import { ButtonIcon } from '@components/ButtonIcon';
import { ButtonLarge } from '@components/ButtonLarge';
import { ChannelLogo } from '@components/ChannelLogo';
import { Gutter } from '@components/Gutter';
import { PillLabel } from '@components/PillLabel';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  StreamInfoChannelFragment,
  SubscriptionChannelSubscriptionState,
} from '@gen/graphql';
import { useSubscriptionById } from '@hooks/purchases/useSubscriptionById.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';

interface Props {
  channelId: string;
  onSubscribe?: () => void;
  onManageSubscription?: () => void;
  onChannelOptions?: () => void;

  channelData: StreamInfoChannelFragment;
}

export function StreamInfo({
  channelData: { title, name, logo, game, matureRatedContent, subscription },
  channelId,
  onChannelOptions,
  onSubscribe,
  onManageSubscription,
}: Props) {
  const subscribed =
    subscription?.state === SubscriptionChannelSubscriptionState.StateActive;
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { product } = useSubscriptionById(channelId);

  const navigateToChannel = () => {
    navigation.navigate('channel', { channelName: name });
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={s.container}
    >
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={12}
      >
        <TouchableOpacity onPress={navigateToChannel}>
          <ChannelLogo
            logo={logo}
            name={name}
            isOnline
          />
        </TouchableOpacity>
        <VStack
          alignItems="stretch"
          justifyContent="flex-start"
          spacing={4}
          style={s.textColumn}
        >
          <TouchableOpacity onPress={navigateToChannel}>
            <Typography
              color="textLight"
              fontSize="lg"
              fontWeight="extraBold"
              lineHeight="lg"
            >
              {name}
            </Typography>
          </TouchableOpacity>
          <Typography
            color="gray400"
            fontSize="sm"
            fontWeight="regular"
            lineHeight="sm"
          >
            {title}
          </Typography>

          <HStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={8}
            style={s.pillRow}
          >
            {game && (
              <PillLabel
                color="whiteTransparent10"
                label={game.name}
              />
            )}
            {matureRatedContent && (
              <PillLabel
                color="whiteTransparent10"
                label="Mature"
              />
            )}
          </HStack>
        </VStack>
      </HStack>
      <Gutter height={24} />
      <HStack
        alignItems="center"
        justifyContent="space-between"
        spacing={8}
      >
        <FollowButton
          channelId={channelId}
          flex={1}
          pathname="stream"
        />
        {!product || product.price <= 0 ? null : (
          <ButtonLarge
            backgroundColor={subscribed ? 'white' : 'gray850'}
            flex={subscribed ? 3 : 1}
            iconElement={
              subscribed ? (
                <IconAssets.Menu
                  color={colors.darkMain}
                  height={24}
                  width={24}
                />
              ) : undefined
            }
            style={s.subscribeButton}
            textColor={subscribed ? 'black' : 'white'}
            iconOnRight
            onPress={subscribed ? onManageSubscription : onSubscribe}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </ButtonLarge>
        )}
        <ButtonIcon onPress={onChannelOptions}>
          <IconAssets.Menu
            color="white"
            height={24}
            width={24}
          />
        </ButtonIcon>
      </HStack>
    </Animated.View>
  );
}

StreamInfo.fragments = {
  channel: gql`
    fragment StreamInfoChannel on ChannelChannel {
      name
      title
      following
      matureRatedContent
      currentStream {
        streamId
        noicePredictionsEnabled
      }
      game {
        id
        name
      }
      subscription {
        state
      }
      ...ChannelLogo
    }
    ${ChannelLogo.fragments.channel}
  `,
};

const s = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.gray900,
  },
  textColumn: {
    flex: 1,
  },
  pillRow: {
    paddingTop: 8,
  },
  subscribeButton: {
    flex: 1,
    paddingVertical: 12,
  },
});
