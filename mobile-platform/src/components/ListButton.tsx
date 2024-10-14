import { StyleSheet, TouchableOpacity } from 'react-native';

import { Typography } from './Typography';

import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';

type Props = {
  onPress: () => void;
  label?: string;
};

export const ListButton = ({ onPress, label }: Props) => {
  return (
    <TouchableOpacity
      style={s.container}
      onPress={onPress}
    >
      <Typography>{label}</Typography>
      <IconAssets.ChevronRight
        color={colors.white}
        height={20}
        style={s.icon}
        width={20}
      />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 0,
  },
});
