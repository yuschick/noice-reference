import { useAuthenticatedUser } from '@noice-com/common-ui';

import { useChatContext } from '@chat-context';
import { ChannelChannelRole } from '@chat-gen';

const INPUT_MAX_LENGTH = 280;
const MODERATOR_INPUT_MAX_LENGTH = 500;

export function useChatMessageMaxLength(): number {
  const { hasRole } = useAuthenticatedUser();
  const { userChannelRoles } = useChatContext();

  if (
    hasRole('admin') ||
    userChannelRoles.some((role) =>
      [
        ChannelChannelRole.ChannelRoleModerator,
        ChannelChannelRole.ChannelRoleStreamer,
      ].includes(role),
    )
  ) {
    return MODERATOR_INPUT_MAX_LENGTH;
  }

  return INPUT_MAX_LENGTH;
}
