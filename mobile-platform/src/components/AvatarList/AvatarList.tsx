import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Avatar } from '@components/Avatar';
import { OuterBorder } from '@components/OuterBorder';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { AvatarViewFragment } from '@gen/graphql';
import { createStylesWithVariants } from '@utils/style';

interface Props {
  avatars: AvatarViewFragment[];
  maxShown?: number;
  totalCount?: number;
  size?: 'default' | 'small';
  style?: StyleProp<ViewStyle>;
}

export function AvatarList({
  avatars,
  totalCount,
  maxShown = 3,
  size = 'default',
  style,
}: Props) {
  const s = getStyleSheet(size);
  const shownAvatars = useMemo(() => avatars.slice(0, maxShown), [avatars, maxShown]);
  const additionalCount = (totalCount ?? avatars.length) - shownAvatars.length;

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      style={[s.container, style]}
      reversed
    >
      {additionalCount > 0 && (
        <OuterBorder
          innerRadius={32}
          width={4}
        >
          <View style={s.morePill}>
            <Typography
              color="textSecondary"
              fontSize="sm"
              fontWeight="semiBold"
            >
              +{additionalCount}
            </Typography>
          </View>
        </OuterBorder>
      )}
      {shownAvatars.map((profile, idx) => (
        <OuterBorder
          color="gray950"
          innerRadius={size === 'small' ? 24 : 32}
          key={`avatar-preview-${profile.userId}`}
          style={idx < shownAvatars.length - 1 && s.stack}
          width={4}
        >
          <Avatar
            profile={profile}
            size={size === 'small' ? 'xSmall' : 'small'}
          />
        </OuterBorder>
      ))}
    </HStack>
  );
}

AvatarList.fragments = {
  profile: Avatar.fragments.profile,
};

const getStyleSheet = createStylesWithVariants(
  {
    container: {
      backgroundColor: colors.gray950,
      borderRadius: 24,
    },
    stack: {
      marginLeft: -12,
    },
    morePill: {
      backgroundColor: colors.gray850,
      borderRadius: 32,
      height: 32,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -12,
    },
  },
  {
    small: {
      morePill: {
        height: 24,
        paddingHorizontal: 12,
      },
    },
  },
);
