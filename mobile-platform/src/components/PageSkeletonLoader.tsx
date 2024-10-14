import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { LoadingView } from './LoadingView';
import { LargeHeaderGutter } from './PageHeaders/LargeHeader';
import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';

import { borderRadius } from '@constants/styles';

type Props = {
  showTitle?: boolean;
  titleWidth?: ViewStyle['width'];
  titlePaddingTop?: number;
  titlePaddingBottom?: number;
  listCardCount?: number;
  listCardPadding?: number;
  titleHeight?: number;
  listCardHeight?: number;
  listCardRowCount?: number;
  renderHeaderGutter?: boolean;
};

const DEFAULT_CARD_HEIGHT = 200;

export const PageSkeletonLoader = ({
  showTitle = true,
  titleWidth = '100%',
  listCardCount = 3,
  titlePaddingBottom = 12,
  titlePaddingTop,
  titleHeight = DEFAULT_CARD_HEIGHT / 2,
  listCardHeight = DEFAULT_CARD_HEIGHT,
  listCardPadding = 12,
  listCardRowCount = 1,
  renderHeaderGutter = true,
}: Props) => {
  const cardArr = Array.from({ length: listCardCount });
  const cardRowArr = Array.from({ length: listCardRowCount });

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={s.container}
    >
      {renderHeaderGutter && <LargeHeaderGutter />}
      {showTitle && (
        <LoadingView
          style={[
            s.mainCard,
            {
              height: titleHeight,
              width: titleWidth,
              marginTop: titlePaddingTop,
              marginBottom: titlePaddingBottom,
            },
          ]}
        />
      )}
      <VStack spacing={listCardPadding}>
        {cardArr.map((_, i) => (
          <HStack
            key={'page-skeleton-loader-card-row' + i}
            spacing={8}
          >
            {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              cardRowArr.map((_, j) => (
                <LoadingView
                  key={'page-skeleton-loader-card-' + i + '-' + j}
                  style={[s.mainCard, s.listCard, { height: listCardHeight }]}
                />
              ))
            }
          </HStack>
        ))}
      </VStack>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  mainCard: {
    borderRadius: borderRadius.radiusMd,
  },
  listCard: {
    flex: 1,
  },
});
