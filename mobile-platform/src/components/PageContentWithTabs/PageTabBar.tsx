import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Tab, TabButton } from './TabButton';

import { HStack } from '@components/Stack/HStack';
import { colors } from '@constants/styles';

type Props = {
  tabs: Tab[];
  selectedTab: Tab['name'];
  onChangeTab: (tab: Tab) => void;
  hideTabNames?: boolean;
  scrollX?: SharedValue<number>;
};

export const PageTabBar = ({
  tabs,
  selectedTab,
  onChangeTab,
  hideTabNames,
  scrollX,
}: Props) => {
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;
  const selectedTranslateX = useSharedValue(0);

  useEffect(() => {
    const selectedTabIndex = tabs.findIndex((tab) => tab.name === selectedTab);

    selectedTranslateX.value = withTiming(tabWidth * selectedTabIndex, {
      duration: 200,
    });
  }, [tabs, selectedTab, tabWidth, selectedTranslateX]);

  const lineStyle = useAnimatedStyle(() => {
    if (!scrollX) {
      return {};
    }

    return {
      transform: [
        {
          translateX: (tabWidth / width) * scrollX.value,
        },
      ],
    };
  });

  return (
    <>
      <HStack justifyContent="space-evenly">
        {tabs.map((tab, index) => (
          <TabButton
            hideTabName={hideTabNames}
            index={index}
            isSelected={selectedTab === tab.name}
            key={tab.name}
            scrollX={scrollX}
            tab={tab}
            windowWidth={width}
            onChangeTab={onChangeTab}
          />
        ))}
      </HStack>
      <Animated.View style={{ width }}>
        <Animated.View
          style={[
            scrollX ? lineStyle : { transform: [{ translateX: selectedTranslateX }] },
            s.line,
            {
              width: tabWidth,
            },
          ]}
        />
      </Animated.View>
    </>
  );
};

const s = StyleSheet.create({
  line: {
    height: 2,
    backgroundColor: colors.whiteMain,
  },
});
