import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import {
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ChannelDetails } from './common/ChannelDetails';

import { LoadingView } from '@components/LoadingView';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { OfflineChannelThumbnailFragment } from '@gen/graphql';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { isNonEmptyString } from '@utils/equality';
import { formatLargeNumber } from '@utils/format';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';

OfflineChannelPreview.fragments = {
  channel: gql`
    fragment OfflineChannelThumbnail on ChannelChannel {
      id
      name
      offlineBanner
      following
      followerCount
      ...ChannelDetails
    }
    ${ChannelDetails.fragments.channel}
  `,
};

interface Props {
  channel: OfflineChannelThumbnailFragment;
}

export function OfflineChannelPreview({ channel }: Props) {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { name, offlineBanner, following, matureRatedContent } = channel;

  const handlePress = () => {
    navigation.navigate('channel', {
      channelName: name,
    });
  };

  const streamerName = isNonEmptyString(name) ? name : 'Unknown streamer';
  const thumbnailUrl: ImageSourcePropType = isNonEmptyString(offlineBanner)
    ? { uri: offlineBanner }
    : (ImageAssets.bannerFallback as ImageURISource);
  const followerCountLabel = formatLargeNumber(channel.followerCount);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <VStack
          alignItems="stretch"
          justifyContent="flex-start"
          spacing={4}
          style={s.wrapper}
        >
          <View style={s.thumbnail}>
            <Image
              placeholder={ImageAssets.bannerFallback}
              source={thumbnailUrl}
              style={s.image}
            />
          </View>
          {following && (
            <>
              <IconAssets.CornerTriangle style={s.followingMarkWrapper} />
              <IconAssets.Heart
                color={colors.greenMain}
                height={32}
                style={s.followingHeart}
                width={32}
              />
            </>
          )}
          <View style={s.footer}>
            <ChannelDetails
              channel={channel}
              matureRatedContent={matureRatedContent}
              title={streamerName}
            >
              <Typography
                color="gray400"
                fontSize="sm"
                fontWeight="regular"
              >
                <Typography
                  fontSize="sm"
                  fontWeight="semiBold"
                >
                  {followerCountLabel}
                </Typography>{' '}
                followers
              </Typography>
            </ChannelDetails>
          </View>
        </VStack>
      </TouchableOpacity>
    </Animated.View>
  );
}

OfflineChannelPreview.Loading = () => (
  <Animated.View
    exiting={FadeOut.duration(150)}
    style={s.loadingContainer}
  >
    <LoadingView style={s.loadingCard} />
  </Animated.View>
);

const s = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: borderRadius.radiusSm,
    overflow: 'hidden',
    backgroundColor: colors.gray900,
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    height: 128,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  followingMarkWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  followingHeart: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  loadingContainer: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.radiusMd,
    overflow: 'hidden',
  },
  loadingCard: {
    width: '100%',
    height: '100%',
  },
});
