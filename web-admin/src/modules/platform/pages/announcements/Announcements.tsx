import { gql } from '@apollo/client';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import { ActiveAnnouncements } from './pages/active/ActiveAnnouncements';
import { DraftAnnouncements } from './pages/draft/DraftAnnouncements';
import { PastAnnouncements } from './pages/past/PastAnnouncements';
import { ScheduledAnnouncements } from './pages/scheduled/ScheduledAnnouncements';
import { AnnouncementQueries } from './types';

import { Tabs } from '@common/button';
import { ModulePage } from '@common/page-components';
import { PillType } from '@common/text';
import { useAnnouncementAmountsQuery } from '@gen';

const tabsWithoutAmounts: {
  to: AnnouncementQueries;
  title: string;
  type: PillType;
}[] = [
  {
    title: 'Active',
    to: 'active',
    type: 'positive',
  },
  {
    title: 'Scheduled',
    to: 'scheduled',
    type: 'warning',
  },
  {
    title: 'Draft',
    to: 'draft',
    type: 'info',
  },
  {
    title: 'Past',
    to: 'past',
    type: 'default',
  },
];

gql`
  query AnnouncementAmounts {
    active: announcements(filter: { statuses: [ANNOUNCEMENT_STATUS_ACTIVE] }) {
      totalCount
    }
    scheduled: announcements(filter: { statuses: [ANNOUNCEMENT_STATUS_SCHEDULED] }) {
      totalCount
    }
    draft: announcements(filter: { statuses: [ANNOUNCEMENT_STATUS_DRAFT] }) {
      totalCount
    }
    past: announcements(filter: { statuses: [ANNOUNCEMENT_STATUS_PAST] }) {
      totalCount
    }
  }
`;

export function Announcements() {
  const [tabs, setTabs] = useState(tabsWithoutAmounts);

  useAnnouncementAmountsQuery({
    onCompleted(data) {
      setTabs(
        tabsWithoutAmounts.map((tab) => ({
          ...tab,
          totalAmount: data[tab.to]?.totalCount || undefined,
        })),
      );
    },
  });

  return (
    <ModulePage>
      <Tabs tabs={tabs} />

      <Routes>
        <Route
          element={<ActiveAnnouncements />}
          path="active"
        />
        <Route
          element={<ScheduledAnnouncements />}
          path="scheduled"
        />
        <Route
          element={<DraftAnnouncements />}
          path="draft"
        />
        <Route
          element={<PastAnnouncements />}
          path="past"
        />

        <Route
          element={
            <Navigate
              to="active"
              replace
            />
          }
          path=""
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
