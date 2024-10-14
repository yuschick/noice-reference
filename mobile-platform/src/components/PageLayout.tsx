import { Nullable } from '@noice-com/utils';
import { useHeaderHeight } from '@react-navigation/elements';
import { Image } from 'expo-image';
import { PropsWithChildren, useMemo } from 'react';
import {
  ImageSourcePropType,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollViewProps,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/styles';

import { Gutter } from './Gutter';
import { PageScrollView } from './List/PageScrollView';

import { ImageAssets } from '@utils/image';

interface Props {
  style?: StyleProp<ViewStyle>;
  centerScrollView?: boolean;
  /**
   * Set parent wrapper component styles. Note should in general never have to modify this, try using style instead.
   */
  parentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: keyof typeof colors;
  backgroundImage?: Nullable<ImageSourcePropType>;
  container?: 'scrollView' | 'view' | 'custom';
  footer?: React.ReactNode;
  disableSafeArea?: boolean;
  withHeader?: boolean;
  hideStatusBar?: boolean;
  headerBottomRowElement?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  title?: string;
  onHeaderLeftPress?: () => void;
  uppercaseTitle?: boolean;
  enableKeyboardAvoidance?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  coverPhoto?: ImageSourcePropType;
}

interface FooterProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

const FOOTER_NO_INSETS_BOTTOM = 16;

export const PageLayout = ({
  children,
  parentContainerStyle,
  style,
  centerScrollView,
  backgroundImage = ImageAssets.background,
  backgroundColor = 'darkMain',
  container = 'scrollView',
  footer,
  disableSafeArea,
  withHeader = true,
  hideStatusBar,
  headerLeft,
  headerRight,
  title,
  onHeaderLeftPress,
  headerBottomRowElement,
  subtitle,
  uppercaseTitle,
  enableKeyboardAvoidance = true,
  keyboardShouldPersistTaps,
  coverPhoto,
}: PropsWithChildren<Props>) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const childrenWrapped = useMemo(() => {
    if (container === 'scrollView') {
      return (
        <>
          <PageScrollView
            centerItemsVertically={centerScrollView}
            coverPhoto={coverPhoto}
            enableKeyboardAvoidance={enableKeyboardAvoidance}
            headerBottomRowElement={headerBottomRowElement}
            headerLeft={headerLeft}
            headerRight={headerRight}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            style={[s.container, s.scrollView, style]}
            subtitle={subtitle}
            title={title}
            uppercaseTitle={uppercaseTitle}
            withHeader={withHeader}
            onHeaderLeftPress={onHeaderLeftPress}
          >
            {children}
          </PageScrollView>
          {footer}
        </>
      );
    }

    if (container === 'view') {
      return (
        <>
          <KeyboardAvoidingView
            behavior="padding"
            enabled={enableKeyboardAvoidance}
            keyboardVerticalOffset={16}
            style={[s.container, style]}
          >
            {children}
          </KeyboardAvoidingView>
          {footer}
        </>
      );
    }

    return (
      <>
        {children}
        {footer}
      </>
    );
  }, [
    container,
    children,
    footer,
    centerScrollView,
    coverPhoto,
    enableKeyboardAvoidance,
    headerBottomRowElement,
    headerLeft,
    headerRight,
    keyboardShouldPersistTaps,
    style,
    subtitle,
    title,
    uppercaseTitle,
    withHeader,
    onHeaderLeftPress,
  ]);

  const Wrapper = disableSafeArea ? View : SafeAreaView;

  return (
    <Wrapper
      style={[
        s.wrapper,
        { backgroundColor: colors[backgroundColor] },
        parentContainerStyle,
      ]}
    >
      <StatusBar
        barStyle="light-content"
        hidden={hideStatusBar}
      />
      <Gutter height={headerHeight - insets.top} />
      {!!backgroundImage && (
        <Image
          contentFit="cover"
          source={backgroundImage}
          style={{ ...StyleSheet.absoluteFillObject, height, width }}
        />
      )}
      {childrenWrapped}
    </Wrapper>
  );
};

const PageLayoutFooter = ({ style, children }: FooterProps) => {
  const insets = useSafeAreaInsets();
  const footerBottomStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      paddingBottom:
        !isNaN(insets.bottom) && insets.bottom > 0
          ? insets.bottom
          : FOOTER_NO_INSETS_BOTTOM,
    }),
    [insets],
  );

  return <View style={[s.footer, footerBottomStyle, style]}>{children}</View>;
};

PageLayout.Footer = PageLayoutFooter;

type SimpleLayoutProps = {
  children: React.ReactNode;
  backgroundImage?: ImageSourcePropType;
};

const SimpleLayout = ({
  children,
  backgroundImage = ImageAssets.background,
}: SimpleLayoutProps) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={s.wrapper}>
      <Image
        contentFit="cover"
        source={backgroundImage}
        style={{ ...StyleSheet.absoluteFillObject, width, height }}
      />
      {children}
    </View>
  );
};

/**
 * Simple layout with a background image.
 * Use this layout when you're working with custom ScrollViews or VirutalizedLists
 */
PageLayout.Simple = SimpleLayout;

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.gray950,
    flex: 1,
  },
  scrollView: {
    overflow: 'visible',
  },
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
});
