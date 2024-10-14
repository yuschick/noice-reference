import { Linking, StyleSheet, View } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';
import { links } from '@constants/links';
import { borderRadius, colors } from '@constants/styles';
import { AuthenticatedScreenProps } from '@navigators/routes';

export const NewVersionAvailableModal = ({
  navigation,
}: AuthenticatedScreenProps<'newVersionAvailableModal'>) => {
  const onPressUpdate = () => {
    Linking.openURL(links.appStore);
  };

  const onPressDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={s.modalContainer}>
      <View style={s.modal}>
        <Typography
          fontSize="lg"
          fontWeight="extraBold"
          textAlign="center"
        >
          New update available
        </Typography>
        <Gutter height={8} />
        <Typography textAlign="center">
          Please, update Noice app to the latest version.
        </Typography>
        <Gutter height={16} />

        <ButtonLarge
          backgroundColor="white"
          textColor="darkMain"
          onPress={onPressUpdate}
        >
          Update now
        </ButtonLarge>
        <Gutter height={8} />
        <ButtonLarge onPress={onPressDismiss}>Dismiss</ButtonLarge>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 16,
    backgroundColor: colors.gray900,
    margin: 16,
    borderRadius: borderRadius.radiusMd,
  },
});
