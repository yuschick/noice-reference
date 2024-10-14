import { DimensionValue, StyleSheet, View } from 'react-native';

import { colors } from '@constants/styles';

type RankProgressionBarProps = {
  max: number;
  min?: number;
  progress: number;
};

export const RankProgressionBar = ({ max, progress }: RankProgressionBarProps) => {
  const barWidth: DimensionValue = `${(progress / max) * 100}%`;

  return (
    <View style={s.progress}>
      <View style={[s.progressFill, { width: barWidth }]} />
    </View>
  );
};

const s = StyleSheet.create({
  progress: {
    backgroundColor: colors.blue700,
    borderRadius: 4,
    height: 8,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.tealMain,
    height: '100%',
  },
});
