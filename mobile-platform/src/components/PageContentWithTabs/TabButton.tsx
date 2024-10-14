import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

export type Tab = {
  index: number;
  name: string;
  icon: ReactNode;
};

type TabButtonProps = {
  tab: Tab;
  isSelected: boolean;
  windowWidth: number;
  onChangeTab: (tab: Tab) => void;
  index: number;
  hideTabName?: boolean;
  scrollX?: SharedValue<number>;
};

export const TabButton = ({
  onChangeTab,
  isSelected,
  tab,
  windowWidth,
  index,
  hideTabName,
  scrollX,
}: TabButtonProps) => {
  const tabOpacityStyle = useAnimatedStyle(() => {
    if (scrollX) {
      const opacity = interpolate(
        scrollX.value,
        [(index - 1) * windowWidth, index * windowWidth, (index + 1) * windowWidth],
        [0.5, 1, 0.5], // Opacity transitions from 0.5 -> 1 -> 0.5
        Extrapolation.CLAMP,
      );

      return { opacity };
    }

    return {
      opacity: isSelected ? 1 : 0.5,
    };
  }, [isSelected]);

  return (
    <TouchableOpacity
      aria-label={`go to ${tab.name} tab`}
      aria-selected={isSelected}
      key={tab.name}
      style={[s.tab, isSelected && s.tabSelected]}
      onPress={() => onChangeTab(tab)}
    >
      <HStack
        alignItems="center"
        justifyContent="center"
        spacing={8}
      >
        <Animated.View style={tabOpacityStyle}>{tab.icon}</Animated.View>
        {!hideTabName && (
          <Typography
            color={isSelected ? 'whiteMain' : 'whiteTransparent50'}
            fontSize="md"
            fontWeight="semiBold"
            uppercase
          >
            {tab.name}
          </Typography>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  tabSelected: {
    borderBottomColor: colors.whiteMain,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 36,
    paddingVertical: 16,
  },
});
