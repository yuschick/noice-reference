import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ProfileActionRow } from './ProfileActionRow';
import { ProfileFriendList } from './ProfileFriendList';
import { ProfileGamesList } from './ProfileGamesList';
import { ProfileStatLabel } from './ProfileStatLabel';

import { Avatar } from '@components/Avatar';
import { ErrorView } from '@components/ErrorView';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { UserHeaderRow } from '@components/UserHeaderRow';
import { colors } from '@constants/styles';
import {
  ProfilePresenceStatus,
  useProfileViewQuery,
  useUserTagQuery,
} from '@gen/graphql';
import { useSendFriendRequestMutation } from '@hooks/social';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';
import { compactNumberFormatter } from '@utils/math';
import { convertDurationToHours } from '@utils/time';

gql`
  fragment ProfileViewFriends on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
    }
    onlineStatus
    ...AvatarView
  }

  query UserTag($userTag: String!) {
    resolveUserTags(userTags: [$userTag]) {
      profiles {
        userId
        visibility
      }
    }
  }

  query ProfileView($userId: ID) {
    profile(userId: $userId) {
      userId
      userTag
      onlineStatus
      friendshipStatus {
        status
      }
      avatars {
        avatar2D
      }
      friends {
        ...ProfileViewFriends
      }
      stats {
        matchesPlayed
        timePlayed
        cardsSucceeded
        dailyGoalCardsCompleted
      }
      ...ProfileGamesList
      ...UserHeaderRow
    }
  }
  ${ProfileGamesList.fragment}
  ${UserHeaderRow.fragment}
`;

export function ProfileView({ route, navigation }: AuthenticatedScreenProps<'profile'>) {
  const client = useClient();
  const { userId: paramUserId, userTag } = route.params;
  const { userId: authUserId } = useAuth();

  const { data: tagData } = useUserTagQuery({
    ...variablesOrSkip({ userTag }),
  });

  // This should be changed so that we check if a user exists at all and then navigate to different view
  const userId = paramUserId || tagData?.resolveUserTags?.profiles?.[0]?.userId || '';

  const { data, error, loading, refetch } = useProfileViewQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'cache-and-network',
  });

  const [mutateSendFriendReq] = useSendFriendRequestMutation({});
  const isOwnProfile = userId === authUserId;
  const profile = data?.profile;

  useMountEffect(() => {
    if (isOwnProfile) {
      return;
    }

    client.NotificationService.notifications({
      onFriendStatusUpdate: () => {
        refetch();
      },
    });
  });

  if (error || (!loading && !profile)) {
    return <ErrorView />;
  }

  if (loading) {
    return <PageLayout />;
  }

  const navigateToUser = (id: string) => {
    navigation.push('profile', {
      userId: id,
    });
  };

  const onMoreActions = () => {
    if (data?.profile) {
      navigation.push('profileActionsModal', {
        profile: data.profile,
      });
    }
  };

  const onAddFriend = async () => {
    if (authUserId) {
      await mutateSendFriendReq({
        variables: {
          userId: authUserId,
          friendId: userId,
        },
      });
    }
  };

  const username = profile?.userTag ?? '';
  const matchesPlayed = compactNumberFormatter(profile?.stats.matchesPlayed ?? 0);
  const cardsSucceeded = compactNumberFormatter(profile?.stats.cardsSucceeded ?? 0);
  const dailyGoalsCompleted = compactNumberFormatter(
    profile?.stats.dailyGoalCardsCompleted ?? 0,
  );
  const timePlayed = convertDurationToHours(profile?.stats.timePlayed) ?? '-';

  return (
    <PageLayout
      headerBottomRowElement={
        <Avatar
          isOnline={profile?.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline}
          profile={data?.profile}
          size="default"
          isOwnProfile
        />
      }
      title={username}
      uppercaseTitle={false}
    >
      <Animated.View entering={FadeIn}>
        <VStack style={s.section}>
          <Gutter height={16} />

          {!isOwnProfile && (
            <>
              <Gutter height={24} />
              <ProfileActionRow
                profile={data}
                onAddFriend={onAddFriend}
                onMore={onMoreActions}
              />
            </>
          )}
          <Gutter height={24} />
        </VStack>
      </Animated.View>

      {/* Friends */}
      {!!profile?.friends.length && (
        <Animated.View entering={FadeInDown}>
          <VStack style={s.section}>
            <Gutter height={24} />
            <HStack alignItems="center">
              <IconAssets.Friends
                color={colors.textSecondary}
                height={24}
                width={24}
              />
              <Gutter width={8} />
              <Typography
                color="textSecondary"
                fontSize="md"
                fontWeight="semiBold"
                uppercase
              >
                Friends
              </Typography>
            </HStack>
            <Gutter height={24} />
            <ProfileFriendList
              friends={profile.friends}
              onPress={navigateToUser}
            />
            <Gutter height={24} />
          </VStack>
        </Animated.View>
      )}

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <VStack style={s.section}>
          <Gutter height={24} />
          <HStack alignItems="center">
            <IconAssets.Stats
              color={colors.textSecondary}
              height={24}
              width={24}
            />
            <Gutter width={8} />
            <Typography
              color="textSecondary"
              fontSize="md"
              fontWeight="semiBold"
              uppercase
            >
              Stats
            </Typography>
          </HStack>
          <Gutter height={24} />
          <HStack justifyContent="space-between">
            <ProfileStatLabel
              title="Matches played"
              value={matchesPlayed}
            />
            <ProfileStatLabel
              title="Hours played"
              value={timePlayed}
            />
          </HStack>
          <Gutter height={8} />
          <HStack justifyContent="space-between">
            <ProfileStatLabel
              title="Cards succeeded"
              value={cardsSucceeded}
            />
            <ProfileStatLabel
              title="Daily goals completed"
              value={dailyGoalsCompleted}
            />
          </HStack>
          <Gutter height={24} />
        </VStack>
      </Animated.View>

      {/* Games */}
      {!!profile?.playedGames.length && (
        <Animated.View entering={FadeInDown.delay(400)}>
          <VStack>
            <Gutter height={24} />
            <HStack alignItems="center">
              <IconAssets.GamePad
                color={colors.textSecondary}
                height={24}
                width={24}
              />
              <Gutter width={8} />
              <Typography
                color="textSecondary"
                fontWeight="semiBold"
                uppercase
              >
                Games
              </Typography>
            </HStack>

            <ProfileGamesList playedGames={profile.playedGames} />
            <Gutter height={24} />
          </VStack>
        </Animated.View>
      )}
    </PageLayout>
  );
}

const s = StyleSheet.create({
  section: {
    borderBottomColor: colors.whiteTransparent20,
    borderBottomWidth: 1,
  },
});
