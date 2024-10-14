import { AuthPlatformRole } from '@gen';

const platformRoleMap: Record<AuthPlatformRole, { text: string; element?: JSX.Element }> =
  {
    [AuthPlatformRole.PlatformRoleAdmin]: { text: 'admin' },
    [AuthPlatformRole.PlatformRoleBot]: { text: 'bot' },
    [AuthPlatformRole.PlatformRoleGuest]: { text: 'guest' },
    [AuthPlatformRole.PlatformRoleUnspecified]: { text: 'unspecified' },
    [AuthPlatformRole.PlatformRoleUser]: { text: 'user' },
    [AuthPlatformRole.PlatformRoleModerator]: { text: 'moderator' },
    [AuthPlatformRole.PlatformRoleRoot]: { text: 'root' },
    [AuthPlatformRole.PlatformRolePxAgent]: {
      element: (
        <>
          <abbr title="Player Experience">PX</abbr> agent
        </>
      ),
      text: 'PX agent',
    },
    [AuthPlatformRole.PlatformRoleFullUser]: {
      text: 'full user',
    },
    [AuthPlatformRole.PlatformRoleStreamerTooling]: {
      text: 'streamer tooling',
    },
  };

export const getPlatformRoleElement = (role: AuthPlatformRole) =>
  platformRoleMap[role].element ?? platformRoleMap[role].text;

export const getPlatformRoleName = (role: AuthPlatformRole) => platformRoleMap[role].text;

export const hideEmailDomain = (email: string) => {
  const [username] = email.split('@');

  if (!username) {
    return '';
  }

  return `${username}@***`;
};
