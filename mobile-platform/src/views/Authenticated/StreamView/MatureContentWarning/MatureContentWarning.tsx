import { useNavigation } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

interface Props {
  onHandleStartStream: () => void;
}

export function MatureContentWarning({ onHandleStartStream }: PropsWithChildren<Props>) {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  const handleGoBackPressed = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('home');
  };

  const footer = (
    <VStack
      alignItems="stretch"
      justifyContent="flex-end"
      spacing={16}
      style={styles.footer}
    >
      <Typography
        color="textLightSecondary"
        fontSize="sm"
        fontWeight="regular"
        lineHeight="lg"
        textAlign="center"
      >
        To avoid warning messages when entering a channel, adjust your privacy settings at
        any time.
      </Typography>
      <ButtonLarge
        analyticsActionName="MATURE_CONTENT_START_WATCHING"
        backgroundColor="lightMain"
        textColor="textDark"
        onPress={onHandleStartStream}
      >
        Start watching
      </ButtonLarge>
      <ButtonLarge
        analyticsActionName="MATURE_CONTENT_GO_BACK"
        backgroundColor="whiteTransparent10"
        textColor="textLight"
        onPress={handleGoBackPressed}
      >
        Go back
      </ButtonLarge>
    </VStack>
  );

  return (
    <View style={styles.container}>
      <VStack
        alignItems="center"
        justifyContent="center"
        style={styles.container}
      >
        <VStack
          alignItems="center"
          justifyContent="center"
          spacing={16}
          style={styles.focusText}
        >
          <Typography
            fontSize="xl"
            fontWeight="bold"
            lineHeight="xl"
            textAlign="center"
          >
            This channel is intended for mature audiences
          </Typography>
          <Typography
            fontSize="md"
            fontWeight="regular"
            lineHeight="xl"
            textAlign="center"
          >
            The content may not be appropriate for some users.
          </Typography>
        </VStack>
      </VStack>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue900,
    flex: 1,
    marginLeft: -12,
    marginRight: -12,
  },
  focusText: {
    maxWidth: 358,
    padding: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
