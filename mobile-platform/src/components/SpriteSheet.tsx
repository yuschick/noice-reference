import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import {
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SpriteSheetAnimation = Record<string, number[]>;

type Props = {
  // Spritesheet props
  spriteSheetRows: number;
  spriteSheetCols: number;
  animations: SpriteSheetAnimation;
  source: ImageSourcePropType;
  animationName: keyof SpriteSheetAnimation;
  animationDuration?: number;
  autoPlay?: boolean;
  loop?: boolean;
  alternate?: boolean;

  // Image props
  style?: StyleProp<ViewStyle>;
  imageSize?: number;
};

type Size = { width: number; height: number };

export type SpriteSheetRef = {
  playAnimation: () => void;
};

export const SpriteSheet = forwardRef(
  (
    {
      spriteSheetCols,
      spriteSheetRows,
      animations,
      source,
      imageSize = 64,
      animationDuration = 600,
      animationName,
      autoPlay = false,
      loop,
      alternate,
      style,
    }: Props,
    ref,
  ) => {
    const [spriteSheetSize, setSpriteSheetSize] = useState<Size>();
    const [frame, setFrame] = useState<Size>();
    const [currentAnimation, setCurrentAnimation] = useState<number[]>();
    const animation = useSharedValue(0);
    const [interpolateInput, setInterpolateInput] = useState<number[]>([0, 1]);
    const [interpolateOutputX, setInterpolateOutputX] = useState<number[]>([0, 1]);
    const [interpolateOutputY, setInterpolateOutputY] = useState<number[]>([0, 1]);

    const onImageLayout = (event: LayoutChangeEvent) => {
      if (frame && frame.width === imageSize && frame.height === imageSize) {
        return;
      }

      const defaultImageSize: Size = {
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      };

      const ratio = (imageSize * spriteSheetRows) / defaultImageSize.height;

      const image: Size = {
        width: defaultImageSize.width * ratio,
        height: imageSize * spriteSheetRows,
      };

      const newFrame: Size = {
        width: (defaultImageSize.width / spriteSheetCols) * ratio,
        height: imageSize,
      };

      setFrame(newFrame);
      setSpriteSheetSize(image);
    };

    useEffect(() => {
      const anim = animations[animationName];
      setCurrentAnimation(anim);
    }, [animationName, animations]);

    const getOffset = useCallback(
      (frameIndex: number) => {
        if (!currentAnimation || !frame) {
          return { x: 0, y: 0 };
        }

        const currentCol = frameIndex % spriteSheetCols;
        const currentRow = Math.floor((frameIndex / spriteSheetCols) % spriteSheetRows);

        return {
          x: -currentCol * frame.width,
          y: -currentRow * frame.height,
        };
      },
      [currentAnimation, frame, spriteSheetCols, spriteSheetRows],
    );

    const playAnimation = useCallback(() => {
      if (!currentAnimation) {
        return;
      }

      const startFrame = currentAnimation[0];
      const endFrame = currentAnimation[currentAnimation.length - 1];

      animation.value = startFrame;
      animation.value = withRepeat(
        withTiming(endFrame, {
          duration: animationDuration,
        }),
        loop ? 0 : 1,
        alternate,
      );
    }, [alternate, animation, animationDuration, currentAnimation, loop]);

    useEffect(() => {
      if (!currentAnimation?.length) {
        return;
      }

      const input = currentAnimation.map((index) => [index, index + 1]).flat();
      const outputX = currentAnimation
        .map((index) => {
          const val = getOffset(index).x;

          return [val, val];
        })
        .flat();
      const outputY = currentAnimation
        .map((index) => {
          const val = getOffset(index).y;

          return [val, val];
        })
        .flat();

      setInterpolateInput(input);
      setInterpolateOutputX(outputX);
      setInterpolateOutputY(outputY);

      if (autoPlay) {
        playAnimation();
      }
    }, [
      alternate,
      animation,
      animationDuration,
      autoPlay,
      currentAnimation,
      getOffset,
      imageSize,
      frame,
      loop,
      playAnimation,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        playAnimation,
      }),
      [playAnimation],
    );

    const imageAnimationStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(animation.value, interpolateInput, interpolateOutputX),
        },
        {
          translateY: interpolate(animation.value, interpolateInput, interpolateOutputY),
        },
      ],
    }));

    return (
      <Animated.View style={[frame, s.container, style]}>
        <Animated.Image
          resizeMode="cover"
          source={source}
          style={[spriteSheetSize, imageAnimationStyle]}
          onLayout={onImageLayout}
        />
      </Animated.View>
    );
  },
);

const s = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
