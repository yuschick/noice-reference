import { StyleSheet, View } from 'react-native';

import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';

interface Props {
  label?: string;
  color?: keyof typeof colors;
  textColor?: keyof typeof colors;
  height?: number;
}

export const Divider = ({
  label,
  color = 'gray750',
  textColor = 'textSecondary',
  height = 1,
}: Props) => {
  return (
    <HStack alignItems="center">
      <View style={[s.divider, { backgroundColor: colors[color], height }]} />
      {!!label && (
        <Typography
          color={textColor}
          fontSize="lg"
          fontWeight="medium"
          style={s.text}
        >
          {label}
        </Typography>
      )}
      <View style={[s.divider, { backgroundColor: colors[color], height }]} />
    </HStack>
  );
};

const s = StyleSheet.create({
  divider: { flex: 1 },
  text: {
    paddingHorizontal: 12,
  },
});
