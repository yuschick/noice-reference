import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Avatar } from '@components/Avatar';
import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ModerationAppealStatus, useUserPlatformBanViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { UserBannedNavigatorScreenProps } from '@navigators/routes';
import { getPlatformViolationText } from '@utils/graphql-enums';
import { NoiceLogo } from '@utils/icons/registry';

gql`
  query UserPlatformBanView($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...AvatarView
    }
    platformBan(userId: $userId) {
      banId
      status
      violation
      description
      bannedAt
      expiresAt
      appeal {
        banId
        status
        appealText
      }
    }
  }
  ${Avatar.fragments.profile}
`;

export const UserPlatformBanView = ({
  navigation,
}: UserBannedNavigatorScreenProps<'userPlatformBan'>) => {
  const { userId } = useAuth();
  const client = useClient();

  const { data, refetch, loading } = useUserPlatformBanViewQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'network-only',
  });

  useMountEffect(() => {
    const unsubBeforeRemove = navigation.addListener('beforeRemove', (e) => {
      // Maybe not needed but just incase prevent user from
      // navigating back from this page
      e.preventDefault();
    });

    const unsubOnFocus = navigation.addListener('focus', () => {
      refetch();
    });

    return () => {
      unsubBeforeRemove();
      unsubOnFocus();
    };
  });

  const requestAppeal = () => {
    navigation.navigate('userPlatformBanAppealModal');
  };

  const logout = () => {
    client.clearSession();
  };

  const expiresAtStr = useMemo(() => {
    if (!data?.platformBan?.expiresAt) {
      return;
    }

    const d = new Date(data.platformBan.expiresAt);

    return DateTime.fromJSDate(d).toLocaleString(DateTime.DATETIME_MED);
  }, [data]);

  if (loading) {
    return null;
  }

  return (
    <PageLayout withHeader={false}>
      <NoiceLogo
        height={42}
        width={42}
      />

      {/* Title section */}
      <VStack
        spacing={24}
        style={s.section}
      >
        <Typography
          fontSize="xl"
          fontWeight="medium"
        >
          {expiresAtStr
            ? `Your account has been suspended until ${expiresAtStr}`
            : 'Your account has been suspended indefinitely'}
        </Typography>
        <Typography
          color="textSecondary"
          fontSize="md"
          fontWeight="regular"
          lineHeight="xl"
        >
          You are not permitted to access Noice service via this or any other accounts as
          long as this suspension is in effect.
        </Typography>
      </VStack>

      {/* Account information */}
      <VStack
        spacing={8}
        style={s.section}
      >
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Account information
        </Typography>
        <HStack
          alignItems="center"
          spacing={16}
        >
          {data?.profile && (
            <Avatar
              profile={data.profile}
              size="xLarge"
            />
          )}
          <Typography
            fontSize="xl"
            fontWeight="extraBold"
            style={s.flex}
          >
            {data?.profile?.userTag}
          </Typography>
        </HStack>
      </VStack>

      {/* Reason for suspension */}
      <VStack
        spacing={8}
        style={s.section}
      >
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Reason for suspension
        </Typography>
        {!!data?.platformBan?.violation && (
          <Typography>{getPlatformViolationText(data.platformBan.violation)}</Typography>
        )}
      </VStack>

      {/* Moderation note section */}
      <VStack
        spacing={8}
        style={s.section}
      >
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Moderation note
        </Typography>
        <Typography>{data?.platformBan?.description}</Typography>
      </VStack>

      {/* Appeal section */}
      <VStack
        spacing={8}
        style={s.section}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            color="textSecondary"
            fontSize="lg"
            fontWeight="medium"
          >
            {data?.platformBan?.appeal?.status ===
            ModerationAppealStatus.AppealStatusUnspecified
              ? 'Appeal'
              : 'Your appeal'}
          </Typography>
          {data?.platformBan?.appeal?.status ===
            ModerationAppealStatus.AppealStatusPending && (
            <Typography color="yellowGreen300">In review</Typography>
          )}
          {data?.platformBan?.appeal?.status ===
            ModerationAppealStatus.AppealStatusDeclined && (
            <Typography color="redMain">Declined</Typography>
          )}
        </HStack>
        {data?.platformBan?.appeal?.status !==
          ModerationAppealStatus.AppealStatusPending && (
          <Typography lineHeight="xl">
            If you belive this is an error. Please tell us why we should reverse this
            suspension
          </Typography>
        )}
        {!data?.platformBan?.appeal?.status ||
        data?.platformBan?.appeal?.status ===
          ModerationAppealStatus.AppealStatusUnspecified ? (
          <ButtonLarge
            analyticsActionName="REQUEST_APPEAL"
            rounded={false}
            onPress={requestAppeal}
          >
            Request appeal
          </ButtonLarge>
        ) : (
          <>
            <Typography>{data?.platformBan?.appeal?.appealText}</Typography>
          </>
        )}
      </VStack>
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="LOGOUT"
        onPress={logout}
      >
        Logout
      </ButtonLarge>
      <Gutter height={24} />
    </PageLayout>
  );
};

const s = StyleSheet.create({
  section: {
    paddingVertical: 24,
    borderBottomColor: colors.whiteTransparent20,
    borderBottomWidth: 1,
  },
  flex: {
    flex: 1,
  },
});
