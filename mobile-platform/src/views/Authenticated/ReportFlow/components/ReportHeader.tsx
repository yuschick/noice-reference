import { gql } from '@apollo/client';
import { StyleSheet } from 'react-native';

import { ReportType } from '../report-reasons';

import { Avatar } from '@components/Avatar';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { useReportedUserQuery } from '@gen/graphql';

gql`
  query ReportedUser($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...AvatarView
    }

   ${Avatar.fragments.profile}
  }
`;

type HeaderProps = {
  userId: string;
  reportType?: ReportType;
};

export const ReportHeader = ({ reportType, userId }: HeaderProps) => {
  const { data } = useReportedUserQuery({
    variables: {
      userId,
    },
  });

  return (
    <>
      <Gutter height={24} />
      <Typography
        fontSize="xxl"
        fontWeight="extraBold"
        uppercase
      >
        {reportType === ReportType.Livestream ? 'Report Stream' : 'Report User'}
      </Typography>
      <Gutter height={24} />

      {reportType === ReportType.ChannelChat && (
        <HStack
          alignItems="center"
          spacing={16}
        >
          {data?.profile && (
            <Avatar
              profile={data?.profile}
              size="large"
            />
          )}
          <VStack style={s.flex}>
            <Typography
              fontSize="xxl"
              fontWeight="bold"
              numberOfLines={1}
            >
              {data?.profile?.userTag}
            </Typography>
          </VStack>
        </HStack>
      )}
    </>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
