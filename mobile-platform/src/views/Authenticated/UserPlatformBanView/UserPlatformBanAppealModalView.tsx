import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { useCreatePlatformBanAppealMutation } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation CreatePlatformBanAppeal($userId: ID!, $appealText: String!) {
    createPlatformBanAppeal(userId: $userId, appealText: $appealText) {
      emptyTypeWorkaround
    }
  }
`;

export const UserPlatformBanAppealModalView = () => {
  const { userId } = useAuth();
  const [createPlatfromMutation] = useCreatePlatformBanAppealMutation({});
  const [appeal, setAppeal] = useState('');
  const navigation = useNavigation();

  const sendAppeal = async () => {
    if (!userId?.length || !appeal.length) {
      return;
    }

    await createPlatfromMutation({
      variables: {
        userId,
        appealText: appeal,
      },
    });

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <FormSheetModalLayout
      headerAction={{
        enabled: !!appeal?.length,
        onPress: sendAppeal,
        title: 'Send',
      }}
      topGutter={12}
    >
      <Typography
        fontSize="lg"
        fontWeight="medium"
      >
        Your appeal
      </Typography>
      <Gutter height={8} />
      <Typography color="redMain">You may only appeal this decision once</Typography>
      <Gutter height={24} />
      <InputField
        placeholder="Your appeal"
        style={s.input}
        value={appeal}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChangeText={setAppeal}
      />
      <Gutter height={24} />
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  input: {
    backgroundColor: colors.whiteTransparent10,
  },
});
