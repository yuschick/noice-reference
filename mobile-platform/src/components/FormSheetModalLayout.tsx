import { useNavigation } from '@react-navigation/native';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gutter } from './Gutter';
import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

import { borderRadius, colors } from '@constants/styles';
import { useIsLandscape } from '@hooks/useIsLandscape.hook';

type ActionButton = {
  title: string;
  enabled: boolean;
  onPress: () => void;
};

interface Props {
  children?: React.ReactNode;
  disableClose?: boolean;
  style?: StyleProp<ViewStyle>;
  topGutter?: number;
  headerAction?: ActionButton;
  isScrollable?: boolean;
}

const BASE_BOTTOM_PADDING = 32;

export const FormSheetModalLayout = ({
  children,
  disableClose,
  topGutter,
  style,
  headerAction,
  isScrollable,
}: Props) => {
  const keyboard = useAnimatedKeyboard();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isLandscape } = useIsLandscape();
  const window = useWindowDimensions();

  const wrapper = useAnimatedStyle(() => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: Math.max(
      0,
      keyboard.height.value - insets.bottom - BASE_BOTTOM_PADDING,
    ),
  }));

  const onCloseModal = () => {
    if (disableClose) {
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Animated.View style={!isScrollable && wrapper}>
      <TouchableOpacity
        activeOpacity={1}
        style={s.closeModalArea}
        onPress={onCloseModal}
      />
      <VStack
        style={[
          s.container,
          {
            paddingBottom: insets.bottom + BASE_BOTTOM_PADDING,
            maxWidth: isLandscape ? window.width * 0.66 : window.width,
          },
          style,
        ]}
      >
        <Gutter height={24} />
        <HStack justifyContent="center">
          <View style={s.notch} />
        </HStack>
        <Gutter height={topGutter ?? 32} />

        {headerAction && (
          <HStack justifyContent="flex-end">
            <TouchableOpacity
              disabled={!headerAction.enabled}
              style={[s.button, headerAction.enabled && s.buttonEnabled]}
              onPress={headerAction.onPress}
            >
              <Typography
                color={headerAction.enabled ? 'textDark' : 'textSecondary'}
                fontSize="sm"
                fontWeight="medium"
                uppercase
              >
                {headerAction.title}
              </Typography>
            </TouchableOpacity>
          </HStack>
        )}
        {children}
      </VStack>
    </Animated.View>
  );
};

FormSheetModalLayout.containerStyle = {
  backgroundColor: 'transparent',
} as ViewStyle;

const s = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    marginHorizontal: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.gray900,
  },
  closeModalArea: {
    ...StyleSheet.absoluteFillObject,
  },
  notch: {
    width: 56,
    height: 5,
    borderRadius: 16,
    backgroundColor: colors.whiteTransparent90,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: colors.whiteTransparent05,
    borderRadius: borderRadius.radiusXl,
  },
  buttonEnabled: {
    backgroundColor: colors.whiteMain,
  },
});
