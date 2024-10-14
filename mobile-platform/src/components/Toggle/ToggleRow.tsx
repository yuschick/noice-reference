import { color } from '@noice-com/design-tokens';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import { ToggleButton, ToggleButtonProps } from './ToggleButton';

import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

interface Props extends ToggleButtonProps {
  text: string;
  textColor?: keyof typeof color;
  textStyle?: StyleProp<TextStyle>;
  hideOutline?: boolean;
}

export const ToggleButtonRow = ({
  text,
  textColor,
  textStyle,
  hideOutline,
  ...rest
}: Props) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      spacing={16}
      style={[s.row, !hideOutline && s.outline]}
    >
      <Typography
        color={textColor ?? 'textLight'}
        fontSize="md"
        fontWeight="medium"
        style={[s.flex, textStyle]}
      >
        {text}
      </Typography>
      <ToggleButton {...rest} />
    </HStack>
  );
};

const s = StyleSheet.create({
  row: {
    borderRadius: 8,
    borderColor: colors.whiteTransparent20,
  },
  outline: {
    borderWidth: 1,
    padding: 16,
  },
  flex: {
    flex: 1,
  },
});
