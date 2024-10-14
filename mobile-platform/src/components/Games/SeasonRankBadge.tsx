import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

import { Typography } from '@components/Typography';
import { getRankMeta } from '@utils/badges';

type SeasonRankBadgeProps = {
  rank: number;
  size?: number;
};

const DEFAULT_SIZE = 64;

export const SeasonRankBadge = ({ rank, size = DEFAULT_SIZE }: SeasonRankBadgeProps) => {
  const [badgeVFX, setBadgeVFX] = useState<ImageSourcePropType | null>(null);

  const { badge: BadgeIcon, idleVFX } = getRankMeta(rank);

  useEffect(() => {
    setBadgeVFX(idleVFX);

    setTimeout(() => {
      setBadgeVFX(null);
      /** 5250 is not a random value, it's the time it takes to loop the animation on the png twice  */
    }, 5250);
  }, [idleVFX]);

  if (!BadgeIcon) {
    return null;
  }

  return (
    <View style={{ height: size, width: size }}>
      <BadgeIcon
        height={size}
        width={size}
      />
      <Image
        source={badgeVFX}
        style={StyleSheet.absoluteFill}
      />
      <View style={s.badge}>
        <Typography
          fontSize={rank > 99 ? 'lg' : 'xl'}
          fontWeight="bold"
          textAlign="center"
        >
          {rank}
        </Typography>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  badge: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
