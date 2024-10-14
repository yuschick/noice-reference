import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { colors, typography } from '@constants/styles';

interface Props extends TextInputProps {
  hasError?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  hint?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _TextArea = (
  {
    hasError = false,
    wrapperStyle,
    style,
    maxLength,
    hint,
    placeholder,
    onBlur,
    onChangeText,
    onFocus,
    ...rest
  }: Props,
  ref: React.Ref<TextInput>,
) => {
  const [selected, setSelected] = useState(false);
  const [text, setText] = useState<string>();
  const animation = useRef(new Animated.Value(0));

  const translateY = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: selected || text?.length ? 1 : 0,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [selected, text]);

  return (
    <View style={wrapperStyle}>
      <TextInput
        keyboardAppearance="dark"
        ref={ref}
        {...rest}
        placeholder={selected ? '' : placeholder}
        placeholderTextColor={!hasError ? colors.gray400 : colors.red300}
        style={[
          s.container,
          selected && s.selectedContainer,
          (selected || !!text?.length) && s.padInputText,
          hasError && s.invalidContainer,
          style,
        ]}
        onBlur={(e) => {
          onBlur?.(e);
          setSelected(false);
        }}
        onChangeText={(changedText) => {
          setText(changedText);
          onChangeText?.(changedText);
        }}
        onFocus={(e) => {
          onFocus?.(e);
          setSelected(true);
        }}
      />
      {(selected || !!text?.length) && (
        <Animated.View
          style={[
            s.selectedPlaceholder,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <Typography
            color={hasError ? 'statusError300' : selected ? 'tealMain' : 'textSecondary'}
            fontSize="sm"
            fontWeight="medium"
          >
            {placeholder}
          </Typography>
        </Animated.View>
      )}
      <HStack
        justifyContent="space-between"
        style={s.footer}
      >
        <Typography
          color={hasError ? 'statusError300' : 'textLightSecondary'}
          fontSize="sm"
        >
          {hint}
        </Typography>
        {!!maxLength && (
          <Typography
            color={hasError ? 'statusError300' : 'textLightSecondary'}
            fontSize="sm"
          >{`${text?.length ?? 0}/${maxLength}`}</Typography>
        )}
      </HStack>
    </View>
  );
};

export const TextArea = forwardRef(_TextArea);

const s = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.blue650,
    borderRadius: 8,
    backgroundColor: colors.blue750,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    fontSize: typography.fontSize.md,
    minHeight: 144,
  },
  selectedContainer: {
    borderColor: colors.tealMain,
  },
  padInputText: {
    paddingTop: 24,
  },
  invalidContainer: {
    borderColor: colors.statusError300,
  },
  selectedPlaceholder: {
    position: 'absolute',
    left: 17,
    top: 10,
  },
  footer: {
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
