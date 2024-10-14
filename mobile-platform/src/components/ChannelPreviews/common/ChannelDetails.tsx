import { gql } from '@apollo/client';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ChannelLogo } from '@components/ChannelLogo';
import { LoadingView } from '@components/LoadingView';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { ChannelDetailsFragment, ChannelLiveStatus } from '@gen/graphql';

interface Props {
  title: string;
  matureRatedContent: boolean;
  channel: ChannelDetailsFragment;
  children: React.ReactNode;
  onTitlePress?: () => void;
  onAvatarPress?: () => void;
}

// @todo should prob rename this to StreamDetails
export function ChannelDetails({
  title,
  channel,
  children,
  matureRatedContent,
  onTitlePress,
  onAvatarPress,
}: Props) {
  return (
    <HStack
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={12}
    >
      <ChannelLogo
        {...channel}
        isOnline={channel.liveStatus === ChannelLiveStatus.LiveStatusLive}
        onPress={onAvatarPress}
      />
      <VStack
        alignItems="stretch"
        justifyContent="flex-start"
        spacing={4}
        style={s.textColumn}
      >
        <Typography
          color="textLight"
          fontSize="lg"
          fontWeight="semiBold"
          lineHeight="lg"
          onPress={onTitlePress}
        >
          {title}
        </Typography>
        <HStack
          alignItems="baseline"
          justifyContent="flex-start"
          spacing={8}
        >
          {children}
        </HStack>
        <HStack spacing={4}>
          {matureRatedContent && (
            <View style={s.ageRating}>
              <Typography
                color="white"
                fontSize="xs"
                fontWeight="medium"
              >
                Mature
              </Typography>
            </View>
          )}
        </HStack>
      </VStack>
    </HStack>
  );
}

ChannelDetails.Loading = () => (
  <HStack
    alignItems="flex-start"
    justifyContent="flex-start"
    spacing={12}
  >
    <LoadingView style={s.loadingLogo} />
    <VStack
      alignItems="stretch"
      justifyContent="flex-start"
      spacing={4}
      style={s.textColumn}
    >
      <LoadingView style={s.loadingLabel} />
      <HStack
        alignItems="baseline"
        justifyContent="flex-start"
        spacing={8}
      >
        <LoadingView style={s.loadingSubLabel} />
      </HStack>
    </VStack>
  </HStack>
);

ChannelDetails.fragments = {
  channel: gql`
    fragment ChannelDetails on ChannelChannel {
      matureRatedContent
      liveStatus
      ...ChannelLogo
    }
    ${ChannelLogo.fragments.channel}
  `,
};

const s = StyleSheet.create({
  textColumn: {
    flex: 1,
  },
  loadingLogo: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  loadingLabel: {
    height: 20,
    width: 120,
  },
  loadingSubLabel: {
    height: 16,
    width: 80,
  },
  ageRating: {
    marginTop: 8,
    backgroundColor: colors.whiteTransparent10,
    borderRadius: borderRadius.radiusSm,
    height: 24,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
