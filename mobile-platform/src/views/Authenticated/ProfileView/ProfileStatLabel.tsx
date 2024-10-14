import { StyleSheet } from 'react-native';

import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';

interface Props {
  title: string;
  value: string;
}

export const ProfileStatLabel = ({ title, value }: Props) => {
  return (
    <VStack style={s.flex}>
      <Typography
        fontSize="xxl"
        fontWeight="extraBold"
        numberOfLines={1}
      >
        {value}
      </Typography>
      <Typography
        color="textSecondary"
        fontWeight="regular"
        numberOfLines={1}
      >
        {title}
      </Typography>
    </VStack>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
