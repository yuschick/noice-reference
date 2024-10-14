import { BiBroadcast, BiGroup } from 'react-icons/bi';
import { Navigate, Route, Routes, useParams } from 'react-router';

import { ChannelSearch } from './pages/ChannelSearch';
import { UserSearch } from './pages/UserSearch';

import { Tabs } from '@common/button';
import { ModulePage } from '@common/page-components';

const tabs = [
  {
    title: 'Users',
    to: 'users',
    icon: BiGroup,
  },
  {
    title: 'Channels',
    to: 'channels',
    icon: BiBroadcast,
  },
];

export function Search() {
  const { query } = useParams();

  return (
    <ModulePage titleSuffix={`for "${query}"`}>
      <Tabs tabs={tabs} />

      <Routes>
        <Route
          element={<UserSearch />}
          path="users"
        />
        <Route
          element={<ChannelSearch />}
          path="channels"
        />
        <Route
          element={
            <Navigate
              to="/not-found"
              replace
            />
          }
          path="*"
        />
      </Routes>
    </ModulePage>
  );
}
