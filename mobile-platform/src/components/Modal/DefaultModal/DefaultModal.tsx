import { BlurView } from '@react-native-community/blur';
import { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnimateDefaultModal } from './useAnimateDefaultModal.hook';

import { colors } from '@constants/styles';

export interface DefaultModalProps {
  visible?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

const MODAL_MAX_WIDTH = 360;
const MODAL_PADDING = 16;
// Time before returning to default position after touch end
const ANIMATE_BACK_DURATION = 600;

export const DefaultModal = ({
  visible,
  children,
  onClose,
  style,
}: DefaultModalProps) => {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const modalWidth = Math.min(window.width - MODAL_PADDING * 2, MODAL_MAX_WIDTH);
  const maxHeight = window.height - insets.bottom - insets.top;

  const { clampedX, opacity, pan, panResponder, rotateZ, scale } = useAnimateDefaultModal(
    {
      isEnabled: !!onClose,
      maxDragDistance: window.height * 0.33,
      modalMaxXDrag: MODAL_PADDING,
      resetPositionDuration: ANIMATE_BACK_DURATION,
      windowWidth: window.width,
      onClose,
    },
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.timing(pan, {
      duration: 0,
      delay: 0,
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }, [pan, visible]);

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <BlurView
        blurType={'chromeMaterialDark'}
        style={s.backgroundBlur}
      />
      <View style={s.contentWrapper}>
        <TouchableOpacity
          style={s.pressableBackdrop}
          onPress={onClose}
        />
        <Animated.View
          style={[
            s.content,
            {
              width: modalWidth,
              maxHeight,
              transform: [
                { translateX: clampedX },
                { translateY: pan.y },
                { scale },
                { rotateZ },
              ],
              opacity,
            },
            style,
          ]}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    backgroundColor: colors.gray950,
    borderRadius: 16,
    padding: 24,
    paddingVertical: 32,
    overflow: 'hidden',
    shadowColor: colors.gray950,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.33,
    shadowRadius: 24,
  },
  pressableBackdrop: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  backgroundBlur: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    opacity: 0.96,
  },
});
