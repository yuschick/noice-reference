import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { RewardChest } from './Ads/RewardChest';
import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';
import { RarityRarity } from '@gen/graphql';

interface RewardedVideoBannerProps {
  onPress?: () => void;
}

export const RewardedVideoBanner = ({ onPress }: RewardedVideoBannerProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        alignItems="center"
        style={s.container}
      >
        <LinearGradient
          colors={[colors.violet700, colors.magenta700]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={s.gradient}
        />
        <VStack>
          <Typography
            fontSize="lg"
            fontWeight="extraBold"
            uppercase
          >
            Get more rewards
          </Typography>
          <Typography
            color="magentaMain"
            fontSize="md"
            fontWeight="regular"
          >
            by watching video ads
          </Typography>
        </VStack>
        <View style={s.chest}>
          <RewardChest
            rarity={RarityRarity.RarityEpic}
            size={136}
          />
        </View>
      </HStack>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.yellow700,
    borderRadius: 12,
    padding: 16,
    overflow: 'visible',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  chest: {
    position: 'absolute',
    right: -10,
    top: -60,
  },
});
