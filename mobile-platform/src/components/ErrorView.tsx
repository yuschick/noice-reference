import { StyleSheet } from 'react-native';

import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

interface Props {
  message?: string;
}

const DEFAULT_MESSAGE = 'Oops, something went wrong!';

export const ErrorView = ({ message = DEFAULT_MESSAGE }: Props) => {
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      style={s.flex}
    >
      <Typography
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
      >
        {message}
      </Typography>
    </VStack>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
