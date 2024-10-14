import { BiTable } from 'react-icons/bi';

import { Search } from './pages/Search/Search';

import { Module } from '@common/module';
import { AuthPlatformRole } from '@gen';

export const searchModule: Module = {
  id: 'search',
  title: 'Search',
  isExcludedFromNavigation: true,
  pages: [
    {
      id: ':query/*',
      title: 'Search results',
      component: <Search />,
      description: 'Page with table data',
      icon: BiTable,
      permissions: [
        AuthPlatformRole.PlatformRoleModerator,
        AuthPlatformRole.PlatformRolePxAgent,
      ],
    },
  ],
};
