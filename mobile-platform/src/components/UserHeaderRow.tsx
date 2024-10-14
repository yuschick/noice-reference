import { gql } from '@apollo/client';
import { StyleSheet } from 'react-native';

import { Avatar } from './Avatar';
import { HStack } from './Stack/HStack';
import { VStack } from './Stack/VStack';
import { Typography } from './Typography';

import { ProfilePresenceStatus, UserHeaderRowFragment } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

interface Props {
  profile?: UserHeaderRowFragment | null;
}

export const UserHeaderRow = ({ profile }: Props) => {
  const { userId: authUserId } = useAuth();

  const isOwnProfile = profile?.userId === authUserId;

  return (
    <HStack
      alignItems="center"
      spacing={16}
    >
      {!!profile && (
        <Avatar
          isOnline={profile?.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline}
          isOwnProfile={isOwnProfile}
          profile={profile}
          size="large"
        />
      )}
      <VStack style={s.flex}>
        <Typography
          fontSize="xxl"
          fontWeight="bold"
          numberOfLines={1}
        >
          {profile?.userTag}
        </Typography>
      </VStack>
    </HStack>
  );
};

UserHeaderRow.fragment = gql`
  fragment UserHeaderRow on ProfileProfile {
    userId
    userTag
    onlineStatus
    ...AvatarView
  }

  ${Avatar.fragments.profile}
`;

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
