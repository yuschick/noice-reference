import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { hasNotch } from 'react-native-device-info';

import { ButtonLarge } from './ButtonLarge';
import { Gutter } from './Gutter';
import { Typography } from './Typography';

import { useIsConnected } from '@hooks/useIsConnected.hook';
import { IconAssets } from '@utils/icons';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description: string;
};

export const EmptyState = ({ icon, title, description }: Props) => {
  const isConnected = useIsConnected();

  if (!isConnected) {
    return (
      <View style={s.container}>
        <Gutter height={96} />
        <IconAssets.WifiOff
          height={64}
          width={64}
        />
        <Gutter height={16} />
        <Typography
          color="textLight"
          fontSize="lg"
          fontWeight="bold"
          lineHeight="xl"
          textAlign="center"
          uppercase
        >
          You seem to be offline
        </Typography>
        <Gutter height={16} />
        <Typography
          color="textLightSecondary"
          fontSize="md"
          fontWeight="regular"
          lineHeight="xl"
          textAlign="center"
        >
          Please check your internet connection and try again.
        </Typography>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Gutter height={96} />
      {icon}
      <Gutter height={16} />
      <Typography
        color="textLight"
        fontSize="lg"
        fontWeight="bold"
        lineHeight="xl"
        textAlign="center"
        uppercase
      >
        {title}
      </Typography>
      <Gutter height={16} />
      <Typography
        color="textLightSecondary"
        fontSize="md"
        fontWeight="regular"
        lineHeight="xl"
        textAlign="center"
      >
        {description}
      </Typography>
    </View>
  );
};

type BottomButtonProps = {
  text: string;
  onPress: () => void;
  onRefresh: () => void;
  show: boolean;
};

export const BottomButton = ({ text, onPress, show, onRefresh }: BottomButtonProps) => {
  const isConnected = useIsConnected();
  const tabBarHeight = useBottomTabBarHeight();

  const containerPositionStyle: ViewStyle = {
    bottom: tabBarHeight + (hasNotch() ? 16 : 32),
  };

  if (show && !isConnected) {
    return (
      <View style={[s.bottomButtonContainer, containerPositionStyle]}>
        <ButtonLarge
          backgroundColor="white"
          textColor="textDark"
          onPress={onRefresh}
        >
          Try again
        </ButtonLarge>
      </View>
    );
  }

  if (!show) {
    return null;
  }

  return (
    <View style={[s.bottomButtonContainer, containerPositionStyle]}>
      <ButtonLarge
        backgroundColor="white"
        textColor="textDark"
        onPress={onPress}
      >
        {text}
      </ButtonLarge>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bottomButtonContainer: {
    paddingHorizontal: 16,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
