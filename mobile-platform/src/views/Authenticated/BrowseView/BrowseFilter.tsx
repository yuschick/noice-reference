import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { GamesFilterGameFragment } from '@gen/graphql';

type Props = {
  category: string;
  onPress: () => void;
  isSelected: boolean;
  gameId: string | undefined;
  onLayoutPosition?: (xPos: number) => void;
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const CategoryFilterItem = ({
  category,
  onPress,
  isSelected,
  gameId,
  onLayoutPosition,
}: Props) => {
  const noCreatorTag =
    gameId === 'just_chatting' || gameId === 'other_games' || gameId === undefined;

  return (
    <TouchableOpacity
      style={s.button}
      onLayout={(layout) =>
        onLayoutPosition?.(layout.nativeEvent.layout.x + layout.nativeEvent.layout.width)
      }
      onPress={onPress}
    >
      {isSelected && (
        <AnimatedLinearGradient
          colors={[colors.violet700, colors.violet600]}
          end={{ x: 1, y: 0 }}
          entering={FadeIn}
          exiting={FadeOut}
          start={{ x: 0, y: 0 }}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      )}
      <Typography uppercase>
        {noCreatorTag ? category : `${category} Creators`}
      </Typography>
    </TouchableOpacity>
  );
};

type FilterProps = {
  games?: GamesFilterGameFragment[] | null;
  setGameId: (gameId: string | undefined) => void;
  gameId: string | undefined;
};

export const BrowseFilter = ({ games, gameId, setGameId }: FilterProps) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [offsets, setOffsets] = useState<number[]>([]);

  useEffect(() => {
    setOffsets((prev) => prev.sort((a, b) => a - b));
  }, [offsets]);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      const offsetX = offsets.at(index) ?? 0;
      scrollRef.current?.scrollTo({
        x: index > 0 ? offsetX : 0,
        y: 0,
        animated,
      });
    },
    [offsets],
  );

  useLayoutEffect(() => {
    const atIndex = games?.findIndex((game) => game.id === gameId);
    scrollToIndex(atIndex ?? 0, false);
  }, [gameId, games, scrollToIndex]);

  const onSelect = useCallback(
    (id: string | undefined, index: number) => {
      setGameId?.(id);
      scrollToIndex(index);
    },
    [scrollToIndex, setGameId],
  );

  return (
    <ScrollView
      contentContainerStyle={s.scrollView}
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
      style={s.scrollViewInnerContainer}
      horizontal
    >
      <CategoryFilterItem
        category="All Creators"
        gameId={undefined}
        isSelected={gameId === undefined}
        onLayoutPosition={(x) => setOffsets((prev) => [...prev, x])}
        onPress={() => onSelect(undefined, 0)}
      />
      {games?.map((game, index) => (
        <CategoryFilterItem
          category={game.name}
          gameId={game.id}
          isSelected={gameId === game.id}
          key={game.id}
          onLayoutPosition={(x) => setOffsets((prev) => [...prev, x])}
          onPress={() => onSelect(game.id, index)}
        />
      ))}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.whiteTransparent10,
  },
  scrollView: {
    gap: 8,
  },
  scrollViewInnerContainer: { overflow: 'visible' },
});
