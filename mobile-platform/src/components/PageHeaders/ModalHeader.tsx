import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';

const MIN_INSET_TOP_PADDING = 16;

export const ModalHeader = ({ navigation }: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <HStack
      justifyContent="space-between"
      style={[s.container, { paddingTop: Math.max(insets.top, MIN_INSET_TOP_PADDING) }]}
    >
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Typography>Close</Typography>
      </TouchableOpacity>
    </HStack>
  );
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
