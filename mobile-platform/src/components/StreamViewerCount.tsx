import { StyleProp, ViewStyle } from 'react-native/types';

import { PillLabel } from './PillLabel';
import { HStack } from './Stack/HStack';

import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';

interface Props {
  viewerCount: number;
  style?: StyleProp<ViewStyle>;
}

export const StreamViewerCount = ({ viewerCount, style }: Props) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      spacing={8}
      style={style}
    >
      <PillLabel
        color={['violetMain', 'magentaMain']}
        label="live"
        uppercase
      />
      <PillLabel
        color="gray900"
        icon={
          <IconAssets.Person
            color={colors.whiteMain}
            height={12}
            width={12}
          />
        }
        label={(viewerCount ?? 0).toString()}
      />
    </HStack>
  );
};
