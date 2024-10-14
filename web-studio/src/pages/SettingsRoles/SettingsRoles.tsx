import { useAuthenticatedUser, Button, useDialog, Switch } from '@noice-com/common-ui';

import { AddModeratorDialog } from './AddModeratorDialog/AddModeratorDialog';
import { useModerationRolesData } from './hooks/useModerationRolesData.hook';
import { useModerationSettingsData } from './hooks/useModerationSettingsData.hook';
import { ModeratorList } from './ModeratorList/ModeratorList';
import styles from './SettingsRoles.module.css';

import { PageHeading, LayoutBox, SubHeading } from '@common/layout';
import { PermissionWrapper } from '@common/permission';

export function SettingsRoles() {
  const dialog = useDialog({
    title: 'Add Moderator',
  });
  const { userId } = useAuthenticatedUser();

  const {
    moderators,
    privilegedUsers,
    addModerator,
    hasNextPage,
    onRemoveModerator,
    fetchMoreModerators,
  } = useModerationRolesData();

  const { banAppealsEnabledLoading, banAppealsEnabled, onBanAppealsChange } =
    useModerationSettingsData();

  return (
    <>
      <PageHeading title="Moderation Settings" />

      <LayoutBox>
        <Switch
          checked={banAppealsEnabled}
          description={
            banAppealsEnabled
              ? 'Banned users are able to appeal after they have been banned.'
              : 'Banned users are not able to appeal after they have been banned.'
          }
          isLoading={banAppealsEnabledLoading}
          label="Accept ban appeals"
          onChange={(event) => onBanAppealsChange(event.target.checked)}
        />
      </LayoutBox>

      <div className={styles.moderatorListHeading}>
        <SubHeading title="Moderator List" />

        <PermissionWrapper>
          <div className={styles.addButton}>
            <Button
              level="secondary"
              size="sm"
              onClick={dialog.actions.open}
            >
              + Add moderator
            </Button>

            <AddModeratorDialog
              dialog={dialog}
              myId={userId}
              privilegedUsers={privilegedUsers}
              onAdd={addModerator}
            />
          </div>
        </PermissionWrapper>
      </div>

      <LayoutBox>
        <ModeratorList
          moderators={moderators}
          onRemoveModerator={onRemoveModerator}
        />

        {!!hasNextPage && (
          <Button
            fit="content"
            level="secondary"
            size="sm"
            onClick={fetchMoreModerators}
          >
            Load more
          </Button>
        )}
      </LayoutBox>
    </>
  );
}
