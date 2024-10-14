import {
  ArenaConfig,
  ArenaConfigAvatarSlot,
  ArenaConfigTeamLocator,
  AvatarConfigsAvatar,
} from '@noice-com/schemas/rendering/config.pb';

// #region Arena Config
export const createAvatarConfig = (index: number): ArenaConfigAvatarSlot => ({
  slotIndex: index,
  position: {
    x: index,
    y: index,
    z: index,
  },
  rotation: {
    y: index,
    w: index,
  },
});

export const createGroupConfig = (
  index: number,
  isLocal = false,
): ArenaConfigTeamLocator => ({
  teamIndex: index,
  isLocalTeam: isLocal,
  avatarSlots: [
    createAvatarConfig(0),
    createAvatarConfig(1),
    createAvatarConfig(2),
    createAvatarConfig(3),
  ],
});

export const createArenaConfig = (
  name: string,
  teamLocators: ArenaConfigTeamLocator[],
): ArenaConfig => ({
  name,
  teamLocators,
  cameras: [],
  lights: [],
  renderSettings: {},
});
// #endregion Arena Config
// #region Avatars

export const createRemoteAvatarConfig = (
  userId: string,
  groupId: string,
  slotIndex: number,
): AvatarConfigsAvatar => ({
  userId,
  groupId,
  slotIndex,
  url: 'path/to/avatar.glb',
  lodUrls: ['path/to/lod_0.glb', 'path/to/lod_1.glb'],
  generatorVersion: undefined,
});

// #endregion Avatars
