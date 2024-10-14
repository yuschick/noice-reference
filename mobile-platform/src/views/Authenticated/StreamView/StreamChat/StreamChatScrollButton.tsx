import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';

interface Props {
  onPress?: () => void;
}

export const StreamChatScrollButton = ({ onPress }: Props) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={s.buttonContainer}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={s.button}
        onPress={onPress}
      >
        <Typography
          color="black"
          fontSize="md"
          fontWeight="medium"
          lineHeight="lg"
          numberOfLines={1}
          uppercase
        >
          Newer messages
        </Typography>
        <IconAssets.ArrowDown
          color="black"
          height={24}
          width={24}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 4,
    left: 16,
    right: 16,
    backgroundColor: colors.whiteMain,
    borderRadius: 999,
  },
  button: {
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
