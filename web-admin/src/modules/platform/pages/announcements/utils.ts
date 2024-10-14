import { InternalRefetchQueriesInclude } from '@apollo/client';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import { NavigateFunction } from 'react-router';

import {
  ActiveAnnouncementsDocument,
  AnnouncementAmountsDocument,
  AnnouncementAnnouncementStatus,
  DraftAnnouncementsDocument,
  PastAnnouncementsDocument,
  ScheduledAnnouncementsDocument,
} from '@gen';

export const getAnnouncementTime = (time?: Nullable<string>) => {
  if (!time) {
    return undefined;
  }

  return `${DateAndTimeUtils.getShortDate(time, {
    showInUTC: true,
  })} at ${DateAndTimeUtils.getTime(time, { showInUTC: true })}`;
};

const announcementQueryVariables = {
  cursor: {
    first: 25,
  },
};

export const getRefetchQueriesAndNavigateToPageAfterMutation = (
  status: AnnouncementAnnouncementStatus,
  navigate: NavigateFunction,
  oldStatus?: AnnouncementAnnouncementStatus,
) => {
  const queriesToRefetch: InternalRefetchQueriesInclude = [
    { query: AnnouncementAmountsDocument },
  ];

  if (status === AnnouncementAnnouncementStatus.AnnouncementStatusActive) {
    navigate('/platform/announcements/active');
    queriesToRefetch.push({
      query: ActiveAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (status === AnnouncementAnnouncementStatus.AnnouncementStatusScheduled) {
    navigate('/platform/announcements/scheduled');
    queriesToRefetch.push({
      query: ScheduledAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (status === AnnouncementAnnouncementStatus.AnnouncementStatusDraft) {
    navigate('/platform/announcements/draft');
    queriesToRefetch.push({
      query: DraftAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (status === AnnouncementAnnouncementStatus.AnnouncementStatusPast) {
    navigate('/platform/announcements/past');
    queriesToRefetch.push({
      query: PastAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (oldStatus === AnnouncementAnnouncementStatus.AnnouncementStatusActive) {
    queriesToRefetch.push({
      query: ActiveAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (oldStatus === AnnouncementAnnouncementStatus.AnnouncementStatusScheduled) {
    queriesToRefetch.push({
      query: ScheduledAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (oldStatus === AnnouncementAnnouncementStatus.AnnouncementStatusDraft) {
    queriesToRefetch.push({
      query: DraftAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  if (oldStatus === AnnouncementAnnouncementStatus.AnnouncementStatusPast) {
    queriesToRefetch.push({
      query: PastAnnouncementsDocument,
      variables: announcementQueryVariables,
    });
  }

  return queriesToRefetch;
};
