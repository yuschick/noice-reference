import { useEffect, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { SpriteSheet, SpriteSheetRef } from '@components/SpriteSheet';
import { RarityRarity } from '@gen/graphql';
import {
  chestFxSheetImageMap,
  chestSpriteSheetImageMap,
} from '@views/Authenticated/RewardedVideoView/rewardedVideoUtils';

type Props = {
  rarity?: RarityRarity;
  size?: number;
  animationName?: 'idle' | 'open';
};

const SPRITE_SHEET_ROWS = 2;
const SPRITE_SHEET_COLUMNS = 8;

const FX_SPRITE_SHEET_ROWS = 1;
const FX_SPRITE_SHEET_COLUMNS = 2;

export const RewardChest = ({
  rarity = RarityRarity.RarityCommon,
  size = 64,
  animationName = 'idle',
}: Props) => {
  const chestImageSource = chestSpriteSheetImageMap[rarity];
  const fxImageSource = chestFxSheetImageMap[rarity];
  const ref = useRef<SpriteSheetRef>();
  const fxAnimation = useSharedValue(0);

  useEffect(() => {
    fxAnimation.value = withRepeat(
      withTiming(1, {
        duration: 1000,
      }),
      0,
      true,
    );
  }, [fxAnimation]);

  const container: ViewStyle = {
    width: size,
    height: size,
  };

  const fxSize = size * 1.5;
  const diff = fxSize - size;

  const fxStyle = useAnimatedStyle(
    () => ({
      ...StyleSheet.absoluteFillObject,
      transform: [
        { translateX: -diff / 2 },
        { translateY: -diff / 2 },
        { rotate: `${interpolate(fxAnimation.value, [0, 1], [-1, 1])}deg` },
      ],
      opacity: interpolate(fxAnimation.value, [0, 1], [0.6, 1]),
    }),
    [],
  );

  return (
    <View style={container}>
      {/* Body background */}
      <SpriteSheet
        animationName={animationName}
        animations={{
          idle: [13],
          open: [13],
        }}
        imageSize={size}
        ref={ref}
        source={chestImageSource}
        spriteSheetCols={SPRITE_SHEET_COLUMNS}
        spriteSheetRows={SPRITE_SHEET_ROWS}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Body */}
      <SpriteSheet
        animationName={animationName}
        animations={{
          idle: [12],
          open: [12],
        }}
        imageSize={size}
        ref={ref}
        source={chestImageSource}
        spriteSheetCols={SPRITE_SHEET_COLUMNS}
        spriteSheetRows={SPRITE_SHEET_ROWS}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Glimmer */}
      <SpriteSheet
        animationName={animationName}
        animations={{
          idle: [0],
          open: [-1],
        }}
        imageSize={fxSize}
        ref={ref}
        source={fxImageSource}
        spriteSheetCols={FX_SPRITE_SHEET_COLUMNS}
        spriteSheetRows={FX_SPRITE_SHEET_ROWS}
        style={fxStyle}
      />
      {/* Lid */}
      <SpriteSheet
        animationDuration={600}
        animationName={animationName}
        animations={{
          idle: [0],
          open: [0, 1, 2, 3, 4, 5, 6, 7],
        }}
        imageSize={size}
        ref={ref}
        source={chestImageSource}
        spriteSheetCols={SPRITE_SHEET_COLUMNS}
        spriteSheetRows={SPRITE_SHEET_ROWS}
        style={StyleSheet.absoluteFillObject}
        autoPlay
      />
    </View>
  );
};
