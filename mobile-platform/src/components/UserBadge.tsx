import { getBadgeIcon } from '@noice-com/social-react-core';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import { UserBadgeFragment } from '@gen/graphql';

interface Props {
  badge: UserBadgeFragment;
  size?: number;
}

const DEFAULT_SIZE = 16;

export const UserBadge = ({ badge, size = DEFAULT_SIZE }: Props) => {
  const BadgeIcon: FC<SvgProps> | null = getBadgeIcon(badge);

  if (!BadgeIcon) {
    return null;
  }

  return (
    <BadgeIcon
      height={size}
      width={size}
    />
  );
};
