import { gql } from '@apollo/client';
import {
  Canvas,
  Circle,
  ColorMatrix,
  Image as SKImage,
  useImage,
  Mask,
} from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Typography } from './Typography';

import { colors, typography } from '@constants/styles';
import { ChannelLogoFragment } from '@gen/graphql';
import { isNonEmptyString } from '@utils/equality';
import { createStylesWithVariants } from '@utils/style';

type LogoSize = 'medium' | 'large' | 'small';

interface Props extends Partial<ChannelLogoFragment> {
  size?: LogoSize;
  isOnline?: boolean;
  hideLiveIndicator?: boolean;
  greyScaleOffline?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

type ChannelImageProps = {
  uri: string;
  name?: string;
  greyScale?: boolean;
  size: LogoSize;
};

const imageSizes: Record<LogoSize, number> = {
  small: 24,
  medium: 40,
  large: 56,
} as const;

// eslint-disable-next-line prettier/prettier
const grayScaleMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
];


const ChannelImage = ({ uri, name, size, greyScale }: ChannelImageProps) => {
  const s = variantStyles(size);
  const imgSize = imageSizes[size];

  const image = useImage(uri);

  if (greyScale) {
    return (
      <Canvas style={{ width: imgSize, height: imgSize }}>
        <Mask
          mask={
            <Circle
              cx={imgSize / 2}
              cy={imgSize / 2}
              r={imgSize / 2}
            />
          }
        >
          <SKImage
            fit="cover"
            height={imgSize}
            image={image}
            width={imgSize}
            x={0}
            y={0}
          >
            <ColorMatrix matrix={grayScaleMatrix} />
          </SKImage>
        </Mask>
      </Canvas>
    );
  }

  return (
    <Image
      alt={`${name}'s logo` ?? 'Channel logo'}
      cachePolicy="disk"
      source={{ uri }}
      style={s.avatar}
    />
  );
};

export function ChannelLogo({
  name,
  logo,
  size = 'medium',
  isOnline = false,
  hideLiveIndicator,
  greyScaleOffline,
  onPress,
  style,
}: Props) {
  const s = variantStyles(size);

  const nameInitials = isNonEmptyString(name) ? name.slice(0, 2) : '';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      style={[s.container, s.containerSize, style]}
      onPress={onPress}
    >
      {!!logo && (
        <ChannelImage
          greyScale={!isOnline && greyScaleOffline}
          name={name}
          size={size}
          uri={logo}
        />
      )}
      {!logo && !!name && (
        <Typography
          fontSize="xl"
          fontWeight="extraBold"
          style={[s.initals, greyScaleOffline && !isOnline && s.opacity]}
        >
          {nameInitials}
        </Typography>
      )}
      {isOnline && !hideLiveIndicator && <View style={s.liveStatus} />}
    </TouchableOpacity>
  );
}

ChannelLogo.fragments = {
  channel: gql`
    fragment ChannelLogo on ChannelChannel {
      logo
      name
    }
  `,
};

const variantStyles = createStylesWithVariants(
  {
    container: {
      width: 40,
      height: 40,
      overflow: 'visible',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray800,
    },
    containerSize: {
      width: 40,
      height: 40,
      borderRadius: 40,
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.gray950,
    },
    liveStatus: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.greenMain,
    },
    initals: {
      fontSize: typography.fontSize.xl,
    },
    opacity: {
      opacity: 0.4,
    },
  },
  {
    small: {
      containerSize: {
        width: 24,
        height: 24,
        borderRadius: 24,
      },
      initals: {
        fontSize: typography.fontSize.xs,
      },
    },
    medium: {},
    large: {
      containerSize: {
        width: 56,
        height: 56,
        borderRadius: 56,
      },
    },
  },
);
