import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { currencyImageMap } from './rewardedVideoUtils';

import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { RewardHintFragment } from '@gen/graphql';
import { WalletCurrencyId } from '@utils/currency';

type Props = {
  rewardHint?: Nullable<RewardHintFragment>;
};

export const RewardContainsHint = ({ rewardHint }: Props) => {
  return (
    <VStack>
      <Typography
        color="textSecondary"
        fontWeight="medium"
        textAlign="center"
        uppercase
      >
        May contain:
      </Typography>
      <Gutter height={12} />
      <HStack
        justifyContent="center"
        spacing={6}
      >
        {rewardHint?.reward.prizes.map((prize, index) => (
          <HStack
            alignItems="center"
            key={'prize-' + index}
            style={s.pill}
          >
            <Image
              source={currencyImageMap[prize.value as WalletCurrencyId]}
              style={s.image}
            />
            <Gutter width={6} />
            <Typography
              fontSize="md"
              fontWeight="bold"
            >
              {prize.min}-{prize.max}
            </Typography>
          </HStack>
        ))}
      </HStack>
    </VStack>
  );
};

RewardContainsHint.fragments = {
  rewardHint: gql`
    fragment RewardHint on AdsGetPlacementResponse {
      placementId
      reward {
        rarity
        prizes {
          kind
          value
          min
          max
          amount
        }
      }
    }
  `,
};

const s = StyleSheet.create({
  pill: {
    borderRadius: 32,
    borderColor: colors.whiteTransparent20,
    borderWidth: 1,
    padding: 6,
    paddingRight: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});
