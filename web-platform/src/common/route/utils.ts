import { Path, generatePath, resolvePath } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { AccountRoutes, BrowseRoutes, ChannelRoutes, QueryParams, Routes } from './types';

import { ChannelChannel } from '@gen';

export const fullScreenPages = [Routes.Avatar];

export const excludedFromImplicitAccount = [`${Routes.Settings}/*`, Routes.DailyGoals];

export const channelSubRoutes = Object.values(ChannelRoutes).map((route) => ({
  path: `${Routes.Channel}/${route}`,
}));

export const CHANNEL_STORE_ANCHOR = 'channel-store';

interface ChannelStoreLinkParams {
  channel: Pick<ChannelChannel, 'name'>;
  category?: string;
}

export const getChannelStoreLink = ({
  channel,
  category,
}: ChannelStoreLinkParams): Path =>
  resolvePath({
    pathname: generatePath(Routes.Channel, {
      channelName: channel.name.toLowerCase(),
    }),
    hash: CHANNEL_STORE_ANCHOR,
    search: category
      ? createSearchParams({
          [QueryParams.Category]: category,
        }).toString()
      : undefined,
  });

export const ACCOUNT_DELETED_PATH = `${Routes.Account}${AccountRoutes.AccountDeleted}`;
export const ACCOUNT_SUSPENSION_PATH = `${Routes.Account}${AccountRoutes.PlatformSuspension}`;
export const ACCOUNT_PENDING_AGREEMENTS_PATH = `${Routes.Account}${AccountRoutes.AcceptTerms}`;
export const ACCOUNT_SETUP_AVATAR_PATH = `${Routes.Account}${AccountRoutes.AvatarSetup}`;
export const ACCOUNT_SETUP_BIRTHDAY_PATH = `${Routes.Account}${AccountRoutes.BirthdaySetup}`;

export const redirects = [
  {
    from: '/home',
    to: Routes.Home,
  },
  {
    from: '/stream',
    to: Routes.Home,
  },
  {
    from: '/deleted-account',
    to: ACCOUNT_DELETED_PATH,
  },
  {
    from: '/suspension',
    to: ACCOUNT_SUSPENSION_PATH,
  },
  {
    from: '/accept-terms',
    to: ACCOUNT_PENDING_AGREEMENTS_PATH,
  },
  {
    from: '/setup-account/avatar',
    to: ACCOUNT_SETUP_AVATAR_PATH,
  },
  {
    from: '/setup-account/birthday',
    to: ACCOUNT_SETUP_BIRTHDAY_PATH,
  },
];

export const BROWSE_CHANNELS_PATH = `${Routes.Browse}/${BrowseRoutes.BrowseChannels}`;
export const BROWSE_CATEGORIES_PATH = `${Routes.Browse}/${BrowseRoutes.BrowseCategories}`;
