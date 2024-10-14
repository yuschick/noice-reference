import { StyleSheet, TouchableOpacity } from 'react-native';

import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { colors } from '@constants/styles';

type Props = {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};
export const TopBarBar = ({ selectedTab, setSelectedTab, tabs }: Props) => {
  return (
    <HStack
      margin={[0, -16]}
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.whiteTransparent20,
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          disabled={selectedTab === tab}
          key={tab}
          style={[s.innerContainer, selectedTab === tab ? s.active : {}]}
          onPress={() => setSelectedTab(tab)}
        >
          <Typography
            fontSize="lg"
            uppercase
          >
            {tab}
          </Typography>
        </TouchableOpacity>
      ))}
    </HStack>
  );
};

const s = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
});
