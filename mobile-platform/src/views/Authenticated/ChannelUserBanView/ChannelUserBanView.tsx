import { gql } from '@apollo/client';
import { StyleSheet, View } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { ChannelLogo } from '@components/ChannelLogo';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChannelViolation, useChannelUserBanViewQueryQuery } from '@gen/graphql';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';

gql`
  query ChannelUserBanViewQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      userBanStatus {
        bannedAt
        violation
        description
        appeal {
          appealText
          status
          reviewerComment
        }
      }
      ...ChannelLogo
    }
  }

  ${ChannelLogo.fragments.channel}
`;

const violationLabel: Record<ChannelViolation, string> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  VIOLATION_SPAM: 'Spam',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  VIOLATION_UNSPECIFIED: 'Unspecified',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  VIOLATION_OTHER: 'Other',
} as const;

export const ChannelUserBanView = ({
  navigation,
  route,
}: AuthenticatedScreenProps<'channelUserBan'>) => {
  const { channelId } = route.params;
  const { data } = useChannelUserBanViewQueryQuery({
    variables: { channelId },
  });

  const channel = data?.channel;

  const navigateHome = () => {
    navigation.navigate('homeTab', { screen: 'home' });
  };

  return (
    <PageLayout>
      <IconAssets.NoiceLogo
        height={24}
        width={32}
      />
      <View style={s.section}>
        <Typography
          fontSize="xl"
          fontWeight="medium"
        >
          You are banned from this channel
        </Typography>
        <Gutter height={24} />
        <Typography color="textSecondary">
          You are unable to view this cahnnel until a moderator unbans you
        </Typography>
      </View>
      <View style={s.section}>
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Channel information
        </Typography>
        <Gutter height={8} />
        <HStack alignItems="center">
          <ChannelLogo
            {...channel}
            size="large"
          />
          <Gutter width={16} />
          <VStack>
            <Typography
              color="textSecondary"
              fontWeight="medium"
            >
              Channel name
            </Typography>
            <Typography
              fontSize="xl"
              fontWeight="extraBold"
            >
              {channel?.name}
            </Typography>
          </VStack>
        </HStack>
      </View>
      {/* */}
      <View style={s.section}>
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Reason for ban
        </Typography>
        <Gutter height={8} />
        <Typography>
          {violationLabel[channel?.userBanStatus.violation ?? 'VIOLATION_UNSPECIFIED']}
        </Typography>
      </View>
      {/*  */}
      <View style={s.section}>
        <Typography
          color="textSecondary"
          fontSize="lg"
          fontWeight="medium"
        >
          Moderator note
        </Typography>
        <Gutter height={8} />
        <Typography>{channel?.userBanStatus.description}</Typography>
      </View>
      <Gutter height={24} />
      <ButtonLarge onPress={navigateHome}>Return home</ButtonLarge>
    </PageLayout>
  );
};

const s = StyleSheet.create({
  section: {
    borderBottomColor: colors.whiteTransparent20,
    borderBottomWidth: 1,
    paddingVertical: 24,
  },
});
