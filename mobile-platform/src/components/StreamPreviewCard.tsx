import { gql } from '@apollo/client';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AvatarList } from './AvatarList';
import { StreamViewerCount } from './StreamViewerCount';

import { colors } from '@constants/styles';
import { StreamPreviewCardFragment } from '@gen/graphql';
import { StreamInfo } from '@views/Authenticated/StreamView/StreamInfo/StreamInfo';
import { StreamPlayer } from '@views/Authenticated/StreamView/StreamPlayer/StreamPlayer';

interface Props {
  channel: StreamPreviewCardFragment;
  onPress: () => void;
}

export const StreamPreviewCard = ({ channel, onPress }: Props) => {
  const profiles = channel.channelFriends?.users.map((u) => u.profile);

  const handlePress = () => {
    onPress();
  };

  return (
    <View style={s.streamBanner}>
      <StreamPlayer
        channelData={channel}
        streamId={channel.currentStreamId}
      />

      {!isNaN(channel?.viewerCount) && channel.viewerCount > 0 && (
        <StreamViewerCount
          style={s.viewerCount}
          viewerCount={channel.viewerCount}
        />
      )}

      {!!profiles.length && (
        <AvatarList
          avatars={profiles}
          maxShown={3}
          style={s.avatarList}
        />
      )}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={handlePress}
      />
    </View>
  );
};

StreamPreviewCard.fragments = {
  entry: gql`
    fragment StreamPreviewCard on ChannelChannel {
      currentStreamId
      viewerCount
      channelFriends {
        users {
          userId
          profile {
            ...AvatarView
          }
        }
      }
      ...StreamInfoChannel
    }

    ${AvatarList.fragments.profile}
    ${StreamInfo.fragments.channel}
  `,
};

const s = StyleSheet.create({
  streamBanner: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.blackMain,
  },
  avatarList: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  viewerCount: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
});
