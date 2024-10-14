import { gql } from '@apollo/client';
import { PopoverMenu, useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { generateProfileLink } from '@common/profile';
import { Routes } from '@common/route';
import { ProfileMenuLinksSectionProfileFragment } from '@gen';

gql`
  fragment ProfileMenuLinksSectionProfile on ProfileProfile {
    userTag
  }
`;

interface Props {
  profile: Nullable<ProfileMenuLinksSectionProfileFragment>;
  onLinkClick(): void;
}

export function ProfileMenuLinksSection({ profile, onLinkClick }: Props) {
  const { isFullAccount } = useAuthentication();

  return (
    <>
      {!!isFullAccount &&
        (profile ? (
          <PopoverMenu.Link
            data-ftue-anchor="profile-menu-profile-page"
            to={generateProfileLink(profile.userTag)}
            onClick={onLinkClick}
          >
            Profile Page
          </PopoverMenu.Link>
        ) : (
          <PopoverMenu.Button isLoading>Profile Page</PopoverMenu.Button>
        ))}

      <PopoverMenu.Link
        data-ftue-anchor="profile-menu-customize-avatar"
        to={Routes.Avatar}
        onClick={onLinkClick}
      >
        Customize Avatar
      </PopoverMenu.Link>

      {!!isFullAccount && (
        <PopoverMenu.Link
          data-ftue-anchor="profile-menu-settings"
          state={{ from: location.pathname }}
          to={Routes.Settings}
          onClick={onLinkClick}
        >
          Settings
        </PopoverMenu.Link>
      )}
    </>
  );
}
