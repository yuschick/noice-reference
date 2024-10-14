import { ChannelChannelRole } from '@gen';

export enum AdminChannelRole {
  Admin = 'NOICE_ADMIN',
}

export type ExtendedChannelRole = ChannelChannelRole | AdminChannelRole;

export enum ChannelRole {
  Admin = 'admin',
  Moderator = 'moderator',
  Streamer = 'streamer',
  PxAgent = 'px-agent',
}
