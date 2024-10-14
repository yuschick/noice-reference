import { forwardRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { Typography } from './Typography';

import { colors, typography } from '@constants/styles';

interface Props extends TextInputProps {
  hasError?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const InputField = forwardRef<TextInput, Props>(
  (
    {
      hasError,
      wrapperStyle,
      style,
      placeholder,
      onBlur,
      onChangeText,
      onFocus,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [selected, setSelected] = useState(false);
    const [text, setText] = useState<string>();
    const translateY = useSharedValue(0);

    const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);
      translateY.value = withTiming(0, {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
      setSelected(true);
    };

    const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(e);
      if (!text?.length) {
        translateY.value = withTiming(6, {
          duration: 100,
          easing: Easing.out(Easing.ease),
        });
      }
      setSelected(false);
    };

    const handleOnChangeText = (changedText: string) => {
      setText(changedText);
      onChangeText?.(changedText);
    };

    return (
      <View style={wrapperStyle}>
        <TextInput
          editable={!disabled}
          keyboardAppearance="dark"
          ref={ref}
          {...rest}
          placeholder={selected ? '' : placeholder}
          placeholderTextColor={
            !hasError ? (disabled ? colors.blue500 : colors.gray400) : colors.redMain
          }
          style={[
            s.container,
            selected && s.selectedContainer,
            (selected || !!text?.length) && s.padInputText,
            hasError && s.invalidContainer,
            disabled && { color: colors.blue500 },
            style,
          ]}
          onBlur={handleOnBlur}
          onChangeText={handleOnChangeText}
          onFocus={handleOnFocus}
        />
        {(selected || !!text?.length) && (
          <Animated.View
            style={[
              s.selectedPlaceholder,
              {
                transform: [{ translateY: translateY }],
              },
            ]}
          >
            <Typography
              color={hasError ? 'redMain' : selected ? 'tealMain' : 'textSecondary'}
              fontSize="sm"
              fontWeight="medium"
            >
              {placeholder}
            </Typography>
          </Animated.View>
        )}
      </View>
    );
  },
);

const s = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.blue650,
    borderRadius: 8,
    height: 56,
    backgroundColor: colors.blue750,
    paddingHorizontal: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    fontSize: typography.fontSize.md,
  },
  selectedContainer: {
    borderColor: colors.tealMain,
  },
  padInputText: {
    paddingTop: typography.fontSize.md + 1,
  },
  invalidContainer: {
    borderColor: colors.red400,
  },
  selectedPlaceholder: {
    position: 'absolute',
    left: 17,
    top: 10,
  },
});
