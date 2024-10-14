import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './RoleLabel.module.css';

import { ChannelRole } from '@common/profile';

const RoleLabels: Record<ChannelRole, string> = {
  [ChannelRole.Moderator]: 'Moderator',
  [ChannelRole.Streamer]: 'Streamer',
  [ChannelRole.Admin]: 'Noice Staff',
  [ChannelRole.PxAgent]: 'PX Agent',
};

interface RoleLabelProps {
  role: Nullable<ChannelRole>;
}

export function RoleLabel({ role }: RoleLabelProps) {
  if (!role) {
    return null;
  }

  return (
    <span className={styles.channelRole}>
      <RoleLabel.Icon
        className={styles.roleIcon}
        role={role}
      />
      <span className={styles.roleLabel}>{RoleLabels[role]}</span>
    </span>
  );
}

RoleLabel.Icon = function ({ role, className }: RoleLabelProps & { className: string }) {
  if (role === ChannelRole.Moderator) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.RoleModerator}
      />
    );
  }

  if (role === ChannelRole.Streamer) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.RoleStreamer}
      />
    );
  }

  return (
    <Icon
      className={className}
      icon={CoreAssets.Icons.RoleStaff}
    />
  );
};
