import { Icon, TooltipPortal } from '@noice-com/common-ui';
import { getBadgeIcon, getBadgeName } from '@noice-com/social-react-core';
import classNames from 'classnames';
import { CSSProperties, useRef } from 'react';

import styles from './UserBadge.module.css';

import { UserBadgeFragment } from '@social-gen';

interface Props {
  badge: UserBadgeFragment;
  badgeSize?: number;
  className?: string;
  disableTooltip?: boolean;
  portalElementId?: string;
}

const getBadge = (badge: UserBadgeFragment) => {
  const icon = getBadgeIcon(badge);
  const name = getBadgeName(badge);

  if (!icon) {
    return null;
  }
  return {
    icon,
    name,
  };
};

export function UserBadge({
  badge: badgeData,
  badgeSize = 20,
  className,
  disableTooltip,
  portalElementId,
}: Props) {
  const tooltipAnchor = useRef<HTMLDivElement>(null);

  const badge = getBadge(badgeData);

  if (!badge) {
    return null;
  }

  return (
    <div
      className={classNames(className, styles.badge)}
      ref={tooltipAnchor}
      style={{ '--badge-size': badgeSize } as CSSProperties}
    >
      <TooltipPortal
        anchorRef={tooltipAnchor}
        disabled={disableTooltip}
        placement="top"
        portalElementId={portalElementId}
      >
        {badge.name}
      </TooltipPortal>

      <Icon
        icon={badge.icon}
        size={badgeSize}
        title={`${badge.name} badge`}
      />
    </div>
  );
}
