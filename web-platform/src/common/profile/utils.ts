import { Routes } from '@common/route';
import { ProfileProfile } from '@gen';

export const generateProfileLink = (username: ProfileProfile['userTag']) =>
  Routes.Profile.replace(':userTag', username);
