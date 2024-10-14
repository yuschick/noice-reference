import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useCallback } from 'react';
import { ListRenderItem, RefreshControl, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Avatar } from '@components/Avatar';
import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { Header, HeaderGutter, useHeaderValues } from '@components/List/Header';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { UserBlockedViewQuery, useUserBlockedViewQuery } from '@gen/graphql';
import { useFriendship } from '@hooks/social/useHandleFriendship.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { useUserRefresh } from '@hooks/useUserRefresh.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query UserBlockedView($userId: ID!) {
    blockedUsers(userId: $userId) {
      users {
        userId
        profile {
          userTag
          ...AvatarView
        }
        lastStatusChange
      }
    }
  }

  ${Avatar.fragments.profile}
`;

type UsersArray = NonNullable<UserBlockedViewQuery['blockedUsers']>['users'];
type User = UsersArray extends (infer U)[] ? U : never;

export const UserBlockedView = ({
  navigation,
}: AuthenticatedScreenProps<'userBlocked'>) => {
  const { userId } = useAuth();
  const { handleUnblockingUser } = useFriendship();
  const { scrollY, scrollHandler } = useHeaderValues();

  const { data: { blockedUsers } = {}, refetch } = useUserBlockedViewQuery({
    ...variablesOrSkip({ userId }),
  });

  const { isUserRefresh, refresh } = useUserRefresh(refetch);

  const unblockUser = useCallback(
    (blockedUserId: string) => {
      handleUnblockingUser(blockedUserId);
    },
    [handleUnblockingUser],
  );

  const renderItem: ListRenderItem<User> = ({ item }) => (
    <VStack
      key={item.userId}
      style={s.card}
    >
      <HStack alignItems="center">
        <Avatar
          profile={item.profile}
          size="default"
          isOwnProfile
        />
        <Gutter width={16} />
        <VStack>
          <Typography
            fontSize="md"
            fontWeight="medium"
          >
            {item.profile.userTag}
          </Typography>
        </VStack>
      </HStack>
      <Gutter height={8} />
      <Typography color="textLightSecondary">
        Blocked since{' '}
        <Typography>{new Date(item.lastStatusChange).toLocaleDateString()}</Typography>
      </Typography>
      <Gutter height={8} />
      <ButtonLarge
        analyticsActionName="UNBLOCK_USER"
        backgroundColor="whiteTransparent10"
        onPress={() => unblockUser(item.userId)}
      >
        Unblock
      </ButtonLarge>
      <Gutter height={12} />
    </VStack>
  );

  return (
    <PageLayout.Simple>
      <Animated.FlatList
        ListEmptyComponent={<Typography textAlign="center">No blocked users</Typography>}
        ListHeaderComponent={
          <>
            <HeaderGutter />
            <Gutter height={24} />
          </>
        }
        contentContainerStyle={s.list}
        data={blockedUsers?.users}
        keyExtractor={(item) => item.userId}
        refreshControl={
          <RefreshControl
            refreshing={isUserRefresh}
            onRefresh={refresh}
          />
        }
        renderItem={renderItem}
        onScroll={scrollHandler}
      />
      <Header
        scrollY={scrollY}
        title="Blocked users"
        onHeaderLeftPress={navigation.goBack}
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.violet700,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.radiusSm,
  },
});
