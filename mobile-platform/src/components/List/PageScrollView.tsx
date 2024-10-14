import { useNavigation } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import {
  ImageSourcePropType,
  KeyboardAvoidingView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { HEADER_BOTTOM_ROW_HEIGHT, HEADER_TOP_ROW_HEIGHT, Header } from './Header';
import { HeaderWithImage } from './HeaderWithImage';

import { Gutter } from '@components/Gutter';

interface Props extends ScrollViewProps {
  style?: StyleProp<ViewStyle>;
  centerItemsVertically?: boolean;
  withHeader?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerBottomRowElement?: React.ReactNode;
  subtitle?: React.ReactNode;
  title?: string;
  uppercaseTitle?: boolean;
  onHeaderLeftPress?: () => void;
  enableKeyboardAvoidance?: boolean;
  coverPhoto?: ImageSourcePropType;
}

export function PageScrollView({
  children,
  style,
  centerItemsVertically,
  withHeader,
  headerLeft,
  headerRight,
  onHeaderLeftPress,
  subtitle,
  title,
  headerBottomRowElement,
  uppercaseTitle,
  enableKeyboardAvoidance = true,
  coverPhoto,
  ...rest
}: PropsWithChildren<Props>) {
  const scrollY = useSharedValue(0);
  const navigation = useNavigation();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const adjustedHeaderBottomRowHeight = title ? HEADER_BOTTOM_ROW_HEIGHT : 0;

  return (
    <>
      <KeyboardAvoidingView
        behavior="height"
        enabled={enableKeyboardAvoidance}
        keyboardVerticalOffset={16}
        style={s.avoidingView}
      >
        <Animated.ScrollView
          contentContainerStyle={[
            centerItemsVertically && s.centerContainer,
            rest.contentContainerStyle,
          ]}
          scrollEventThrottle={16}
          style={style}
          onScroll={scrollHandler}
          {...rest}
        >
          {withHeader && (
            <Gutter height={HEADER_TOP_ROW_HEIGHT + adjustedHeaderBottomRowHeight} />
          )}
          {children}
          <Gutter height={80} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      {withHeader &&
        (coverPhoto ? (
          <HeaderWithImage
            coverPhoto={coverPhoto}
            goBack={goBack}
            headerBottomRowElement={headerBottomRowElement}
            headerLeft={headerLeft}
            headerRight={headerRight}
            scrollY={scrollY}
            subtitle={subtitle}
            title={title}
            uppercaseTitle={uppercaseTitle}
            onHeaderLeftPress={onHeaderLeftPress}
          />
        ) : (
          <Header
            goBack={goBack}
            headerBottomRowElement={headerBottomRowElement}
            headerLeft={headerLeft}
            headerRight={headerRight}
            scrollY={scrollY}
            subtitle={subtitle}
            title={title}
            uppercaseTitle={uppercaseTitle}
            onHeaderLeftPress={onHeaderLeftPress}
          />
        ))}
    </>
  );
}

const s = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
    flex: 1,
  },
});
