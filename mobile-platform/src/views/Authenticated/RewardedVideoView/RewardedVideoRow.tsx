import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { chestStaticImageMap } from './rewardedVideoUtils';

import { VStack } from '@components/Stack/VStack';
import { colors } from '@constants/styles';
import { VideoRewardRowFragment } from '@gen/graphql';
import { IconAssets } from '@utils/icons';

type Props = {
  rewardData?: Nullable<VideoRewardRowFragment>;
  size?: 'normal' | 'small';
};

export const RewardedVideoRow = ({ rewardData, size = 'normal' }: Props) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={s.scrollView}
      horizontal
    >
      {rewardData?.rewards?.map((reward, i) => (
        <VStack
          alignItems="center"
          justifyContent="center"
          key={'rewarded-video-chest' + i}
          style={[s.imageContainer, i === 0 && s.imageContainerBackground]}
        >
          <View>
            <Image
              resizeMode="contain"
              source={chestStaticImageMap[reward.rarity]}
              style={size === 'small' ? s.imageSmall : s.image}
            />
            {i !== 0 && (
              <View style={s.lockIcon}>
                <IconAssets.Lock
                  color={colors.white}
                  height={24}
                  width={24}
                />
              </View>
            )}
          </View>
        </VStack>
      ))}
    </ScrollView>
  );
};

RewardedVideoRow.fragment = {
  reward: gql`
    fragment VideoRewardRow on AdsGetPlacementResponse {
      placementId
      rewards {
        rarity
      }
    }
  `,
};

const s = StyleSheet.create({
  scrollView: {
    overflow: 'visible',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.whiteTransparent10,
    borderBottomColor: colors.whiteTransparent10,
  },
  imageContainer: {
    padding: 12,
    borderRadius: 12,
  },
  imageContainerBackground: {
    backgroundColor: colors.whiteTransparent05,
    borderBottomWidth: 4,
    borderBottomColor: colors.tealMain,
  },
  lockIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  imageSmall: {
    width: 42,
    height: 42,
  },
});
