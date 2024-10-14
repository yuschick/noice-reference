import { gql } from '@apollo/client';
import { generatePath } from 'react-router';

import { ContentModulePage } from '@common/page-components';
import { PermissionLink } from '@common/permission';
import { ChannelChannelRole, UserChannelRolesFragment } from '@gen';

gql`
  fragment UserChannelRoles on ChannelChannelRoles {
    roles
    channel {
      id
      name
    }
  }
`;

interface Props {
  channelRoles: UserChannelRolesFragment[];
}

const getRoleLabel = (role: ChannelChannelRole): string => {
  if (role === ChannelChannelRole.ChannelRoleStreamer) {
    return 'Streamer';
  }

  if (role === ChannelChannelRole.ChannelRoleModerator) {
    return 'Moderator';
  }

  if (role === ChannelChannelRole.ChannelRolePlatformModerator) {
    return 'Platform moderator';
  }

  return 'Unknown';
};

export function UserChannelRoles({ channelRoles }: Props) {
  if (!channelRoles.length) {
    return null;
  }

  const data = channelRoles
    .flatMap((item) => item.roles.map((role) => ({ role, channel: item.channel })))
    .map((item) =>
      (({ channel, role }) => ({
        channel: (
          <PermissionLink
            to={generatePath('/channels/:channelId', { channelId: channel.id })}
          >
            {channel.name}
          </PermissionLink>
        ),
        role: getRoleLabel(role),
      }))(item),
    );

  return (
    <ContentModulePage.TableContent
      data={data}
      title="Channel roles"
    />
  );
}
