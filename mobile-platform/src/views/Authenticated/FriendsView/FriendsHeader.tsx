import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ButtonLarge } from '@components/ButtonLarge';
import { Divider } from '@components/Divider';
import { EmptyState } from '@components/EmptyState';
import { Gutter } from '@components/Gutter';
import { IconAssets } from '@utils/icons';

interface Props {
  onAddFriend: () => void;
  showEmptyState: boolean;
}

export const FriendsHeader = ({ onAddFriend, showEmptyState }: Props) => {
  return (
    <>
      {/* In case you have not added friends the button is on top */}
      {!showEmptyState && (
        <Animated.View entering={FadeIn}>
          <ButtonLarge
            analyticsActionName="ADD_FRIENDS"
            backgroundColor="white"
            style={s.flex}
            textColor="textDark"
            onPress={onAddFriend}
          >
            Add friends
          </ButtonLarge>
          <Gutter height={24} />
          <Divider color="whiteTransparent10" />
          <Gutter height={24} />
        </Animated.View>
      )}

      {showEmptyState && (
        <EmptyState
          description="Connect with other players and get more out of the Noice experience."
          icon={
            <IconAssets.Friends
              color="white"
              height={48}
              width={48}
            />
          }
          title="Get started with friends"
        />
      )}
    </>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
