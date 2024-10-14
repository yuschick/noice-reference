import { Fragment, useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Gutter } from './Gutter';
import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';

interface Props {
  codeLength: number;
  code: string;
  onChange: (code: string) => void;
  hasError?: boolean;
}

export const PinCodeInput = ({ code, codeLength, onChange, hasError }: Props) => {
  const inputRef = useRef<TextInput>(null);
  const pinArr = useMemo(() => Array.from({ length: codeLength }), [codeLength]);

  const onChangeText = (text: string) => {
    // Replace text
    const formattedCode = (text.match(/[0-9]/g) || []).join('');

    if (onChange) {
      onChange(formattedCode);
    }
  };

  return (
    <HStack>
      <>
        {pinArr.map((_: unknown, i: number, arr) => (
          <Fragment key={`pin-code-${i}`}>
            <View
              style={[
                s.pinBox,
                code.length > i && s.pinBoxFilled,
                hasError && s.pinCodeError,
              ]}
            >
              <Typography
                fontSize="xl"
                fontWeight="extraBold"
                textAlign="center"
              >
                {code[i]}
              </Typography>
            </View>
            {i !== arr.length - 1 && <Gutter width={8} />}
          </Fragment>
        ))}
      </>
      <TextInput
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
        keyboardAppearance="dark"
        keyboardType="numeric"
        maxLength={codeLength}
        numberOfLines={1}
        ref={inputRef}
        selection={{
          start: code.length,
          end: code.length,
        }}
        spellCheck={false}
        style={s.textInput}
        value={code}
        caretHidden
        disableFullscreenUI
        onChangeText={onChangeText}
      />
    </HStack>
  );
};

const s = StyleSheet.create({
  pinBox: {
    height: 52,
    flex: 1,
    backgroundColor: colors.blue750,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blue750,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pinBoxFilled: {
    borderColor: colors.gray500,
  },
  pinCodeError: {
    borderColor: colors.statusErrorMain,
  },
  textInput: {
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    opacity: 0,
    height: '100%',
  },
});
