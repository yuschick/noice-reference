import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { Gutter } from './Gutter';
import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';
import { AdsRewardDescriptionPrizeDescriptionKind } from '@gen/graphql';
import { ImageAssets } from '@utils/image';

interface PillProps {
  kind: AdsRewardDescriptionPrizeDescriptionKind;
  value: number | string;
}

const mapKindToImage = (kind: AdsRewardDescriptionPrizeDescriptionKind) => {
  switch (kind) {
    case AdsRewardDescriptionPrizeDescriptionKind.KindCurrency:
      return ImageAssets.CreditMd;
    case AdsRewardDescriptionPrizeDescriptionKind.KindExperiencePoints:
      return ImageAssets.CoinMd;
    case AdsRewardDescriptionPrizeDescriptionKind.KindUnspecified:
      return ImageAssets.ReshuffleTokenMd;
  }
};

export const CurrencyPill = ({ kind, value }: PillProps) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      style={s.pill}
    >
      <Image
        source={mapKindToImage(kind)}
        style={s.image}
      />
      <Gutter width={8} />
      <Typography
        fontSize="sm"
        fontWeight="bold"
        numberOfLines={1}
      >
        {value}
      </Typography>
    </HStack>
  );
};
const s = StyleSheet.create({
  pill: {
    overflow: 'hidden',
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 12,
    backgroundColor: colors.whiteTransparent10,
    borderRadius: 100,
  },
  image: {
    width: 22,
    height: 22,
  },
});
