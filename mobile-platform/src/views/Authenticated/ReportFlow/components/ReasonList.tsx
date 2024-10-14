import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ReasonTree, TreeNode } from '../report-reasons';

import { Gutter } from '@components/Gutter';
import { Radio } from '@components/Radio/Radio';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

type Props = {
  visibleReasonList: ReasonTree<TreeNode[]> | null;
  selectedReasonLabel: string;
  onNodeSelect: (node: TreeNode) => void;
};

export const ReasonList = ({
  visibleReasonList,
  selectedReasonLabel,
  onNodeSelect,
}: Props) => {
  return (
    <View>
      <Typography
        fontSize="md"
        fontWeight="regular"
        lineHeight="lg"
      >
        {visibleReasonList?.label}
      </Typography>
      <Gutter height={24} />
      <VStack
        spacing={1}
        style={s.optionsContainer}
      >
        {visibleReasonList?.nodes.map((node, i) => (
          <TouchableOpacity
            key={`${node.label}-${i}`}
            style={s.option}
            onPress={() => onNodeSelect(node)}
          >
            {/* subtrees don't have nodes but everything has a label so comparison is done using that */}
            <Radio selected={node.label === selectedReasonLabel} />
            <Typography
              fontSize="sm"
              fontWeight="regular"
              lineHeight="lg"
              style={s.flex}
            >
              {node.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </VStack>
    </View>
  );
};

const s = StyleSheet.create({
  optionsContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    padding: 16,
    backgroundColor: colors.violet600,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
