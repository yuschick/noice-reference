import { PillType } from '@common/text';
import { AnnouncementAnnouncementCategory, AnnouncementAnnouncementStatus } from '@gen';

export const humanReadableAnnouncementCategories: Record<
  AnnouncementAnnouncementCategory,
  string
> = {
  [AnnouncementAnnouncementCategory.AnnouncementCategoryGameLeagueOfLegends]:
    'Game - League Of Legends',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryGameApexLegends]:
    'Game - Apex Legends',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryGameDbd]:
    'Game - Dead By Daylight',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryGameDota2]: 'Game - Dota 2',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryGameFortnite]: 'Game - Fortnite',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryPlatform]: 'Platform',
  [AnnouncementAnnouncementCategory.AnnouncementCategorySystem]: 'System',
  [AnnouncementAnnouncementCategory.AnnouncementCategoryUnspecified]: 'Unspecified',
};
export const announcementStatusPillTextMap: Record<
  AnnouncementAnnouncementStatus,
  string
> = {
  [AnnouncementAnnouncementStatus.AnnouncementStatusDraft]: 'Draft',
  [AnnouncementAnnouncementStatus.AnnouncementStatusScheduled]: 'Scheduled',
  [AnnouncementAnnouncementStatus.AnnouncementStatusActive]: 'Active',
  [AnnouncementAnnouncementStatus.AnnouncementStatusPast]: 'Past',
  [AnnouncementAnnouncementStatus.AnnouncementStatusUnspecified]: '',
};

export const announcementStatusPillTypeMap: Record<
  AnnouncementAnnouncementStatus,
  PillType
> = {
  [AnnouncementAnnouncementStatus.AnnouncementStatusDraft]: 'info',
  [AnnouncementAnnouncementStatus.AnnouncementStatusScheduled]: 'warning',
  [AnnouncementAnnouncementStatus.AnnouncementStatusActive]: 'positive',
  [AnnouncementAnnouncementStatus.AnnouncementStatusPast]: 'default',
  [AnnouncementAnnouncementStatus.AnnouncementStatusUnspecified]: 'error',
};
