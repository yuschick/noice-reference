import { ReactNode, useRef, useState } from 'react';
import {
  Keyboard,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageTabBar } from './PageTabBar';
import { Tab } from './TabButton';

import { Gutter } from '@components/Gutter';
import { colors } from '@constants/styles';

export type TabWithContent = Tab & {
  component: ReactNode;
};

type Props = {
  tabs: TabWithContent[];
  contentSize: { width: number; height: number };
  disableHorizontalScroll?: boolean;
  initialTabIndex?: number;
  hideTabNames?: boolean;
  contentBackground?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const PageContentWithTabs = ({
  tabs,
  disableHorizontalScroll,
  initialTabIndex = 0,
  hideTabNames,
  contentBackground,
  contentSize,
}: Props) => {
  const maxTabIndex = tabs.length - 1;
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<Tab['name']>(
    tabs[initialTabIndex < maxTabIndex ? initialTabIndex : maxTabIndex].name,
  );
  const { width: windowWidth } = useWindowDimensions();
  const ref = useRef<Animated.FlatList<Tab>>(null);
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const changeTab = (tab: Tab) => {
    Keyboard.dismiss();
    setSelectedTab(tab.name);
    ref.current?.scrollToOffset({
      offset: tab.index * windowWidth,
      animated: true,
    });
  };

  if (tabs.length < 2) {
    return (
      <>
        {tabs[0].component}
        <Gutter height={insets.bottom} />
      </>
    );
  }

  const renderItem: ListRenderItem<TabWithContent> = ({ item }) => {
    return (
      <View
        key={item.name}
        style={{
          width: windowWidth,
        }}
      >
        {item.component}
      </View>
    );
  };

  const getItemLayout = (_data: ArrayLike<Tab> | null | undefined, index: number) => ({
    length: windowWidth,
    offset: windowWidth * index,
    index,
  });

  return (
    <View
      style={{
        width: contentSize.width,
        height: contentSize.height,
      }}
    >
      {/* Content background */}
      {!!contentBackground && (
        <View style={s.backgroundContainer}>
          {contentBackground}
          <View
            style={[
              s.overlay,
              {
                backgroundColor: colors.blackTransparent25,
              },
            ]}
          />
        </View>
      )}

      {/* Tab bar */}
      <PageTabBar
        hideTabNames={hideTabNames}
        scrollX={scrollX}
        selectedTab={selectedTab}
        tabs={tabs}
        onChangeTab={changeTab}
      />

      {/* Content */}
      <Animated.FlatList
        bounces={false}
        data={tabs}
        decelerationRate="normal"
        getItemLayout={getItemLayout}
        initialScrollIndex={initialTabIndex}
        ref={ref}
        renderItem={renderItem}
        scrollEnabled={!disableHorizontalScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
      />
      <Gutter height={insets.bottom} />
    </View>
  );
};

const s = StyleSheet.create({
  backgroundContainer: {
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    overflow: 'hidden',
  },
  overlay: {
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
});
