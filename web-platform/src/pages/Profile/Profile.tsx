import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { VisuallyHidden, useAuthenticatedUser } from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import { NotFound } from '../NotFound/NotFound';

import { PrivateProfile } from './PrivateProfile/PrivateProfile';
import { ProfilePageHeader } from './ProfilePageHeader';
import { ProfilePageLayout } from './ProfilePageLayout';
import { PublicProfile } from './PublicProfile/PublicProfile';

import BackgroundImage1000Avif from '@assets/images/collection/noice-collection-bg-1000.avif';
import BackgroundImage1000WebP from '@assets/images/collection/noice-collection-bg-1000.webp';
import BackgroundImage1500Avif from '@assets/images/collection/noice-collection-bg-1500.avif';
import BackgroundImage1500WebP from '@assets/images/collection/noice-collection-bg-1500.webp';
import { PageBackgroundImage } from '@common/page';
import { ProfileProfileVisibility, useProfilePageQuery } from '@gen';

gql`
  query ProfilePage($userTag: String!) {
    resolveUserTags(userTags: [$userTag]) {
      profiles {
        userId
        visibility
        temporary
      }
    }
  }
`;

export function Profile() {
  const { userTag } = useParams<'userTag'>();
  const { userId } = useAuthenticatedUser();

  const { data, loading } = useProfilePageQuery({
    ...variablesOrSkip({ userTag }),
  });

  const profile = data?.resolveUserTags?.profiles[0];

  if (loading) {
    return (
      <ProfilePageLayout>
        <ProfilePageHeader.Loading />
      </ProfilePageLayout>
    );
  }

  if (!profile || profile.temporary) {
    return <NotFound />;
  }

  const profileUserId = profile.userId;

  return (
    <>
      <Helmet>
        <title>{profileUserId === userId ? 'My Profile' : 'Profile'}</title>
      </Helmet>
      <VisuallyHidden>
        <h1>{profileUserId === userId ? 'My Profile' : 'Profile'}</h1>
      </VisuallyHidden>
      <PageBackgroundImage
        sources={[
          {
            srcSet: `${BackgroundImage1000Avif} 1000w, ${BackgroundImage1500Avif} 1500w`,
          },
          {
            srcSet: `${BackgroundImage1000WebP} 1000w, ${BackgroundImage1500WebP} 1500w`,
          },
        ]}
        src={BackgroundImage1000Avif}
      />
      {profile.visibility === ProfileProfileVisibility.ProfileVisibilityPublic ? (
        <PublicProfile profileUserId={profile.userId} />
      ) : (
        <PrivateProfile profileUserId={profile.userId} />
      )}
    </>
  );
}
