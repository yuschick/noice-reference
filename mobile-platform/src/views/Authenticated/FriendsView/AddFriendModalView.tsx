import { gql } from '@apollo/client';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { useAddFriendModalViewLazyQuery } from '@gen/graphql';
import { useSendFriendRequestMutation } from '@hooks/social';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query AddFriendModalView($userTag: String!) {
    resolveUserTags(userTags: [$userTag]) {
      userIds {
        key
        value
      }
    }
  }
`;

export const AddFriendModalView = ({
  navigation,
}: AuthenticatedScreenProps<'addFriendModal'>) => {
  const { userId } = useAuth();
  const [userTag, setUserTag] = useState('');
  const [error, setError] = useState<string>();
  const [mutateAddFriend] = useSendFriendRequestMutation({});
  const [getQuery] = useAddFriendModalViewLazyQuery();

  const onAddFriend = async () => {
    const trimmedTag = userTag.trim();
    const { data, error: err } = await getQuery({
      variables: {
        userTag: trimmedTag,
      },
    });

    if (err || !data?.resolveUserTags?.userIds.length) {
      setError('User does not exist');
    }

    const friendId = data?.resolveUserTags?.userIds[0].value;

    try {
      if (userId && friendId) {
        await mutateAddFriend({
          variables: {
            userId: userId,
            friendId: friendId,
          },
        });

        setError(undefined);

        navigation.pop();
      }
    } catch (e) {
      setError('Failed to send friend request');
    }
  };

  const enabled = userTag.length > 0;

  return (
    <FormSheetModalLayout topGutter={12}>
      <Gutter height={24} />
      <Typography
        fontSize="xl"
        fontWeight="semiBold"
      >
        Add your friend on Noice
      </Typography>
      <Gutter height={8} />
      <Typography color="textSecondary">
        You can add a friend with their Noice username
      </Typography>
      <Gutter height={24} />
      <InputField
        autoCapitalize="none"
        hasError={!!error}
        placeholder="Enter a Username"
        style={s.inputWrapper}
        value={userTag}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChangeText={(text) => setUserTag(text)}
      />
      <Gutter height={8} />
      {!!error && <Typography color="redMain">{error}</Typography>}
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="SEND_FRIEND_REQUEST"
        disabled={!enabled}
        onPress={onAddFriend}
      >
        Send Friend Request
      </ButtonLarge>
      <Gutter height={24} />
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  inputWrapper: {
    backgroundColor: colors.gray750,
  },
});
