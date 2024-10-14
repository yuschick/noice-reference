import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity } from 'react-native';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { Gutter } from './Gutter';
import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';

interface Props {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const CheckBox = ({
  checked = false,
  onToggle,
  disabled,
  textStyle,
  children,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={disabled && s.disabled}
      onPress={() => onToggle?.(!checked)}
    >
      <HStack>
        <VStack
          alignItems="center"
          justifyContent="center"
          style={s.toggle}
        >
          {checked ? (
            <Svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <Path
                clipRule="evenodd"
                d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM10 14L7 11C6.44772 10.4477 5.55228 10.4477 5 11C4.44772 11.5523 4.44772 12.4477 5 13L10 18L19 9C19.5523 8.44772 19.5523 7.55228 19 7C18.4477 6.44772 17.5523 6.44771 17 7L10 14Z"
                fill="url(#gradient)"
                fillRule="evenodd"
              />
              <Defs>
                <LinearGradient
                  gradientUnits="userSpaceOnUse"
                  id="gradient"
                  x1="2"
                  x2="22"
                  y1="12"
                  y2="12"
                >
                  <Stop stopColor="#3CEB18" />
                  <Stop
                    offset="1"
                    stopColor="#00EAE8"
                  />
                </LinearGradient>
              </Defs>
            </Svg>
          ) : null}
        </VStack>
        {children ? (
          <>
            <Gutter width={12} />
            <Typography
              color="textSecondary"
              fontSize="lg"
              fontWeight="medium"
              lineHeight="xl"
              style={[s.flex, textStyle]}
            >
              {children}
            </Typography>
          </>
        ) : (
          <></>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  toggle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.gray400,
    borderRadius: 4,
    marginTop: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  flex: {
    flex: 1,
  },
});
