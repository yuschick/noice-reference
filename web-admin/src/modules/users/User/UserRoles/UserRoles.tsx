import { gql } from '@apollo/client';
import { FormEvent, useState } from 'react';
import { BiPlus, BiTrashAlt } from 'react-icons/bi';

import styles from './UserRoles.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { PermissionWrapper } from '@common/permission';
import { getPlatformRoleElement, getPlatformRoleName } from '@common/profile';
import { showSnackbar } from '@common/snackbar';
import {
  AuthPlatformRole,
  UserRoleProfileFragment,
  useUserRolesUpdateAccountMutation,
} from '@gen';

gql`
  mutation UserRolesUpdateAccount($userId: ID!, $roles: [AuthPlatformRole!]!) {
    updateAccount(body: { userId: $userId, roles: $roles }) {
      uid
      roles
    }
  }
`;

const editableRoles = [
  AuthPlatformRole.PlatformRoleAdmin,
  AuthPlatformRole.PlatformRoleModerator,
  AuthPlatformRole.PlatformRolePxAgent,
  AuthPlatformRole.PlatformRoleRoot,
];

interface Props {
  profile: UserRoleProfileFragment;
}

export function UserRoles({ profile }: Props) {
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const possibleRolesToAdd = editableRoles.filter(
    (role) => !profile.account?.roles.includes(role),
  );

  const [updateRoles] = useUserRolesUpdateAccountMutation({
    update(cache, result) {
      cache.updateFragment(
        {
          id: cache.identify({ userId: profile.userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment UserRoleUpdateProfile on ProfileProfile {
              userId
              account {
                roles
              }
            }
          `,
        },
        (data) => ({
          ...data,
          account: { ...data?.account, roles: result.data?.updateAccount?.roles },
        }),
      );
    },
    onCompleted() {
      showSnackbar('info', 'User roles updated.');
      setShowRoleForm(false);
    },
    onError(error) {
      showSnackbar('error', `Failed to update user roles: ${error.message}`);
    },
  });

  const addRole = (role: AuthPlatformRole) => {
    const ownEditableRoles = editableRoles.filter((role) =>
      profile.account?.roles.includes(role),
    );

    updateRoles({
      variables: {
        userId: profile.userId,
        roles: [...ownEditableRoles, role],
      },
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!Object.values<string>(AuthPlatformRole).includes(selectedRole)) {
      return;
    }

    addRole(selectedRole as AuthPlatformRole);
  };

  const removeRole = (role: AuthPlatformRole) => {
    const ownEditableRoles = editableRoles.filter(
      (r) => r !== role && profile.account?.roles.includes(r),
    );
    updateRoles({
      variables: {
        userId: profile.userId,
        roles: ownEditableRoles,
      },
    });
  };

  const data =
    profile.account?.roles.map((role) => {
      if (editableRoles.includes(role)) {
        return {
          role: getPlatformRoleElement(role),
          action: (
            <PermissionWrapper
              allowedRoles={[AuthPlatformRole.PlatformRoleRoot]}
              forceHideFromAdmin
            >
              <Button
                buttonType="ghost"
                icon={BiTrashAlt}
                text="Remove"
                onClick={() => removeRole(role)}
              />
            </PermissionWrapper>
          ),
        };
      }

      return {
        role: <span className={styles.defaultRole}>{getPlatformRoleElement(role)}</span>,
        action: <span className={styles.defaultRole}>Default</span>,
      };
    }) ?? [];

  return (
    <ContentModulePage.TableContent
      data={data}
      title="Platform roles"
    >
      <PermissionWrapper
        allowedRoles={[AuthPlatformRole.PlatformRoleRoot]}
        forceHideFromAdmin
      >
        <div className={styles.content}>
          {!showRoleForm ? (
            <div>
              <Button
                disabled={!possibleRolesToAdd.length}
                icon={BiPlus}
                text="New role"
                onClick={() => setShowRoleForm(true)}
              />
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={onSubmit}
            >
              <Select
                className={styles.select}
                label="New role"
                options={possibleRolesToAdd.map((role) => ({
                  value: role,
                  label: getPlatformRoleName(role),
                }))}
                onChange={setSelectedRole}
              />

              <div className={styles.buttons}>
                <Button
                  text="Add role"
                  type="submit"
                />

                <Button
                  buttonType="ghost"
                  text="Cancel"
                  onClick={() => setShowRoleForm(false)}
                />
              </div>
            </form>
          )}
        </div>
      </PermissionWrapper>
    </ContentModulePage.TableContent>
  );
}

UserRoles.fragments = {
  profile: gql`
    fragment UserRoleProfile on ProfileProfile {
      userId
      account {
        roles
      }
    }
  `,
};
