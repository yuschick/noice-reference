import { CoreAssets } from '@noice-com/assets-core';

import { AnnouncementAnnouncementCategory } from '@common-gen';

export const announcementSystemCategories = [
  AnnouncementAnnouncementCategory.AnnouncementCategorySystem,
  AnnouncementAnnouncementCategory.AnnouncementCategoryPlatform,
];

export const announcementGameCategories = [
  AnnouncementAnnouncementCategory.AnnouncementCategoryGameDbd,
  AnnouncementAnnouncementCategory.AnnouncementCategoryGameDota2,
  AnnouncementAnnouncementCategory.AnnouncementCategoryGameFortnite,
];

export const getAnnouncementCategoryIcon = (
  category: AnnouncementAnnouncementCategory,
) => {
  if (announcementSystemCategories.includes(category)) {
    return CoreAssets.Icons.Exclamation;
  }

  if (announcementGameCategories.includes(category)) {
    return CoreAssets.Icons.Seasons;
  }

  return;
};
