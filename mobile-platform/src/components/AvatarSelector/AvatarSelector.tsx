import { gql } from '@apollo/client';
import { color } from '@noice-com/design-tokens';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, FadeIn, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { DisplayCard } from '@components/DisplayCard';
import { ImageWrapper } from '@components/ImageWrapper';
import { VStack } from '@components/Stack/VStack';
import { borderRadius, colors } from '@constants/styles';
import { AvatarSelectorOptionFragment } from '@gen/graphql';
import { IconAssets } from '@utils/icons';

type Props = {
  avatars: AvatarSelectorOptionFragment[];
  onSelect: (avatar: AvatarSelectorOptionFragment) => void;
  selectedAvatarId?: string;
};

export const AvatarSelector = ({ avatars, selectedAvatarId, onSelect }: Props) => {
  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <DisplayCard>
        <VStack
          spacing={8}
          style={s.container}
        >
          {avatars.map((avatar) => (
            <TouchableOpacity
              activeOpacity={1}
              key={avatar.id}
              style={[
                s.imageContainer,
                selectedAvatarId === avatar.id && s.selectedImageContainer,
              ]}
              onPress={() => onSelect(avatar)}
            >
              {selectedAvatarId === avatar.id && (
                <LinearGradient
                  colors={[colors.tealMain, colors.whiteTransparent05]}
                  end={{ x: 0, y: 1 }}
                  start={{ x: 0, y: 0 }}
                  style={s.selectedGradient}
                />
              )}

              <ImageWrapper
                imageContainerStyle={s.avatarImageContainer}
                resizeMode="cover"
                source={{ uri: avatar.body }}
                style={s.avatarImage}
              />

              {selectedAvatarId === avatar.id && (
                <Animated.View
                  entering={ZoomIn.duration(200).easing(Easing.elastic(1))}
                  exiting={ZoomOut.duration(100)}
                  style={s.checkmark}
                >
                  <IconAssets.CheckThin
                    color={color.whiteMain}
                    height={20}
                    width={20}
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
          ))}
        </VStack>
      </DisplayCard>
    </Animated.View>
  );
};

AvatarSelector.fragments = {
  avatar: gql`
    fragment AvatarSelectorOption on AvatarAvatar {
      id
      gender
      face
      body
      avatar3D
      avatarLods
      selectable
    }
  `,
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedImageContainer: {
    borderWidth: 3,
    borderColor: colors.tealMain,
    backgroundColor: undefined,
  },
  imageContainer: {
    padding: 16,
    backgroundColor: colors.blackTransparent05,
    borderWidth: 3,
    borderColor: colors.transparent,
    borderRadius: borderRadius.radiusMd,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  avatarImage: {
    position: 'absolute',
    top: 0,
    height: '200%',
    width: '100%',
  },
  avatarImageContainer: {
    width: '100%',
    height: '100%',
  },
  selectedGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    borderRadius: 999,
    top: 16,
    width: 32,
    height: 32,
    backgroundColor: colors.tealMain,
  },
});
