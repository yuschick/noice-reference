import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ErrorFallbackProps } from '@components/ErrorBoundary';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { Analytics } from '@lib/Analytics';
import { Haptic } from '@utils/haptic';

export function FatalErrorView({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <PageLayout.Simple>
      <SafeAreaView>
        <ScrollView style={s.container}>
          <Typography
            fontSize="xxl"
            fontWeight="semiBold"
          >
            Sorry, there was an error with the app:
          </Typography>
          <Gutter height={16} />
          <Typography>Please try resetting the app</Typography>
          <Gutter height={16} />
          {<Typography>{JSON.stringify(error, undefined, 2)}</Typography>}
          <Gutter height={32} />
          <FatalErrorViewButton resetErrorBoundary={resetErrorBoundary} />
        </ScrollView>
      </SafeAreaView>
    </PageLayout.Simple>
  );
}

// Identical in styling to LargeButton but without dependencies to useRoute
const FatalErrorViewButton = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  const onPressOut = () => {
    Analytics.trackEvent({
      clientButtonClick: {
        action: 'FATAL_ERROR_RESET_APP',
        pathname: 'FatalErrorView',
      },
    });

    Haptic.impactLight();
    resetErrorBoundary();
  };

  return (
    <TouchableOpacity
      style={s.buttonContainer}
      onPress={resetErrorBoundary}
      onPressOut={onPressOut}
    >
      <Typography
        color="white"
        fontSize="md"
        fontWeight="medium"
        lineHeight="lg"
        numberOfLines={1}
        textAlign="center"
        uppercase
      >
        Reset app
      </Typography>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
  },
  buttonContainer: {
    backgroundColor: colors.whiteTransparent10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.radiusSm,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
