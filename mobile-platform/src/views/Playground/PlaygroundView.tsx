/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers, Validators } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { create } from 'zustand';

import { Avatar } from '@components/Avatar';
import { ButtonLarge } from '@components/ButtonLarge';
import { ChannelLogo } from '@components/ChannelLogo';
import { OfflineChannelPreview, OnlineChannelPreview } from '@components/ChannelPreviews';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { DefaultModal } from '@components/Modal/DefaultModal';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChannelLiveStatus, useTestChannelQueryQuery } from '@gen/graphql';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';
import { StreamChatInputBar } from '@views/Authenticated/StreamView/StreamChat/StreamChatInputBar';

type NoiceStore = {
  noices: number;
  addNoice: () => void;
};

const useNoiceStore = create<NoiceStore>((set) => ({
  noices: 0,
  addNoice: () => set((state) => ({ noices: state.noices + 1 })),
}));

const { log, logWarn } = makeLoggers('test-view');

gql`
  query TestChannelQuery {
    channels {
      channels {
        id
        name
      }
    }
  }
`;

export function PlaygroundView({ navigation }: AuthenticatedScreenProps<'playground'>) {
  const scrollY = useSharedValue(0);
  const [showModal, setShowModal] = useState(false);
  const client = useClient();
  const { noices, addNoice } = useNoiceStore();
  const { data, error, loading } = useTestChannelQueryQuery();

  log('what is data ', data, loading, error);

  useEffect(() => {
    log(`Oi do we have a client?`, !!client);
  }, [client]);

  const testName = 'Bob🎉';
  const [isValid, errorReason] = Validators.isValidName(testName);

  const [message, setMessage] = useState<string>();

  return (
    <PageLayout>
      <Typography
        fontSize="xxl"
        fontWeight="bold"
        style={styles.title}
      >
        Component Playground
      </Typography>
      <Typography
        fontSize="md"
        style={styles.paragraph}
      >
        Hi and welcome there should be a very large console log going on AND I am gonna do
        some magic using a util imported from another workspace package how exciting!
      </Typography>
      <Typography fontSize="md">
        Is &quot;{testName}&quot; a valid username?{' '}
        {isValid ? 'Yes!' : `No! Reason: ${errorReason}`}
      </Typography>
      {/* Emoji input field */}
      <Gutter height={32} />

      <View style={{ width: '100%', minHeight: 48, backgroundColor: 'blue' }}>
        <StreamChatInputBar
          message={message}
          onCancelModeratedMessage={() => {}}
          onMessageChange={setMessage}
          onSend={() => {}}
        />
      </View>

      <Gutter height={32} />
      <InputField placeholder="Email Adress" />
      <Gutter height={12} />
      <InputField
        placeholder="Birthday wish"
        hasError
      />
      <Gutter height={12} />
      <ButtonLarge
        iconElement={
          <IconAssets.Heart
            color={colors.white}
            height={24}
            width={24}
          />
        }
        onPress={() => {
          navigation.navigate('testAdView');
        }}
      >
        Open ads view
      </ButtonLarge>
      <Gutter height={12} />
      <ButtonLarge
        iconElement={
          <IconAssets.Heart
            color={colors.white}
            height={24}
            width={24}
          />
        }
        onPress={() => {
          setShowModal(true);
        }}
      >
        Show default modal
      </ButtonLarge>
      <DefaultModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <Typography
          fontSize="xxl"
          fontWeight="extraBold"
        >
          Test modal
        </Typography>
        <Gutter height={12} />
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tempor libero ut
          sem molestie, ac lobortis purus consequat. Sed molestie hendrerit massa, sed
          placerat nulla convallis ac. Aliquam luctus metus vitae faucibus fermentum.
          Maecenas vitae sem quis lectus tincidunt ornare sit amet eget ex. Mauris justo
          dui, ornare sed rhoncus a,
        </Typography>
      </DefaultModal>
      <Gutter height={12} />
      <ButtonLarge
        onPress={() => {
          const err = new Error('Whoopise daisie error. ');
          InstrumentationAnalytics.captureException(err);
          throw err;
        }}
      >
        Send test error
      </ButtonLarge>
      <Gutter height={12} />

      <ButtonLarge
        backgroundColor={['green500', 'teal500']}
        textColor="darkMain"
      >
        Continue
      </ButtonLarge>

      <Gutter height={12} />
      <ButtonLarge
        upperCase={false}
        disabled
      >
        Disabled
      </ButtonLarge>
      <Gutter height={12} />
      <ButtonLarge
        backgroundColor={['green200', 'blue200']}
        textColor="black"
      >
        Gradient
      </ButtonLarge>
      <Gutter height={12} />
      <ButtonLarge.List>
        <ButtonLarge>Button 1</ButtonLarge>
        <ButtonLarge>Button 2</ButtonLarge>
        <ButtonLarge>Button 3</ButtonLarge>
      </ButtonLarge.List>
      <Gutter height={24} />
      <HStack
        justifyContent="center"
        spacing={24}
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <View style={{ width: 24, height: 24, backgroundColor: 'blue' }} />
        <View style={{ width: 24, height: 24, backgroundColor: 'red' }} />
        <View style={{ width: 24, height: 24, backgroundColor: 'yellow' }} />
      </HStack>
      <Gutter height={24} />
      <VStack
        alignItems="center"
        spacing={24}
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <View style={{ width: 24, height: 24, backgroundColor: 'blue' }} />
        <View style={{ width: 24, height: 24, backgroundColor: 'red' }} />
        <View style={{ width: 24, height: 24, backgroundColor: 'yellow' }} />
      </VStack>
      <TouchableOpacity
        onPress={() => {
          navigation.push('stream', { streamId: '39981', channelId: '1' });
        }}
      >
        <Typography color="blue200">Open stream page</Typography>
      </TouchableOpacity>
      <Gutter height={64} />
      <Typography>NOICE COUNT {noices}</Typography>
      <TouchableOpacity
        onPress={() => {
          addNoice();
        }}
      >
        <Typography color="blue200">Make some noice!!</Typography>
      </TouchableOpacity>
      {data?.channels?.channels.map((c) => (
        <View key={c.id}>
          <Typography color="white">{c.name}</Typography>
        </View>
      ))}
      <InputField placeholder="Birthday wish" />
      <Gutter height={12} />
      <InputField placeholder="Birthday wish" />
      <HStack
        justifyContent="center"
        spacing={16}
        style={{ marginVertical: 24 }}
      >
        <Avatar
          profile={{
            userId: '1',
            userTag: 'Bob',
            avatars: {
              avatar2D: 'https://placedog.net/80?r',
              avatarFullbody: 'https://placedog.net/80?r',
            },
          }}
          isOnline
        />
        <Avatar
          profile={{
            userId: '1',
            userTag: 'Glob',
            avatars: {
              avatar2D: 'https://placedog.net/80?r',
              avatarFullbody: 'https://placedog.net/80?r',
            },
          }}
        />
        <Avatar
          profile={{
            userId: '1',
            userTag: 'Glob',
            avatars: {
              avatar2D: 'https://placedog.net/80?r',
              avatarFullbody: 'https://placedog.net/80?r',
            },
          }}
          isOnline
          onPress={() => {}}
        />
      </HStack>
      <HStack
        justifyContent="center"
        spacing={16}
        style={{ marginVertical: 24 }}
      >
        <ChannelLogo
          logo="https://placedog.net/80?r"
          name="Channel 1"
          isOnline
          onPress={() => logWarn('pressed logo')}
        />
        <ChannelLogo
          logo="https://placedog.net/80?r"
          name="Channel 2"
        />
      </HStack>
      <OnlineChannelPreview
        channel={{
          id: '1',
          matureRatedContent: false,
          following: true,

          title: 'New Summer Update is Here! Good vibes only!',
          thumbnail: 'https://placedog.net/800?r',
          currentStreamId: '39991',
          liveStatus: ChannelLiveStatus.LiveStatusLive,
          viewerCount: 9999,
          logo: 'https://placedog.net/80?r',
          name: 'Jenix',
          channelFriends: {
            users: [
              {
                userId: '1',
                profile: {
                  userId: '1',
                  userTag: 'bob',
                  avatars: {
                    avatar2D: 'https://placedog.net/80?r',
                    avatarFullbody: 'https://placedog.net/80?r',
                  },
                },
              },
              {
                userId: '2',
                profile: {
                  userId: '2',
                  userTag: 'bob2',
                  avatars: {
                    avatar2D: 'https://placedog.net/80?r',
                    avatarFullbody: 'https://placedog.net/80?r',
                  },
                },
              },
              {
                userId: '3',
                profile: {
                  userId: '3',
                  userTag: 'bob3',
                  avatars: {
                    avatar2D: 'https://placedog.net/80?r',
                    avatarFullbody: 'https://placedog.net/80?r',
                  },
                },
              },
              {
                userId: '4',
                profile: {
                  userId: '4',
                  userTag: 'bob4',
                  avatars: {
                    avatar2D: 'https://placedog.net/80?r',
                    avatarFullbody: 'https://placedog.net/80?r',
                  },
                },
              },
            ],
          },
          game: {
            id: 'fortnite',
            name: 'Fortnite',
          },
        }}
        index={1}
        scrollY={scrollY}
      />
      <Gutter height={24} />
      <OfflineChannelPreview.Loading />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 16,
  },
});
