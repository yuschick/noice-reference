import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HStack } from '@components/Stack/HStack';
import { colors } from '@constants/styles';
import { MainScreenNavigatorParams, UnAuthenticatedParams } from '@navigators/routes';
import { IconAssets } from '@utils/icons';

const MIN_INSET_TOP_PADDING = 16;

interface StackHeaderProps extends NativeStackHeaderProps {
  navigateBackTo?: keyof UnAuthenticatedParams & keyof MainScreenNavigatorParams;
}

export const StackHeader = ({
  navigateBackTo,
  navigation,
  options: { headerLeft },
}: StackHeaderProps) => {
  const { top } = useSafeAreaInsets();

  const goBack = () => {
    if (navigateBackTo) {
      navigation.navigate(navigateBackTo);
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={{ paddingTop: Math.max(top, MIN_INSET_TOP_PADDING) }}>
      <HStack
        justifyContent="space-between"
        style={s.container}
      >
        {headerLeft ? (
          headerLeft({ canGoBack: true })
        ) : (
          <TouchableOpacity
            accessibilityHint="Navigates to the previous screen"
            accessibilityLabel="Go back"
            hitSlop={16}
            onPress={goBack}
          >
            <IconAssets.ChevronLeft
              color={colors.white}
              height={20}
              width={20}
            />
          </TouchableOpacity>
        )}
      </HStack>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
