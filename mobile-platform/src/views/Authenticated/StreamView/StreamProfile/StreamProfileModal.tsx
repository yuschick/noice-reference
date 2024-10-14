import { gql } from '@apollo/client';
import { Fragment } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { Avatar } from '@components/Avatar';
import { ButtonLarge } from '@components/ButtonLarge';
import { Divider } from '@components/Divider';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { colors } from '@constants/styles';
import {
  FriendsFriendshipStatusStatus,
  ProfilePresenceStatus,
  useStreamProfileModalViewQuery,
} from '@gen/graphql';
import { useFriendship } from '@hooks/social/useHandleFriendship.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { ReportType, UserRole } from '@views/Authenticated/ReportFlow/report-reasons';

gql`
  query StreamProfileModalView($userId: ID!, $channelId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      onlineStatus
      discordUsername
      badges(channel_id: $channelId) {
        ...UserBadge
      }
      friendshipStatus {
        status
      }
      ...AvatarView
    }
    userChannelSubscription(userId: $userId, channelId: $channelId) {
      activatedAt
    }
  }
`;

export const StreamProfileModalView = ({
  route,
  navigation,
}: AuthenticatedScreenProps<'streamProfileModal'>) => {
  const { width } = useWindowDimensions();
  const { userId, channelId, messageId, chatId } = route.params;
  const { data } = useStreamProfileModalViewQuery({
    variables: { userId, channelId },
  });
  const friendshipStatus = data?.profile?.friendshipStatus?.status;
  const {
    handleBlockingUser,
    handleUnblockingUser,
    handleRequestingFriendship,
    handleRemovingSentFriendRequest,
    isBlocked,
    actionLabel,
    isPendingRequest,
  } = useFriendship({
    friendshipStatus,
  });

  const blockUser = () => {
    handleBlockingUser(data?.profile?.userTag ?? '', data?.profile?.userId ?? '');
  };

  const unBlockUser = () => {
    handleUnblockingUser(data?.profile?.userId ?? '');
  };

  const onHandleFriendRequest = () => {
    if (!isPendingRequest) {
      handleRequestingFriendship(data?.profile?.userId ?? '');
    } else {
      handleRemovingSentFriendRequest(data?.profile?.userId ?? '');
    }
  };

  const reportUser = () => {
    navigation.replace('reportFlow', {
      userId,
      reportType: ReportType.ChannelChat,
      userRole: UserRole.User,
      chatMessage: {
        channelId: channelId,
        messageId: messageId,
        chatId: chatId,
      },
    });
  };

  return (
    <FormSheetModalLayout style={s.modal}>
      <HStack
        spacing={16}
        style={{ maxWidth: width - 32 }}
      >
        {!!data?.profile && (
          <Avatar
            isOnline={
              data.profile?.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline
            }
            profile={data?.profile}
            size="xLarge"
          />
        )}
        <VStack
          justifyContent="center"
          style={s.userTagContainer}
        >
          <Typography
            color="textLight"
            fontSize="xl"
            fontWeight="semiBold"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {data?.profile?.userTag}
          </Typography>
          {!!data?.profile?.discordUsername && (
            <Typography
              color="textLightSecondary"
              fontSize="md"
              fontWeight="semiBold"
              numberOfLines={1}
            >
              {data?.profile?.discordUsername}
            </Typography>
          )}
        </VStack>
      </HStack>
      <Gutter height={16} />
      {data?.profile?.badges && data?.profile?.badges.length > 0 && (
        <>
          <Divider />
          <Gutter height={16} />
          <Typography
            fontWeight="bold"
            style={s.badges}
          >
            Badges
          </Typography>
          <HStack spacing={8}>
            {data?.profile?.badges.map((badge) => (
              <Fragment key={`badge-${badge.type}`}>
                <UserBadge
                  badge={badge}
                  size={32}
                />
              </Fragment>
            ))}
          </HStack>
          <Gutter height={16} />
        </>
      )}
      <Divider />
      <Gutter height={16} />
      {friendshipStatus !== FriendsFriendshipStatusStatus.StatusFriend && (
        <>
          <ButtonLarge
            analyticsActionName={
              !isPendingRequest ? 'ADD_FRIEND' : 'CANCEL_FRIEND_REQUEST'
            }
            disabled={isBlocked}
            style={s.button}
            textAlign="left"
            onPress={onHandleFriendRequest}
          >
            {actionLabel}
          </ButtonLarge>
          <Gutter height={24} />
        </>
      )}
      <ButtonLarge.List>
        {isBlocked ? (
          <ButtonLarge
            analyticsActionName="UNBLOCK_USER"
            onPress={unBlockUser}
          >
            Unblock user
          </ButtonLarge>
        ) : (
          <ButtonLarge
            analyticsActionName="BLOCK_USER"
            onPress={blockUser}
          >
            Block user
          </ButtonLarge>
        )}
        <ButtonLarge
          analyticsActionName="REPORT_USER"
          onPress={reportUser}
        >
          Report user
        </ButtonLarge>
      </ButtonLarge.List>
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  modal: { backgroundColor: colors.gray900 },
  badges: {
    marginBottom: 8,
  },
  userTagContainer: {
    flex: 1,
  },
});
