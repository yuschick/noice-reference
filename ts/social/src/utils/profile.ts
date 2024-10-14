import { ProfileProfile } from '@social-gen';

const OFFLINE_AFTER_MINUTES = 5;

export const isProfileOnline = (lastSeen: ProfileProfile['lastSeen']) =>
  !!lastSeen &&
  (new Date().getTime() - new Date(lastSeen).getTime()) / 1000 / 60 <
    OFFLINE_AFTER_MINUTES;
