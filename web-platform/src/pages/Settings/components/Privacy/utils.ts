import { Nullable } from '@noice-com/utils';

import { ProfilePrivacySettingsVisibility } from '@gen';

export const getSelectedVisibilities = (
  visibility: Nullable<ProfilePrivacySettingsVisibility>,
) => {
  if (visibility === ProfilePrivacySettingsVisibility.VisibilityFriends) {
    return [ProfilePrivacySettingsVisibility.VisibilityFriends];
  }

  if (visibility === ProfilePrivacySettingsVisibility.VisibilityAll) {
    return [
      ProfilePrivacySettingsVisibility.VisibilityFriends,
      ProfilePrivacySettingsVisibility.VisibilityAll,
    ];
  }

  return [];
};
