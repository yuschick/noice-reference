import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useState } from 'react';
import { useParams } from 'react-router';

import { DeleteUserDataButton } from './DeleteUserDataButton';
import { EditUsernameModal } from './EditUsernameModal/EditUsernameModal';
import { TermsAndAgreements } from './TermsAndAgreements/TermsAndAgreements';
import styles from './User.module.css';
import { UserChannelRoles } from './UserChannelRoles/UserChannelRoles';
import { UserRoles } from './UserRoles/UserRoles';

import { Button } from '@common/button';
import { TextField, Textarea } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { PermissionWrapper, useUserPermissions } from '@common/permission';
import { HiddenEmailTextField } from '@common/profile';
import { Pill } from '@common/text';
import { AuthIdentityType, AuthPlatformRole, useUserQuery } from '@gen';

gql`
  query User($userId: ID!, $isAdmin: Boolean = false) {
    profile(userId: $userId) {
      userId
      userTag
      bio
      account {
        signupLocation
        createdAt
        uid
        matureRatedContentAllowed
        externalIds {
          type
          id
        }
        ...TermsAndAgreementsAuthAccount
      }
      stats {
        ...UserStats
      }
      ...UserRoleProfile
      ...UserAccountState
      ...DeleteUserProfile
      ...EditUsernameModalProfile
      ...HiddenEmailTextFieldProfile
    }

    userPrivilegedChannels(userId: $userId) @include(if: $isAdmin) {
      channels {
        channelId
        ...UserChannelRoles
      }
    }
  }
`;

export function User() {
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);

  const { isAdmin } = useUserPermissions();

  const { userId } = useParams();
  const { data, error, loading } = useUserQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { userId: userId!, isAdmin },
    skip: !userId,
  });

  if (loading) {
    return <ContentModulePage.Loading />;
  }

  if (error || !data?.profile) {
    return <ContentModulePage.Error />;
  }

  const discordId = data.profile.account?.externalIds.find(
    ({ type }) => type === AuthIdentityType.IdentityTypeDiscord,
  )?.id;

  return (
    <ContentModulePage key={userId}>
      <ContentModulePage.Content title="Profile settings">
        <div className={styles.usernameEditWrapper}>
          <TextField
            className={styles.usernameField}
            defaultValue={data.profile.userTag}
            key={data.profile.userTag}
            label="Username"
            readOnly
          />

          <PermissionWrapper allowedRoles={[AuthPlatformRole.PlatformRolePxAgent]}>
            <Button
              className={styles.usernameEditButton}
              size="small"
              text="Edit"
              onClick={() => setShowEditUsernameModal(true)}
            />
          </PermissionWrapper>
        </div>

        <TextField
          defaultValue={
            data.profile.account?.createdAt
              ? DateAndTimeUtils.getHTMLAttributeTime(
                  data.profile.account.createdAt,
                ).replace('T', ' ')
              : ''
          }
          label="Date created"
          readOnly
        />

        <TextField
          defaultValue={data.profile.account?.signupLocation}
          label="Signup location"
          readOnly
        />

        <TextField
          defaultValue={data.profile.userId}
          label="User id"
          readOnly
        />

        <HiddenEmailTextField profile={data.profile} />

        <Textarea
          defaultValue={data.profile.bio ?? ''}
          label="Bio"
          readOnly
        />

        <TextField
          defaultValue={discordId}
          label="Discord id"
          readOnly
        />
      </ContentModulePage.Content>

      <PermissionWrapper>
        <UserChannelRoles channelRoles={data.userPrivilegedChannels?.channels ?? []} />
      </PermissionWrapper>

      <ContentModulePage.Content title="Mature content">
        <ContentModulePage.TableContent
          data={[
            {
              content: 'Mature-rated',
              status: data.profile.account?.matureRatedContentAllowed ? (
                <Pill
                  text="Allowed"
                  type="positive"
                />
              ) : (
                <Pill text="Not Allowed" />
              ),
            },
          ]}
          title="Terms and agreements"
        />
      </ContentModulePage.Content>

      <PermissionWrapper>
        {data.profile.account && <TermsAndAgreements account={data.profile.account} />}
      </PermissionWrapper>

      <PermissionWrapper>
        <UserRoles profile={data.profile} />
      </PermissionWrapper>

      <PermissionWrapper>
        <DeleteUserDataButton profile={data.profile} />
      </PermissionWrapper>

      {showEditUsernameModal && (
        <EditUsernameModal
          profile={data.profile}
          onClose={() => setShowEditUsernameModal(false)}
        />
      )}
    </ContentModulePage>
  );
}
